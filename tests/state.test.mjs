import assert from "node:assert/strict";
import { test } from "node:test";
import { Err, Ok, Option } from "ts-results-es";

// 指向通过 Vite/Rolldown 打包的入口，不需要为测试安装另一个 TS 转换器。
const {
  createStores,
  createInventoryStore,
  createPlansStore,
  createUnlocksStore,
  createEmptySnapshot,
  loadSnapshot,
  saveSnapshot,
  parseSnapshot,
  STORAGE_KEY,
} = await import(process.env.DMZ_TEST_RUNTIME);

function memoryStorage(initial) {
  let value = initial;
  let writes = 0;
  return {
    get writes() {
      return writes;
    },
    async get(key) {
      assert.equal(key, STORAGE_KEY);
      return Ok(Option.fromOptional(value));
    },
    async set(key, text) {
      assert.equal(key, STORAGE_KEY);
      value = text;
      writes++;
      return Ok(undefined);
    },
    async delete(key) {
      assert.equal(key, STORAGE_KEY);
      value = undefined;
      writes++;
      return Ok(undefined);
    },
  };
}

test("恢复存档不会先用空状态覆盖数据，保存只在显式调用时发生", async () => {
  const snapshot = createEmptySnapshot();
  snapshot.inventory.items["item:metals"] = 6;
  const storage = memoryStorage(JSON.stringify(snapshot));
  const loaded = await loadSnapshot(storage);
  assert.equal(loaded.status, "ready");
  const stores = createStores(loaded.snapshot);
  assert.equal(stores.inventory.state.value.items["item:metals"], 6);
  assert.equal(storage.writes, 0);
  stores.inventory.setQuantity("item:metals", 7);
  assert.equal(storage.writes, 0);
  assert.equal((await saveSnapshot(storage, stores.snapshot())).status, "saved");
  assert.equal((await loadSnapshot(storage)).snapshot.inventory.items["item:metals"], 7);
});

test("损坏、未来版本及不可用的存储不被静默改写", async () => {
  for (const [text, status] of [
    ["{", "invalid"],
    ["", "invalid"],
    [JSON.stringify({ schemaVersion: 2 }), "unsupported-version"],
    [undefined, "empty"],
  ]) {
    const storage = memoryStorage(text);
    assert.equal((await loadSnapshot(storage)).status, status);
    assert.equal(storage.writes, 0);
  }
  const denied = {
    async get(key) {
      return Err({
        code: "access-denied",
        operation: "get",
        key,
        cause: new Error("denied"),
      });
    },
    async set(key) {
      return Err({
        code: "quota-exceeded",
        operation: "set",
        key,
        cause: new Error("quota"),
      });
    },
  };
  assert.equal((await loadSnapshot(denied)).status, "unavailable");
  assert.equal((await saveSnapshot(denied, createEmptySnapshot())).status, "failed");
});

test("无效导入保持全部现有状态，显式 0 与未录入数量不同", () => {
  const stores = createStores();
  stores.inventory.setQuantity("item:metals", 0);
  stores.unlocks.setRecipe("recipe:bandage", "unlocked");
  const before = stores.snapshot();
  assert.equal(stores.inventory.state.value.items["item:metals"], 0);
  assert.equal(stores.inventory.state.value.items["item:chemicals"], undefined);
  const invalid = structuredClone(before);
  invalid.inventory.items["item:metals"] = -1;
  assert.equal(stores.importJson(JSON.stringify(invalid)).status, "invalid");
  assert.deepEqual(stores.snapshot(), before);
  stores.inventory.forgetQuantity("item:metals");
  assert.equal(stores.inventory.state.value.items["item:metals"], undefined);
});

test("导入、导出及实例间的对象互不共享可变引用", () => {
  const input = createEmptySnapshot();
  input.inventory.items["item:metals"] = 6;
  const first = createStores(input);
  const second = createStores(input);
  input.inventory.items["item:metals"] = 999;
  first.inventory.setQuantity("item:metals", 7);
  const exported = first.snapshot();
  exported.inventory.items["item:metals"] = 888;
  assert.equal(first.inventory.state.value.items["item:metals"], 7);
  assert.equal(second.inventory.state.value.items["item:metals"], 6);
  first.unlocks.setManual("item:manual-m4", "unlocked");
  const imported = second.importJson(JSON.stringify(first.snapshot()));
  assert.equal(imported.status, "ready");
  imported.snapshot.inventory.items["item:metals"] = 777;
  assert.equal(second.inventory.state.value.items["item:metals"], 7);
  assert.equal(second.unlocks.state.value.manuals["item:manual-m4"].status, "unlocked");
});

test("拒绝无效数值、目标及重复计划，编辑计划不扣库存", () => {
  const stores = createStores();
  for (const value of [-1, 0.5, NaN, Infinity, Number.MAX_SAFE_INTEGER + 1]) {
    assert.throws(() => stores.inventory.setQuantity("item:metals", value));
  }
  stores.inventory.setQuantity("item:metals", 6);
  const plan = {
    id: "plan:kit",
    title: "装备",
    status: "active",
    priority: 1,
    targets: [{ kind: "craft", recipeId: "recipe:bandage", quantity: 2 }],
  };
  stores.plans.upsert(plan);
  plan.targets[0].quantity = 100;
  assert.equal(stores.plans.state.value[0].targets[0].quantity, 2);
  assert.equal(stores.inventory.state.value.items["item:metals"], 6);
  const invalid = stores.snapshot();
  invalid.plans.push(structuredClone(invalid.plans[0]));
  assert.equal(parseSnapshot(JSON.stringify(invalid)).status, "invalid");
});

test("子 store 构造和 replace 同样校验边界，拒绝更新后保留原状态", () => {
  const stores = createStores();
  stores.inventory.setQuantity("item:metals", 6);
  stores.unlocks.setManual("item:manual-m4", "unlocked");
  const before = stores.snapshot();
  const badInventory = { items: { "item:metals": -1 }, cash: null };
  const badUnlocks = { ...before.unlocks, dmzLevel: 0.5 };
  const badPlans = [
    { id: "plan:test", title: "测试", status: "active", priority: -1, targets: [] },
  ];

  assert.throws(() => createInventoryStore(badInventory));
  assert.throws(() => createUnlocksStore(badUnlocks));
  assert.throws(() => createPlansStore(badPlans));
  assert.throws(() => stores.inventory.replace(badInventory));
  assert.throws(() => stores.unlocks.replace(badUnlocks));
  assert.throws(() => stores.plans.replace(badPlans));
  assert.throws(() => stores.unlocks.setRecipe("item:bandage", "unlocked"));
  assert.throws(() => stores.unlocks.setManual("item:", "unlocked"));
  assert.throws(() => stores.unlocks.setCapability("unknown-capability", "unlocked"));
  assert.throws(() => stores.unlocks.setRecipe("recipe:bandage", "invalid-status"));
  assert.deepEqual(stores.snapshot(), before);
});
