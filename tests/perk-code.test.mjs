import assert from "node:assert/strict";
import { test } from "node:test";

const {
  activateMinorRoll,
  deactivateMinorRoll,
  decodePerkBuild,
  emptyPerkBuild,
  encodePerkBuild,
  getMinorPosition,
  getMinorRoll,
  recordMinorRoll,
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
  assert.equal(decodePerkBuild("AAA").error, "unsupported-version");
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
    "A".repeat(88),
    "AwA", // V3 至少包含一项随机候选
    "AwA_AAA", // 64 个候选超出 48 个格子
    "AwDADwA", // 单一候选的组合序号超出范围
    "AwAA8AM", // 6 比特序号超过可选的 48 项特性
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

test("随机结果可记在任意未启用的层，不消耗点数并在切换路线后保留", () => {
  let board = emptyPerkBuild();
  const record = (row, position, id) => {
    const edit = recordMinorRoll(board, "warfighter", row, position, id);
    assert.ok(edit.isOk());
    board = edit.value;
  };
  record(8, 2, 48);
  record(2, 0, 2);
  record(2, 2, 3);
  assert.equal(activateMinorRoll(board, "warfighter", 2, 0).isErr(), true);
  record(1, 0, 1);
  board = activateMinorRoll(board, "warfighter", 1, 0).value;
  board = activateMinorRoll(board, "warfighter", 2, 0).value;
  assert.equal(activateMinorRoll(board, "warfighter", 2, 0).isErr(), true);
  board = { ...board, warfighter: [...board.warfighter, 49] };
  board = activateMinorRoll(board, "warfighter", 2, 2).value;
  assert.deepEqual(board.warfighter, [1, 3, 49]);
  assert.equal(getMinorPosition(board, "warfighter", 2), 2);
  assert.equal(getMinorRoll(board, "warfighter", 2, 0), 2);
  assert.equal(getMinorRoll(board, "warfighter", 8, 2), 48);
  assert.deepEqual(decodePerkBuild(encodePerkBuild(board).value).value, board);
  assert.equal(deactivateMinorRoll(board, "warfighter", 2).isErr(), true);
  board = { ...board, warfighter: [1, 3] };
  board = deactivateMinorRoll(board, "warfighter", 2).value;
  assert.deepEqual(board.warfighter, [1]);
  assert.equal(getMinorRoll(board, "warfighter", 2, 2), 3);
  assert.equal(board.minorPositions, undefined);
});

test("全树禁用重复候选和同一操作，移除未启用候选后才可在别处重录", () => {
  const base = { ...emptyPerkBuild(), warfighter: [1] };
  const board = recordMinorRoll(base, "scout", 8, 2, 48).value;
  for (const [branch, row, pos, id] of [
    ["scout", 1, 0, 1],
    ["warfighter", 1, 0, 48],
    ["scout", 2, 0, 48],
    ["scout", 8, 2, 48],
    ["warfighter", 1, 0, 1],
    ["scout", 3, 0, 5],
    ["scout", 1, 2, 5],
    ["scout", 2, 0, 49],
    ["scout", 2, 0, undefined],
    ["warfighter", 1, 0, undefined],
  ]) {
    assert.equal(recordMinorRoll(board, branch, row, pos, id).error, "invalid-build");
  }
  const cleared = recordMinorRoll(board, "scout", 8, 2, undefined).value;
  assert.deepEqual(cleared, base);
  assert.ok(recordMinorRoll(cleared, "survivalist", 1, 0, 48).isOk());
  assert.ok(recordMinorRoll(board, "scout", 8, 2, 2).isOk());
});

test("18 点后仍能标记候选，只有路线加点受限", () => {
  const board = decodePerkBuild("ZcLAWxgQReOAJJUFbAE").value;
  const observed = recordMinorRoll(board, "survivalist", 1, 0, 13).value;
  assert.deepEqual(decodePerkBuild(encodePerkBuild(observed).value).value, observed);
  assert.ok(activateMinorRoll(observed, "survivalist", 1, 0).isErr());
});

test("V3 对每个候选数量和全部 48 格使用二进制编码，拒绝截断和非法填充", () => {
  const board = emptyPerkBuild();
  const rolls = {};
  // Two coprime permutations cover all cell/ID positions while varying the subset ranks.
  for (let i = 0; i < 48; i++) {
    rolls[(17 * i + 13) % 48] = 1 + ((11 * i + 43) % 48);
    const build = { ...board, minorRolls: { ...rolls } };
    const code = encodePerkBuild(build).value;
    assert.deepEqual(decodePerkBuild(code).value, build);
    assert.ok(code.length <= 52);
    const raw = Buffer.from(code, "base64url");
    assert.ok(decodePerkBuild(raw.subarray(0, -1).toString("base64url")).isErr());
    assert.ok(
      decodePerkBuild(Buffer.concat([raw, Buffer.from([0])]).toString("base64url")).isErr(),
    );
  }
  assert.equal(encodePerkBuild({ ...board, minorRolls: { 0: 1 } }).value.length, 7);
});

test("V3 允许在历史重号路线旁记录新候选，拒绝无效存档候选", () => {
  const legacy = decodePerkBuild("TYzAexgACw").value;
  const edit = recordMinorRoll(legacy, "survivalist", 8, 2, 22);
  assert.ok(edit.isOk());
  assert.deepEqual(decodePerkBuild(encodePerkBuild(edit.value).value).value, edit.value);
  assert.ok(recordMinorRoll(legacy, "survivalist", 8, 2, 1).isErr());
  for (const minorRolls of [
    null,
    [],
    {},
    { "-1": 2 },
    { "01": 2 },
    { 48: 2 },
    { 1: 1 },
    { 0: 2 },
    { 47: 49 },
    { 46: 13, 47: 13 },
    { 47: "12" },
  ]) {
    assert.equal(isPerkBuild({ ...legacy, minorRolls }), false);
  }
});
