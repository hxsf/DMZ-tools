import assert from "node:assert/strict";
import { test } from "node:test";

const { catalog } = await import(process.env.DMZ_TEST_RUNTIME);
const items = new Map(catalog.items.map((item) => [item.id, item]));
const sources = new Set(catalog.sources.map((source) => source.id));
const capabilities = new Set(catalog.capabilities.map((capability) => capability.id));

function claims(fact) {
  if (fact.status === "reported") return [fact];
  if (fact.status === "conflicting") {
    assert.ok(fact.claims.length >= 2);
    return fact.claims;
  }
  assert.equal(fact.status, "unknown");
  assert.ok(fact.note.length > 0);
  return [];
}

function checkCondition(condition) {
  if (condition.kind === "capability") assert.ok(capabilities.has(condition.capabilityId));
  if (condition.kind === "dmz-level") {
    assert.ok(Number.isSafeInteger(condition.level) && condition.level > 0);
  }
  if (condition.kind === "any" || condition.kind === "all") {
    assert.ok(condition.conditions.length > 0);
    condition.conditions.forEach(checkCondition);
  }
}

test("资料 ID 唯一，所有字段来源均可追溯，日期不超出查阅日期", () => {
  for (const records of [catalog.items, catalog.recipes, catalog.capabilities, catalog.sources]) {
    assert.equal(new Set(records.map((record) => record.id)).size, records.length);
  }
  function visit(value) {
    if (!value || typeof value !== "object") return;
    if ("sourceIds" in value) {
      assert.ok(value.sourceIds.length > 0);
      value.sourceIds.forEach((id) => assert.ok(sources.has(id), `缺少来源 ${id}`));
    }
    Object.values(value).forEach(visit);
  }
  visit(catalog);
  for (const source of catalog.sources) {
    assert.equal(new URL(source.url).protocol, "https:");
    for (const date of [source.accessedOn, source.publishedOn, source.updatedOn]) {
      if (date === null) continue;
      assert.match(date, /^\d{4}-\d{2}-\d{2}$/);
      assert.ok(Number.isFinite(Date.parse(date)));
      assert.ok(date <= source.accessedOn);
    }
  }
});

test("配方及其所有冲突版本的材料引用、数量和能力引用完整", () => {
  for (const recipe of catalog.recipes) {
    assert.ok(items.has(recipe.output.itemId));
    for (const claim of claims(recipe.output.quantity)) {
      assert.ok(Number.isSafeInteger(claim.value) && claim.value > 0);
    }
    for (const claim of claims(recipe.cost)) {
      assert.equal(
        new Set(claim.value.items.map((item) => item.itemId)).size,
        claim.value.items.length,
      );
      for (const amount of claim.value.items) {
        assert.ok(items.has(amount.itemId), `缺少物品 ${amount.itemId}`);
        assert.ok(Number.isSafeInteger(amount.quantity) && amount.quantity > 0);
      }
      assert.ok(
        claim.value.cash === null ||
          (Number.isSafeInteger(claim.value.cash) && claim.value.cash >= 0),
      );
    }
    if (recipe.unlock) claims(recipe.unlock).forEach((claim) => checkCondition(claim.value));
    claims(recipe.requires).forEach((claim) => {
      claim.value.forEach((id) => assert.ok(capabilities.has(id), `缺少能力 ${id}`));
    });
  }
  catalog.capabilities.forEach((capability) => {
    claims(capability.unlock).forEach((claim) => checkCondition(claim.value));
  });
});

test("手册指向真实武器，手册定义与解锁规则一一对应", () => {
  const manuals = catalog.items.filter((item) => item.kind === "weapon-manual");
  // 本批查阅的手册目录明确列出 32 项，不能退回仅三项的类型样例。
  assert.equal(manuals.length, 32);
  assert.equal(catalog.manualUnlocks.length, manuals.length);
  assert.equal(
    new Set(catalog.manualUnlocks.map((unlock) => unlock.manualItemId)).size,
    manuals.length,
  );
  for (const unlock of catalog.manualUnlocks) {
    const manual = items.get(unlock.manualItemId);
    assert.equal(manual.kind, "weapon-manual");
    assert.equal(manual.weaponId, unlock.weaponItemId);
    assert.equal(items.get(unlock.weaponItemId).kind, "weapon");
    unlock.purchaseRequires?.forEach((id) => assert.ok(capabilities.has(id)));
  }
});

test("打印目录覆盖全部九类及95种产出，武器不混入打印配方", () => {
  assert.equal(catalog.recipes.length, 95);
  assert.equal(new Set(catalog.recipes.map((recipe) => recipe.output.itemId)).size, 95);
  const categories = {};
  for (const recipe of catalog.recipes) {
    const item = items.get(recipe.output.itemId);
    assert.ok(item.kind === "ingredient" || item.kind === "equipment");
    const category = item.kind === "ingredient" ? "ingredient" : item.category;
    categories[category] = (categories[category] ?? 0) + 1;
  }
  // 2026-11-05 DMZHub 完整目录与 DMZTracker 去除升级后的目录相互核对。
  assert.deepEqual(categories, {
    consumable: 9,
    backpack: 10,
    "field-upgrade": 16,
    ingredient: 14,
    armor: 8,
    tactical: 10,
    lethal: 11,
    "fire-support": 10,
    gear: 7,
  });
});

test("中间材料关系可展开，已知及争议配方都不构成循环", () => {
  const byOutput = new Map();
  for (const recipe of catalog.recipes) {
    const edges = byOutput.get(recipe.output.itemId) ?? new Set();
    claims(recipe.cost).forEach((claim) => {
      claim.value.items.forEach((amount) => edges.add(amount.itemId));
    });
    byOutput.set(recipe.output.itemId, edges);
  }
  function visit(itemId, path = new Set()) {
    assert.ok(!path.has(itemId), `配方循环 ${[...path, itemId].join(" → ")}`);
    for (const input of byOutput.get(itemId) ?? []) visit(input, new Set([...path, itemId]));
  }
  byOutput.forEach((_inputs, output) => visit(output));
});
