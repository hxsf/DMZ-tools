import assert from "node:assert/strict";
import { test } from "node:test";

const { catalog, sortCatalogEntries } = await import(process.env.DMZ_TEST_RUNTIME);

function entry(id, rarity, unlocked = false) {
  return {
    item: {
      id: `item:${id}`,
      name: { en: id, zhCN: id },
      kind: "equipment",
      category: "tactical",
      sourceIds: ["source:test"],
      ...(rarity ? { rarity } : {}),
    },
    unlocked,
  };
}

function reported(value) {
  return { status: "reported", value, sourceIds: ["source:test"] };
}

function sort(entries) {
  return sortCatalogEntries(
    entries,
    (row) => row.item,
    (row) => row.unlocked,
  );
}

function ids(entries) {
  return entries.map(({ item }) => item.id);
}

test("目录先排已解锁，再按白绿蓝紫金红排列，不修改来源数组", () => {
  const entries = [
    entry("locked-white", reported("common")),
    entry("unlocked-red", reported("ultra"), true),
    entry("locked-gold", reported("legendary")),
    entry("locked-purple", reported("epic")),
    entry("unlocked-green", reported("uncommon"), true),
    entry("locked-blue", reported("rare")),
    entry("locked-green", reported("uncommon")),
    entry("locked-red", reported("ultra")),
  ];
  const original = [...entries];
  assert.deepEqual(ids(sort(entries)), [
    "item:unlocked-green",
    "item:unlocked-red",
    "item:locked-white",
    "item:locked-green",
    "item:locked-blue",
    "item:locked-purple",
    "item:locked-gold",
    "item:locked-red",
  ]);
  assert.deepEqual(entries, original);
  entries[0].unlocked = true;
  assert.equal(sort(entries)[0], entries[0]);
});

test("缺失、未知和冲突稀有度排在已知稀有度后，保持彼此顺序", () => {
  const entries = [
    entry("missing"),
    entry("conflicting", {
      status: "conflicting",
      claims: [reported("common"), reported("ultra")],
      note: "Not verified",
    }),
    entry("red", reported("ultra")),
    entry("unknown", { status: "unknown", note: "Not collected" }),
    entry("white", reported("common")),
  ];
  assert.deepEqual(ids(sort(entries)), [
    "item:white",
    "item:red",
    "item:missing",
    "item:conflicting",
    "item:unknown",
  ]);
});

test("战术用品采用截图确认顺序，其余同级保持资料顺序且不受名称影响", () => {
  const confirmed = [
    "item:stun-grenade",
    "item:snapshot-grenade",
    "item:smoke-grenade",
    "item:shock-stick",
    "item:screamer-mine",
    "item:flash",
    "item:decoy-grenade",
    "item:stim",
    "item:heartbeat-sensor",
  ];
  const byId = new Map(catalog.items.map((item) => [item.id, item]));
  const entries = confirmed.toReversed().map((id) => {
    const item = byId.get(id);
    assert.ok(item, id);
    return { item, unlocked: false };
  });
  assert.deepEqual(ids(sort(entries)), confirmed);
  assert.deepEqual(
    ids(
      sort(
        entries.map((row, index) => ({
          ...row,
          item: { ...row.item, name: { en: String(index), zhCN: "新名称" } },
        })),
      ),
    ),
    confirmed,
  );
  const ordinary = [
    entry("zulu", reported("rare")),
    entry("alpha", reported("rare")),
    entry("beta", reported("rare")),
  ];
  assert.deepEqual(sort(ordinary), ordinary);
});

test("已知截图顺序与未收录顺序混排时一致，筛选不会改变剩余条目的相对顺序", () => {
  const snapshot = entry("snapshot-grenade", reported("common"));
  const stun = entry("stun-grenade", reported("common"));
  const firstUnknown = entry("unknown-z", reported("common"));
  const secondUnknown = entry("unknown-a", reported("common"));
  const arrangements = [
    [snapshot, firstUnknown, stun, secondUnknown],
    [firstUnknown, snapshot, secondUnknown, stun],
    [stun, firstUnknown, secondUnknown, snapshot],
  ];
  for (const entries of arrangements) {
    assert.deepEqual(sort(entries), [stun, snapshot, firstUnknown, secondUnknown]);
    assert.deepEqual(
      sort(entries.filter((row) => row !== snapshot)),
      sort(entries).filter((row) => row !== snapshot),
    );
  }
});
