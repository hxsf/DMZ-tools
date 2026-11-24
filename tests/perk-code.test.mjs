import assert from "node:assert/strict";
import { test } from "node:test";

const { decodePerkBuild, emptyPerkBuild, encodePerkBuild, isPerkBuild, perks } = await import(
  process.env.DMZ_TEST_RUNTIME
);

const branches = ["warfighter", "scout", "survivalist"];

test("V1 短码固定且保留各树槽位和永久槽的顺序", () => {
  const fixtures = [
    [emptyPerkBuild(), "AQA"],
    [
      {
        warfighter: [1, 48, 50],
        scout: [4],
        survivalist: [4, 1, 61],
        prestige: [78, 67],
      },
      "TYzAexgACw",
    ],
    [
      {
        warfighter: [1, 48, 50, 3, 4, 51, 5, 6, 54],
        scout: [7, 8, 55, 9, 10, 58, 11, 12, 59],
        survivalist: [],
        prestige: [67, 78, 72],
      },
      "ZcLAWxgQReOAJJUFbAE",
    ],
  ];
  for (const [build, code] of fixtures) {
    assert.equal(encodePerkBuild(build).value, code);
    assert.deepEqual(decodePerkBuild(code).value, build);
  }
});

test("特性目录的每个固定编号均与二进制槽位匹配", () => {
  assert.equal(perks.length, 78);
  const byId = new Map(perks.map((perk) => [perk.wireId, perk]));
  for (let id = 1; id <= 78; id++) {
    const perk = byId.get(id);
    assert.ok(perk);
    if (id <= 48) {
      assert.equal(perk.kind, "minor");
    } else if (id <= 66) {
      assert.equal(perk.kind, "major");
      assert.equal(perk.tree, branches[Math.floor((id - 49) / 6)]);
      assert.equal(perk.row, 3 * (1 + Math.floor(((id - 49) % 6) / 2)));
    } else {
      assert.equal(perk.kind, "prestige");
    }
  }
});

function choices(branch, depth) {
  return Array.from({ length: depth }, (_, index) =>
    index % 3 === 2 ? 49 + 6 * branch + 2 * Math.floor(index / 3) + 1 : 48 - index,
  );
}

test("任意合法分支深度均可往返，满点三永久槽最多 20 个字符", () => {
  let maxLength = 0;
  for (let a = 0; a <= 9; a++) {
    for (let b = 0; b <= 9; b++) {
      for (let c = 0; c <= 9 && a + b + c <= 18; c++) {
        for (let p = 0; p <= 3; p++) {
          const build = {
            warfighter: choices(0, a),
            scout: choices(1, b),
            survivalist: choices(2, c),
            prestige: [78, 68, 72].slice(0, p),
          };
          const encoded = encodePerkBuild(build);
          assert.equal(encoded.isOk(), true);
          assert.deepEqual(decodePerkBuild(encoded.value).value, build);
          maxLength = Math.max(encoded.value.length, maxLength);
        }
      }
    }
  }
  assert.equal(maxLength, 20);
});

test("拒绝非法编号、错误主特性分支、断层、重复或超出点数的树", () => {
  const base = emptyPerkBuild();
  for (const build of [
    undefined,
    {},
    { ...base, scout: [0] },
    { ...base, scout: [1.5] },
    { ...base, warfighter: [1, 2, 55] },
    { ...base, warfighter: [1, 2, 51] },
    { ...base, warfighter: [1, 2, 48] },
    { ...base, warfighter: [1, 1] },
    { ...base, scout: Array(1) },
    { ...base, prestige: [1] },
    { ...base, prestige: [67, 67] },
    { ...base, prestige: [67, 68, 69, 70] },
    { ...base, scout: choices(1, 10) },
    { ...base, warfighter: choices(0, 9), scout: choices(1, 9), survivalist: [1] },
  ]) {
    assert.equal(isPerkBuild(build), false);
    assert.equal(encodePerkBuild(build).error, "invalid-build");
  }
});

test("导入拒绝未知版本、无效文本、截断、额外数据和保留位", () => {
  assert.equal(decodePerkBuild("AgA").error, "unsupported-version");
  for (const code of [
    "",
    "AQ",
    "AQA=",
    "AQB", // 同一字节的非规范 Base64 尾部位
    " AQA",
    "AQA\n",
    "A+A",
    "A/A",
    "NULL!",
    "A".repeat(21),
    "BQA", // 头部声明一个小特性，但没有载荷
    "AQAA", // 空树后多一字节
    "BQDA", // 载荷高位有非零填充
    "BQA_", // 6 位载荷中未分配的编号
    "AUAP", // 4 位载荷中未分配的永久特性
  ]) {
    assert.equal(decodePerkBuild(code).error, "invalid-code", code);
  }
});
