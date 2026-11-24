import assert from "node:assert/strict";
import { setImmediate } from "node:timers/promises";
import { test } from "node:test";
import { Err, None, Ok, Some } from "ts-results-es";

const { createAppState, createEmptySnapshot, perks, STORAGE_KEY } = await import(
  process.env.DMZ_TEST_RUNTIME
);

function memoryKV(snapshot) {
  let text = snapshot ? JSON.stringify(snapshot) : undefined;
  const calls = { reads: 0, writes: 0 };
  return {
    calls,
    async get(key) {
      assert.equal(key, STORAGE_KEY);
      calls.reads++;
      return Ok(text === undefined ? None : Some(text));
    },
    async set(key, value) {
      assert.equal(key, STORAGE_KEY);
      calls.writes++;
      text = value;
      return Ok(undefined);
    },
    async delete() {
      text = undefined;
      return Ok(undefined);
    },
  };
}

test("应用状态显式加载且不隐式保存，重复加载不覆盖已经编辑的状态", async () => {
  const original = createEmptySnapshot();
  original.inventory.items["item:metals"] = 6;
  const kv = memoryKV(original);
  const app = createAppState(kv);
  assert.deepEqual(kv.calls, { reads: 0, writes: 0 });
  assert.equal(await app.persist(), false);
  assert.equal(kv.calls.writes, 0);

  await app.load();
  assert.equal(app.loadStatus.value, "ready");
  assert.equal(app.stores.inventory.state.value.items["item:metals"], 6);
  app.stores.inventory.setQuantity("item:metals", 7);
  assert.equal(kv.calls.writes, 0);
  await app.load();
  assert.equal(kv.calls.reads, 1);
  assert.equal(app.stores.inventory.state.value.items["item:metals"], 7);

  assert.equal(await app.persist(), true);
  assert.equal(kv.calls.writes, 1);
  assert.equal(app.saveStatus.value, "saved");
  assert.equal(app.saveIssue.value.isNone(), true);
});

test("加载失败保留状态并阻断保存，可以重试读取有效存档", async () => {
  const inaccessible = {
    code: "access-denied",
    operation: "get",
    key: STORAGE_KEY,
    cause: new Error("blocked"),
  };
  for (const [initial, status] of [
    [Ok(Some("{")), "invalid"],
    [Ok(Some(JSON.stringify({ schemaVersion: 2 }))), "unsupported-version"],
    [Err(inaccessible), "unavailable"],
  ]) {
    let response = initial;
    let writes = 0;
    const app = createAppState({
      async get() {
        return response;
      },
      async set() {
        writes++;
        return Ok(undefined);
      },
    });
    app.stores.inventory.setQuantity("item:metals", 9);
    await app.load();
    assert.equal(app.loadStatus.value, "error");
    assert.equal(app.loadIssue.value.isSome(), true);
    assert.equal(app.loadIssue.value.value.status, status);
    assert.equal(app.stores.inventory.state.value.items["item:metals"], 9);
    await app.persist();
    assert.equal(writes, 0);

    const recovered = createEmptySnapshot();
    recovered.inventory.items["item:metals"] = 4;
    response = Ok(Some(JSON.stringify(recovered)));
    await app.load();
    assert.equal(app.loadStatus.value, "ready");
    assert.equal(app.loadIssue.value.isNone(), true);
    assert.equal(app.stores.inventory.state.value.items["item:metals"], 4);
  }
});

test("同时请求加载共用一次读取，读取完成前不会保存默认状态", async () => {
  const read = Promise.withResolvers();
  let reads = 0;
  let writes = 0;
  const app = createAppState({
    get() {
      reads++;
      return read.promise;
    },
    async set() {
      writes++;
      return Ok(undefined);
    },
  });
  const first = app.load();
  const second = app.load();
  assert.equal(first, second);
  await app.persist();
  assert.equal(reads, 1);
  assert.equal(writes, 0);
  assert.equal(app.loadStatus.value, "loading");
  read.resolve(Ok(None));
  await first;
  assert.equal(app.loadStatus.value, "ready");
});

test("连续保存按调用顺序写入，各自使用调用时快照", async () => {
  const writes = [];
  const gates = [Promise.withResolvers(), Promise.withResolvers()];
  const app = createAppState({
    async get() {
      return Ok(None);
    },
    async set(key, text) {
      assert.equal(key, STORAGE_KEY);
      const index = writes.length;
      writes.push(JSON.parse(text));
      return gates[index].promise;
    },
  });
  await app.load();
  app.stores.inventory.setQuantity("item:metals", 5);
  const first = app.persist();
  app.stores.inventory.setQuantity("item:metals", 8);
  const second = app.persist();
  app.stores.inventory.setQuantity("item:metals", 12);
  await setImmediate();
  assert.equal(writes.length, 1);
  assert.equal(writes[0].inventory.items["item:metals"], 5);
  assert.equal(app.saveStatus.value, "saving");

  const failure = { code: "unavailable", operation: "set", key: STORAGE_KEY, cause: "offline" };
  gates[0].resolve(Err(failure));
  assert.equal(await first, false);
  await setImmediate();
  assert.equal(writes.length, 2);
  assert.equal(writes[1].inventory.items["item:metals"], 8);
  assert.equal(app.saveStatus.value, "saving");
  gates[1].resolve(Ok(undefined));
  assert.equal(await second, true);
  assert.equal(app.saveStatus.value, "saved");
  assert.equal(app.stores.inventory.state.value.items["item:metals"], 12);
});

