import assert from "node:assert/strict";
import { test } from "node:test";

const { calculateMaterials, catalog, createEmptySnapshot, parseSnapshot } = await import(
  process.env.DMZ_TEST_RUNTIME
);

function craft(recipeId, quantity, outputPerCraft) {
  return {
    kind: "craft",
    recipeId,
    quantity,
    ...(outputPerCraft === undefined ? {} : { outputPerCraft }),
  };
}

function inventory(items = {}) {
  return { items, cash: null };
}

function reported(value) {
  return { status: "reported", value, sourceIds: ["source:test"] };
}

function recipe(output = 3, materials = 2, cash = 7) {
  return {
    id: "recipe:test",
    output: { itemId: "item:product", quantity: reported(output) },
    cost: reported({ items: [{ itemId: "item:metals", quantity: materials }], cash }),
    requires: reported([]),
  };
}

function rowsById(result) {
  assert.equal(result.isOk(), true);
  return new Map(result.value.rows.map((row) => [row.itemId, row]));
}

function hasIssue(result, code) {
  assert.equal(result.isErr(), true);
  assert.ok(
    result.error.some((issue) => issue.code === code),
    `Missing issue: ${code}`,
  );
}

test("已知样本成本配合显式产量计算直接材料，来源和库存保持不变", () => {
  const targets = [craft("recipe:bandage", 4, 1), craft("recipe:medium-backpack", 1, 1)];
  const stock = inventory({
    "item:synthetics": 35,
    "item:chemicals": 10,
    "item:rigid-synthetics": 2,
  });
  const before = JSON.stringify({ targets, stock, recipes: catalog.recipes });
  const result = calculateMaterials(targets, catalog.recipes, stock);
  const rows = rowsById(result);
  assert.equal(rows.size, 3);
  for (const [itemId, required, owned, missing] of [
    ["item:synthetics", 110, 35, 75],
    ["item:chemicals", 60, 10, 50],
    ["item:rigid-synthetics", 5, 2, 3],
  ]) {
    const row = rows.get(itemId);
    assert.equal(row.required, required);
    assert.equal(row.owned.isSome(), true);
    assert.equal(row.owned.value, owned);
    assert.equal(row.missing.isSome(), true);
    assert.equal(row.missing.value, missing);
  }
  assert.equal(result.value.cash.isNone(), true);
  assert.equal(JSON.stringify({ targets, stock, recipes: catalog.recipes }), before);
});

test("多个目标共享一次库存抵扣，兼容已有搜集目标", () => {
  const targets = [
    craft("recipe:bandage", 2, 1),
    craft("recipe:bandage", 2, 1),
    { kind: "collect", itemId: "item:synthetics", quantity: 10 },
  ];
  const result = calculateMaterials(targets, catalog.recipes, inventory({ "item:synthetics": 35 }));
  const row = rowsById(result).get("item:synthetics");
  assert.equal(row.required, 70);
  assert.equal(row.missing.value, 35);
});

test("未录入库存与显式零分开，多余库存不会产生负缺口", () => {
  const targets = [craft("recipe:bandage", 2, 1)];
  const rows = rowsById(
    calculateMaterials(targets, catalog.recipes, inventory({ "item:synthetics": 0 })),
  );
  assert.equal(rows.get("item:synthetics").owned.isSome(), true);
  assert.equal(rows.get("item:synthetics").missing.value, 30);
  assert.equal(rows.get("item:chemicals").owned.isNone(), true);
  assert.equal(rows.get("item:chemicals").missing.isNone(), true);

  const surplus = rowsById(
    calculateMaterials(targets, catalog.recipes, inventory({ "item:synthetics": 100 })),
  );
  assert.equal(surplus.get("item:synthetics").missing.value, 0);
});

test("使用来源已记载产量并向上取打印次数，现金成本未知与零分开", () => {
  const result = calculateMaterials([craft("recipe:test", 4, 99)], [recipe()], inventory());
  assert.equal(rowsById(result).get("item:metals").required, 4);
  assert.equal(result.value.cash.isSome(), true);
  assert.equal(result.value.cash.value, 14);

  const free = calculateMaterials([craft("recipe:test", 1)], [recipe(1, 1, 0)], inventory());
  assert.equal(free.value.cash.isSome(), true);
  assert.equal(free.value.cash.value, 0);
  const mixed = calculateMaterials(
    [craft("recipe:test", 1), craft("recipe:bandage", 1, 1)],
    [recipe(), ...catalog.recipes],
    inventory(),
  );
  assert.equal(mixed.value.cash.isNone(), true);
});

