import assert from "node:assert/strict";
import { test } from "node:test";

const {
  decodePerkBuild,
  emptyPerkBuild,
  encodePerkBuild,
  getMinorPosition,
  isPerkBuild,
  perks,
  withMinorPosition,
} = await import(process.env.DMZ_TEST_RUNTIME);

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

test("任意合法分支深度均可往返，V1 最长 20 字符、带左右位置的 V2 最长 23 字符", () => {
  let maxLength = 0;
  let maxPositionedLength = 0;
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
          let positioned = build;
          for (const tree of branches) {
            for (const row of [2, 4, 5, 7, 8]) {
              if (row <= build[tree].length) {
                positioned = withMinorPosition(positioned, tree, row, 2);
              }
            }
          }
          const code = encodePerkBuild(positioned).value;
          assert.deepEqual(decodePerkBuild(code).value, positioned);
          maxPositionedLength = Math.max(code.length, maxPositionedLength);
        }
      }
    }
  }
  assert.equal(maxLength, 20);
  assert.equal(maxPositionedLength, 23);
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
  assert.equal(decodePerkBuild("AwA").error, "unsupported-version");
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
    "A".repeat(24),
    "AgA", // V2 不允许全部居中
    "DgDAYA", // 此树仅有一个三选一槽位，三进制值 3 超出范围
    "DgDAIAA", // 左选的 V2 短码后多一个空字节
    "BQA", // 头部声明一个小特性，但没有载荷
    "AQAA", // 空树后多一字节
    "BQDA", // 载荷高位有非零填充
    "BQA_", // 6 位载荷中未分配的编号
    "AUAP", // 4 位载荷中未分配的永久特性
  ]) {
    assert.equal(decodePerkBuild(code).error, "invalid-code", code);
  }
});

test("V2 保存三选一的左中右，改回居中能还原同一个 V1 短码", () => {
  const base = decodePerkBuild("DQDAAA").value;
  assert.equal(getMinorPosition(base, "warfighter", 2), 1);
  for (const [position, code] of [
    [0, "DgDAIA"],
    [1, "DQDAAA"],
    [2, "DgDAQA"],
  ]) {
    const updated = withMinorPosition(base, "warfighter", 2, position);
    assert.equal(encodePerkBuild(updated).value, code);
    assert.equal(getMinorPosition(decodePerkBuild(code).value, "warfighter", 2), position);
    assert.deepEqual(withMinorPosition(updated, "warfighter", 2, 1), base);
    assert.deepEqual(withMinorPosition(updated, "warfighter", 2, undefined), base);
  }
});

test("三棵树的左中右三进制槽位相互独立", () => {
  const base = { warfighter: [1, 2], scout: [3, 4], survivalist: [5, 6], prestige: [67] };
  const codes = new Set();
  for (const a of [0, 1, 2]) {
    for (const b of [0, 1, 2]) {
      for (const c of [0, 1, 2]) {
        let build = base;
        for (const [index, tree] of branches.entries()) {
          build = withMinorPosition(build, tree, 2, [a, b, c][index]);
        }
        const code = encodePerkBuild(build).value;
        codes.add(code);
        assert.deepEqual(decodePerkBuild(code).value, build);
      }
    }
  }
  assert.equal(codes.size, 27);
});

test("修改或移除已有阶数只更新该树的位置；删到一阶后清除所有失效位置", () => {
  const build = {
    ...emptyPerkBuild(),
    warfighter: choices(0, 5),
    scout: choices(1, 2),
    minorPositions: { warfighter: { 2: 0, 4: 2, 5: 0 }, scout: { 2: 2 } },
  };
  const trimmed = withMinorPosition({ ...build, warfighter: [1] }, "warfighter", 5, undefined);
  assert.deepEqual(trimmed.minorPositions, { scout: { 2: 2 } });
  assert.deepEqual(decodePerkBuild(encodePerkBuild(trimmed).value).value, trimmed);
  assert.equal(getMinorPosition(build, "warfighter", 5), 0);
  assert.deepEqual(withMinorPosition(trimmed, "warfighter", 1, 2), trimmed);
});

test("存档拒绝无效的三选一位置", () => {
  const base = { ...emptyPerkBuild(), warfighter: choices(0, 3) };
  for (const minorPositions of [
    null,
    [],
    { recon: { 2: 0 } },
    { prestige: {} },
    { warfighter: [0] },
    { warfighter: { 1: 0 } },
    { warfighter: { 3: 0 } },
    { warfighter: { 4: 2 } },
    { warfighter: { "02": 2 } },
    { warfighter: { 2: 1 } },
    { warfighter: { 2: "0" } },
  ]) {
    assert.equal(isPerkBuild({ ...base, minorPositions }), false);
  }
});