test("写入 Err 不阻断后续重试，重试保存最新状态并保留失败诊断", async () => {
  const issue = {
    code: "quota-exceeded",
    operation: "set",
    key: STORAGE_KEY,
    cause: new Error("full"),
  };
  let fail = true;
  let saved;
  const app = createAppState({
    async get() {
      return Ok(None);
    },
    async set(key, text) {
      if (fail) return Err(issue);
      saved = JSON.parse(text);
      return Ok(undefined);
    },
  });
  await app.load();
  app.stores.inventory.setQuantity("item:metals", 5);
  await app.persist();
  assert.equal(app.saveStatus.value, "error");
  assert.equal(app.saveIssue.value.isSome(), true);
  assert.equal(app.saveIssue.value.value.error, issue);
  assert.equal(app.stores.inventory.state.value.items["item:metals"], 5);

  fail = false;
  app.stores.inventory.setQuantity("item:metals", 8);
  await app.persist();
  assert.equal(saved.inventory.items["item:metals"], 8);
  assert.equal(app.saveStatus.value, "saved");
  assert.equal(app.saveIssue.value.isNone(), true);
});

test("旧 v1 存档可记录和清除特性树，重载后保留全部既有进度", async () => {
  const legacy = createEmptySnapshot();
  delete legacy.perks;
  legacy.inventory.items["item:metals"] = 6;
  legacy.unlocks.manuals["item:manual-m4"] = {
    status: "unlocked",
    updatedAt: "2026-11-05T00:00:00.000Z",
  };
  legacy.plans.push({
    id: "plan:bandage",
    title: "绷带",
    status: "active",
    priority: 0,
    targets: [{ kind: "craft", recipeId: "recipe:bandage", quantity: 2 }],
  });
  const kv = memoryKV(legacy);
  const app = createAppState(kv);
  await app.load();
  const empty = app.stores.perks.state.value;
  assert.deepEqual(empty, { warfighter: [], scout: [], survivalist: [], prestige: [] });
  assert.equal(kv.calls.writes, 0);

  const id = perks.find((perk) => perk.kind === "prestige").wireId;
  const build = { ...empty, prestige: [id] };
  assert.equal(app.stores.perks.replace(build).isOk(), true);
  build.prestige.length = 0;
  await app.persist();

  const reopened = createAppState(kv);
  await reopened.load();
  assert.deepEqual(reopened.stores.snapshot(), { ...legacy, perks: { ...empty, prestige: [id] } });
  assert.equal(reopened.stores.perks.replace(empty).isOk(), true);
  await reopened.persist();
  const cleared = createAppState(kv);
  await cleared.load();
  assert.deepEqual(cleared.stores.snapshot(), { ...legacy, perks: empty });
});

test("无效特性选择和导入不改变原记录，损坏的特性存档阻止写入", async () => {
  const app = createAppState(memoryKV());
  await app.load();
  const empty = app.stores.perks.state.value;
  const id = perks.find((perk) => perk.kind === "prestige").wireId;
  assert.equal(app.stores.perks.replace({ ...empty, prestige: [id] }).isOk(), true);
  const before = app.stores.snapshot();
  const invalid = { ...empty, warfighter: [-1] };
  assert.equal(app.stores.perks.replace(invalid).isErr(), true);
  const damaged = { ...before, perks: invalid, inventory: { items: {}, cash: 3500 } };
  assert.equal(app.stores.importJson(JSON.stringify(damaged)).status, "invalid");
  assert.deepEqual(app.stores.snapshot(), before);

  const kv = memoryKV(damaged);
  const blocked = createAppState(kv);
  await blocked.load();
  assert.equal(blocked.loadIssue.value.value.status, "invalid");
  await blocked.persist();
  assert.equal(kv.calls.writes, 0);
});

test("旧特性树保留未记录的小特性位置，左右位置随各次快照独立保存", async () => {
  const legacy = createEmptySnapshot();
  legacy.perks = { ...legacy.perks, scout: [1, 2] };
  const kv = memoryKV(legacy);
  const writes = [];
  const app = createAppState({
    ...kv,
    async set(key, text) {
      writes.push(JSON.parse(text).perks);
      return kv.set(key, text);
    },
  });
  await app.load();
  assert.deepEqual(app.stores.perks.state.value, legacy.perks);
  assert.equal(kv.calls.writes, 0);

  const left = { ...legacy.perks, minorPositions: { scout: { 2: 0 } } };
  const right = { ...legacy.perks, minorPositions: { scout: { 2: 2 } } };
  assert.equal(app.stores.perks.replace(left).isOk(), true);
  const first = app.persist();
  assert.equal(app.stores.perks.replace(right).isOk(), true);
  const second = app.persist();
  assert.deepEqual(await Promise.all([first, second]), [true, true]);
  assert.deepEqual(writes, [left, right]);

  const reopened = createAppState(kv);
  await reopened.load();
  assert.deepEqual(reopened.stores.perks.state.value, right);
  const beyondSelectedRows = { ...right, minorPositions: { scout: { 4: 0 } } };
  assert.equal(reopened.stores.perks.replace(beyondSelectedRows).isErr(), true);
  assert.deepEqual(reopened.stores.snapshot().perks, right);
});