test("未知或冲突信息不被默认为产量一或任选成本版本", () => {
  hasIssue(
    calculateMaterials([craft("recipe:bandage", 1)], catalog.recipes, inventory()),
    "unknown-output",
  );
  hasIssue(
    calculateMaterials([craft("recipe:radiation-blockers", 1, 1)], catalog.recipes, inventory()),
    "conflicting-cost",
  );
  hasIssue(
    calculateMaterials([craft("recipe:missing", 1, 1)], catalog.recipes, inventory()),
    "unknown-recipe",
  );
  const unknownCost = { ...recipe(), cost: { status: "unknown", note: "Not collected" } };
  hasIssue(
    calculateMaterials([craft("recipe:test", 1)], [unknownCost], inventory()),
    "unknown-cost",
  );
  const conflictingOutput = {
    ...recipe(),
    output: {
      itemId: "item:product",
      quantity: { status: "conflicting", claims: [reported(1), reported(2)], note: "Disagrees" },
    },
  };
  hasIssue(
    calculateMaterials([craft("recipe:test", 1, 1)], [conflictingOutput], inventory()),
    "conflicting-output",
  );
});

test("非法数量、库存及材料和现金溢出返回错误，安全整数边界仍精确", () => {
  for (const quantity of [0, -1, 0.5, NaN, Infinity, Number.MAX_SAFE_INTEGER + 1]) {
    hasIssue(
      calculateMaterials([craft("recipe:test", quantity)], [recipe()], inventory()),
      "invalid-quantity",
    );
  }
  hasIssue(
    calculateMaterials([craft("recipe:test", 1, 0)], [recipe()], inventory()),
    "invalid-quantity",
  );
  hasIssue(
    calculateMaterials([craft("recipe:test", 1)], [recipe(0)], inventory()),
    "invalid-quantity",
  );
  hasIssue(
    calculateMaterials([craft("recipe:test", 1)], [recipe()], inventory({ "item:metals": -1 })),
    "invalid-inventory",
  );
  hasIssue(
    calculateMaterials(
      [craft("recipe:test", Number.MAX_SAFE_INTEGER)],
      [recipe(1, 2, 0)],
      inventory(),
    ),
    "overflow",
  );
  hasIssue(
    calculateMaterials(
      [
        { kind: "collect", itemId: "item:metals", quantity: Number.MAX_SAFE_INTEGER },
        { kind: "collect", itemId: "item:metals", quantity: 1 },
      ],
      [],
      inventory(),
    ),
    "overflow",
  );
  hasIssue(
    calculateMaterials(
      [craft("recipe:test", 2)],
      [recipe(1, 1, Number.MAX_SAFE_INTEGER)],
      inventory(),
    ),
    "overflow",
  );
  const large = calculateMaterials(
    [craft("recipe:test", Number.MAX_SAFE_INTEGER)],
    [recipe(2, 1, 0)],
    inventory(),
  );
  assert.equal(rowsById(large).get("item:metals").required, 4503599627370496);
});

test("用户单次产量可随版本一存档往返，拒绝无效新增字段", () => {
  const snapshot = createEmptySnapshot();
  snapshot.plans.push({
    id: "plan:print",
    title: "打印清单",
    status: "active",
    priority: 0,
    targets: [craft("recipe:bandage", 4, 2)],
  });
  const parsed = parseSnapshot(JSON.stringify(snapshot));
  assert.equal(parsed.status, "ready");
  assert.equal(parsed.snapshot.plans[0].targets[0].outputPerCraft, 2);
  for (const quantity of [0, -1, 0.5, null, Number.MAX_SAFE_INTEGER + 1]) {
    snapshot.plans[0].targets[0].outputPerCraft = quantity;
    assert.equal(parseSnapshot(JSON.stringify(snapshot)).status, "invalid");
  }
  delete snapshot.plans[0].targets[0].outputPerCraft;
  assert.equal(parseSnapshot(JSON.stringify(snapshot)).status, "ready");
});
