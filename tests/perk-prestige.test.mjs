import assert from "node:assert/strict";
import { test } from "node:test";

const {
  decodePerkBuild,
  emptyPerkBuild,
  encodePerkBuild,
  getPrestigeSlot,
  isPerkBuild,
  setPrestigeSlot,
} = await import(process.env.DMZ_TEST_RUNTIME);

test("三个巅峰槽可独立填写、清空，清空中间槽不会移动右侧特性", () => {
  const base = emptyPerkBuild();
  const third = setPrestigeSlot(base, 3, 67).value;
  assert.deepEqual(third, { ...base, prestige: [67], prestigeSlots: [3] });
  assert.equal(encodePerkBuild(third).value, "NAAIAA");
  const firstAndThird = setPrestigeSlot(third, 1, 78).value;
  const full = setPrestigeSlot(firstAndThird, 2, 68).value;
  assert.deepEqual(full, { ...base, prestige: [78, 68, 67] });
  assert.deepEqual(setPrestigeSlot(full, 2, undefined).value, firstAndThird);
  assert.deepEqual(setPrestigeSlot(firstAndThird, 1, undefined).value, third);
  assert.deepEqual(setPrestigeSlot(third, 3, undefined).value, base);
  assert.equal(getPrestigeSlot(third, 1), undefined);
  assert.equal(getPrestigeSlot(third, 3), 67);
  assert.ok(setPrestigeSlot(third, 2, 67).isErr());
  assert.ok(setPrestigeSlot(third, 3, 67).isErr());
  assert.ok(setPrestigeSlot(third, 1, undefined).isErr());
  for (const bad of [0, 4, 1.5]) assert.ok(setPrestigeSlot(third, bad, 68).isErr());
  for (const bad of [0, 66, 79, 67.5]) assert.ok(setPrestigeSlot(third, 1, bad).isErr());
});

test("巅峰位置与三代原短码载荷组合，八种槽位布局均可往返", () => {
  const old = decodePerkBuild("TYzAexgACw").value;
  const base = { ...old, prestige: [] };
  const offCenter = { ...base, minorPositions: { warfighter: { 2: 2 }, survivalist: { 2: 0 } } };
  const withRolls = { ...offCenter, minorRolls: { 47: 46 } };
  for (const source of [base, offCenter, withRolls]) {
    for (let mask = 0; mask < 8; mask++) {
      let board = source;
      for (const row of [3, 1, 2]) {
        if (mask & (1 << (row - 1))) board = setPrestigeSlot(board, row, 66 + row).value;
      }
      const encoded = encodePerkBuild(board).value;
      const restored = decodePerkBuild(encoded).value;
      assert.deepEqual(JSON.parse(JSON.stringify(restored)), board);
      assert.equal(encodePerkBuild(restored).value, encoded);
      for (const row of [1, 2, 3]) {
        assert.equal(
          getPrestigeSlot(restored, row),
          mask & (1 << (row - 1)) ? 66 + row : undefined,
        );
      }
      const lowBits = Buffer.from(encoded, "base64url")[0] & 3;
      if ([2, 4, 5, 6].includes(mask)) {
        assert.equal(lowBits, 0);
        const { prestigeSlots, ...packed } = board;
        assert.ok(encoded.length <= encodePerkBuild(packed).value.length + 2);
      } else {
        assert.equal(board.prestigeSlots, undefined);
        assert.equal(lowBits, source === base ? 1 : source === offCenter ? 2 : 3);
      }
    }
  }
});

test("拒绝越界、重复、未排序、空洞或与巅峰数据不符的槽位标记", () => {
  const base = { ...emptyPerkBuild(), prestige: [67, 68] };
  for (const invalid of [
    null,
    {},
    [],
    [1],
    [1, 2],
    [2, 2],
    [3, 1],
    [0, 3],
    [2, 4],
    [1.5, 3],
    [1, "3"],
    Array(2),
  ]) {
    const build = { ...base, prestigeSlots: invalid };
    assert.equal(isPerkBuild(build), false);
    assert.ok(encodePerkBuild(build).isErr());
  }
  for (const code of ["JAAA", "NAAYQgA", "NAAI", "NAAIAAAB"]) {
    assert.ok(decodePerkBuild(code).isErr(), code);
  }
  assert.equal(decodePerkBuild("CAA").error, "unsupported-version");
});
