import { Err, Ok, type Result } from "ts-results-es";
import {
  maxBranchDepth,
  maxPrestigeSlots,
  maxTreePoints,
  perkBranches,
  type MinorPosition,
  type PerkBuild,
  type PerkTree,
} from "./types/perk-build";

const tracks = [...perkBranches, "prestige"] as const;
type Track = (typeof tracks)[number];

export function emptyPerkBuild(): PerkBuild {
  return { warfighter: [], scout: [], survivalist: [], prestige: [] };
}

const threeChoiceRows = [2, 4, 5, 7, 8];

export function getMinorPosition(build: PerkBuild, tree: PerkTree, row: number): MinorPosition {
  return build.minorPositions?.[tree]?.[row] ?? 1;
}

export function withMinorPosition(
  build: PerkBuild,
  tree: PerkTree,
  row: number,
  position: MinorPosition | undefined,
): PerkBuild {
  const { minorPositions, ...tracksOnly } = build;
  const positions = { ...minorPositions };
  const branch: Record<number, 0 | 2> = {};
  for (const candidate of threeChoiceRows) {
    if (candidate > build[tree].length) break;
    const pick = row === candidate ? position : minorPositions?.[tree]?.[candidate];
    if (pick === 0 || pick === 2) branch[candidate] = pick;
  }
  if (Object.keys(branch).length) positions[tree] = branch;
  else delete positions[tree];
  return Object.keys(positions).length ? { ...tracksOnly, minorPositions: positions } : tracksOnly;
}

// On the game board each branch has one base roll and five rows of three rolls.
const minorRows = [1, ...threeChoiceRows];
const cellsPerBranch = 16;
const cellCount = cellsPerBranch * perkBranches.length;

function minorCell(tree: PerkTree, row: number, position: MinorPosition): number {
  const branch = perkBranches.indexOf(tree);
  const tier = minorRows.indexOf(row);
  if (branch < 0 || tier < 0 || ![0, 1, 2].includes(position) || (row === 1 && position !== 0)) {
    return -1;
  }
  return branch * cellsPerBranch + (tier === 0 ? 0 : 1 + 3 * (tier - 1) + position);
}

function selectedPosition(build: PerkBuild, tree: PerkTree, row: number) {
  return row === 1 ? 0 : getMinorPosition(build, tree, row);
}

export function getMinorRoll(
  build: PerkBuild,
  tree: PerkTree,
  row: number,
  position: MinorPosition,
): number | undefined {
  const cell = minorCell(tree, row, position);
  if (cell < 0) return undefined;
  if (row <= build[tree].length && selectedPosition(build, tree, row) === position) {
    return build[tree][row - 1];
  }
  return build.minorRolls?.[cell];
}

function activeMinorCells(build: PerkBuild): Map<number, number> {
  const cells = new Map<number, number>();
  for (const tree of perkBranches) {
    for (const row of minorRows) {
      if (row > build[tree].length) break;
      cells.set(minorCell(tree, row, selectedPosition(build, tree, row)), build[tree][row - 1]);
    }
  }
  return cells;
}

function replaceRolls(build: PerkBuild, rolls: Partial<Record<number, number>>): PerkBuild {
  if (Object.keys(rolls).length) return { ...build, minorRolls: rolls };
  const updated = { ...build };
  delete updated.minorRolls;
  return updated;
}

type BuildEdit = Result<PerkBuild, "invalid-build">;

export function recordMinorRoll(
  build: PerkBuild,
  tree: PerkTree,
  row: number,
  position: MinorPosition,
  wireId: number | undefined,
): BuildEdit {
  const cell = minorCell(tree, row, position);
  const current = getMinorRoll(build, tree, row, position);
  if (cell < 0 || current === wireId) return Err("invalid-build");
  const active = activeMinorCells(build);
  if (
    wireId !== undefined &&
    (!Number.isInteger(wireId) ||
      wireId < 1 ||
      wireId > 48 ||
      [...active.values(), ...Object.values(build.minorRolls ?? {})].includes(wireId))
  ) {
    return Err("invalid-build");
  }
  if (active.has(cell)) {
    if (wireId === undefined) return Err("invalid-build");
    const entries = [...build[tree]];
    entries[row - 1] = wireId;
    return Ok({ ...build, [tree]: entries });
  }
  const rolls = { ...build.minorRolls };
  if (wireId === undefined) delete rolls[cell];
  else rolls[cell] = wireId;
  return Ok(replaceRolls(build, rolls));
}

// Legacy routes allowed the same minor trait in different trees. When undoing one
// such allocation, the remaining allocation already records the trait.
function retainFormerRoll(build: PerkBuild, cell: number, wireId: number | undefined): PerkBuild {
  if (wireId === undefined || [...activeMinorCells(build).values()].includes(wireId)) return build;
  return replaceRolls(build, { ...build.minorRolls, [cell]: wireId });
}

export function activateMinorRoll(
  build: PerkBuild,
  tree: PerkTree,
  row: number,
  position: MinorPosition,
): BuildEdit {
  const wireId = getMinorRoll(build, tree, row, position);
  const previous = build[tree][row - 1];
  if (
    wireId === undefined ||
    previous === wireId ||
    row > build[tree].length + 1 ||
    (previous === undefined &&
      perkBranches.reduce((sum, branch) => sum + build[branch].length, 0) >= maxTreePoints)
  ) {
    return Err("invalid-build");
  }
  const rolls = { ...build.minorRolls };
  delete rolls[minorCell(tree, row, position)];
  const entries = [...build[tree]];
  entries[row - 1] = wireId;
  const updated = withMinorPosition(
    replaceRolls({ ...build, [tree]: entries }, rolls),
    tree,
    row,
    position,
  );
  return Ok(
    retainFormerRoll(updated, minorCell(tree, row, selectedPosition(build, tree, row)), previous),
  );
}

export function deactivateMinorRoll(build: PerkBuild, tree: PerkTree, row: number): BuildEdit {
  if (!minorRows.includes(row) || row !== build[tree].length) return Err("invalid-build");
  const cell = minorCell(tree, row, selectedPosition(build, tree, row));
  const updated = withMinorPosition(
    { ...build, [tree]: build[tree].slice(0, -1) },
    tree,
    row,
    undefined,
  );
  return Ok(retainFormerRoll(updated, cell, build[tree][row - 1]));
}

function validRolls(build: PerkBuild, value: unknown): boolean {
  if (value === undefined) return true;
  if (!isRecord(value) || !Object.keys(value).length) return false;
  const active = activeMinorCells(build);
  const used = new Set(active.values());
  for (const [key, id] of Object.entries(value)) {
    const cell = Number(key);
    if (
      !Number.isInteger(cell) ||
      String(cell) !== key ||
      cell < 0 ||
      cell >= cellCount ||
      active.has(cell) ||
      typeof id !== "number" ||
      !Number.isInteger(id) ||
      id < 1 ||
      id > 48 ||
      used.has(id)
    )
      return false;
    used.add(id);
  }
  return true;
}

function* chosenMinorSlots(build: PerkBuild) {
  for (const tree of perkBranches) {
    for (const row of threeChoiceRows) {
      if (row > build[tree].length) break;
      yield [tree, row] as const;
    }
  }
}

// V1 wire ranges are permanent. A display reorder or translation must never change them.
function slot(track: Track, index: number) {
  if (track === "prestige") return { first: 67, count: 12, width: 4 };
  if (index % 3 !== 2) return { first: 1, count: 48, width: 6 };
  const pair = perkBranches.indexOf(track) * 3 + Math.floor(index / 3);
  return { first: 49 + pair * 2, count: 2, width: 1 };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function validPositions(value: unknown, depth: number): boolean {
  return (
    isRecord(value) &&
    Object.entries(value).every(([key, position]) => {
      const row = Number(key);
      return (
        String(row) === key &&
        threeChoiceRows.includes(row) &&
        row <= depth &&
        (position === 0 || position === 2)
      );
    })
  );
}

export function isPerkBuild(value: unknown): value is PerkBuild {
  if (!isRecord(value)) return false;
  const positions = value.minorPositions;
  if (
    positions !== undefined &&
    (!isRecord(positions) ||
      Object.keys(positions).some((key) => !perkBranches.some((tree) => tree === key)))
  ) {
    return false;
  }
  let points = 0;
  for (const track of tracks) {
    const ids = value[track];
    const limit = track === "prestige" ? maxPrestigeSlots : maxBranchDepth;
    if (!Array.isArray(ids) || ids.length > limit || new Set(ids).size !== ids.length) return false;
    for (const [index, id] of ids.entries()) {
      const { first, count } = slot(track, index);
      if (typeof id !== "number" || !Number.isInteger(id) || id < first || id >= first + count) {
        return false;
      }
    }
    if (track !== "prestige") {
      if (
        positions &&
        Object.hasOwn(positions, track) &&
        !validPositions(positions[track], ids.length)
      ) {
        return false;
      }
      points += ids.length;
    }
  }
  return points <= maxTreePoints && validRolls(value as PerkBuild, value.minorRolls);
}

function base64url(bytes: string): string {
  return btoa(bytes).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/, "");
}

// Little-endian bit stream: version (2 bits), tree lengths (4+4+4), prestige length (2),
// then the selected IDs in track order. V2 appends the positions as one base-three number
// (center=0, left=1, right=2), lowest trit first. Zero high bits cost no space.
function packPositions(build: PerkBuild): number {
  let packed = 0;
  let place = 1;
  for (const [tree, row] of chosenMinorSlots(build)) {
    const position = getMinorPosition(build, tree, row);
    if (position === 0) packed += place;
    if (position === 2) packed += 2 * place;
    place *= 3;
  }
  return packed;
}

// V3 stores the same route payload, a fixed-width ternary position field, then
// inactive rolls. Their cell subset is ranked in colex order. Its rank needs
// only ceil(log2(C(freeCells, count))) bits, including zero bits for a full board.
// Each ID indexes the remaining unused minor traits, shrinking as entries are read.
const widthFor = (alternatives: number) => Math.ceil(Math.log2(alternatives));

function combinations(n: number, k: number): number {
  // n <= 48; every intermediate integer remains below Number.MAX_SAFE_INTEGER.
  if (k > n) return 0;
  let total = 1;
  for (let i = 1; i <= Math.min(k, n - k); i++) total = (total * (n - i + 1)) / i;
  return total;
}

function availableRolls(build: PerkBuild) {
  const active = activeMinorCells(build);
  const used = new Set(active.values());
  return {
    cells: Array.from({ length: cellCount }, (_, index) => index).filter(
      (cell) => !active.has(cell),
    ),
    ids: Array.from({ length: 48 }, (_, index) => index + 1).filter((id) => !used.has(id)),
  };
}

function writeRolls(build: PerkBuild, write: (value: number, width: number) => void) {
  const { cells, ids } = availableRolls(build);
  // Integer object keys are enumerated in ascending order.
  const entries = Object.entries(build.minorRolls ?? {});
  write(entries.length - 1, widthFor(cells.length));
  const rank = entries.reduce(
    (sum, [cell], i) => sum + combinations(cells.indexOf(Number(cell)), i + 1),
    0,
  );
  write(rank, widthFor(combinations(cells.length, entries.length)));
  for (const [, id] of entries) {
    const index = ids.indexOf(id as number);
    write(index, widthFor(ids.length));
    ids.splice(index, 1);
  }
}

function readRolls(build: PerkBuild, read: (width: number) => number): PerkBuild | undefined {
  const { cells, ids } = availableRolls(build);
  const count = read(widthFor(cells.length)) + 1;
  if (count > cells.length || count > ids.length) return undefined;
  const possible = combinations(cells.length, count);
  let rank = read(widthFor(possible));
  if (rank >= possible) return undefined;
  const occupied: number[] = [];
  let index = cells.length - 1;
  for (let k = count; k > 0; k--) {
    while (combinations(index, k) > rank) index--;
    rank -= combinations(index, k);
    occupied[k - 1] = cells[index];
    index--;
  }
  const rolls: Record<number, number> = {};
  for (const cell of occupied) {
    const pick = read(widthFor(ids.length));
    if (pick >= ids.length) return undefined;
    rolls[cell] = ids.splice(pick, 1)[0];
  }
  return { ...build, minorRolls: rolls };
}

export function encodePerkBuild(build: PerkBuild): Result<string, "invalid-build"> {
  if (!isPerkBuild(build)) return Err("invalid-build");
  let bits = 0n;
  let length = 0;
  function write(value: number, width: number) {
    bits |= BigInt(value) << BigInt(length);
    length += width;
  }
  const positions = packPositions(build);
  const version = build.minorRolls ? 3 : positions === 0 ? 1 : 2;
  write(version, 2);
  for (const track of tracks) write(build[track].length, track === "prestige" ? 2 : 4);
  for (const track of tracks) {
    for (const [index, id] of build[track].entries()) {
      const { first, width } = slot(track, index);
      write(id - first, width);
    }
  }
  if (version === 2) write(positions, positions.toString(2).length);
  if (version === 3) {
    write(positions, widthFor(3 ** [...chosenMinorSlots(build)].length));
    writeRolls(build, write);
  }
  let bytes = "";
  for (let offset = 0; offset < length; offset += 8) {
    bytes += String.fromCharCode(Number((bits >> BigInt(offset)) & 255n));
  }
  return Ok(base64url(bytes));
}

export function decodePerkBuild(
  code: string,
): Result<PerkBuild, "invalid-code" | "unsupported-version"> {
  // Conservative input bound: V3 adds up to 48 ranked cell bits and 48 six-bit IDs.
  if (
    typeof code !== "string" ||
    code.length < 3 ||
    code.length > 84 ||
    code.length % 4 === 1 ||
    /[^A-Za-z0-9_-]/.test(code)
  ) {
    return Err("invalid-code");
  }
  const bytes = atob(code.replaceAll("-", "+").replaceAll("_", "/"));
  if (base64url(bytes) !== code) return Err("invalid-code");
  let bits = 0n;
  for (let i = bytes.length - 1; i >= 0; i--) {
    bits = (bits << 8n) | BigInt(bytes.charCodeAt(i));
  }
  let length = 0;
  function read(width: number) {
    const value = Number(bits & ((1n << BigInt(width)) - 1n));
    bits >>= BigInt(width);
    length += width;
    return value;
  }
  const version = read(2);
  if (version === 0) return Err("unsupported-version");
  if (version < 3 && code.length > 23) return Err("invalid-code");
  const depths = tracks.map((track) => read(track === "prestige" ? 2 : 4));
  const [warfighter, scout, survivalist, prestige] = tracks.map((track, trackIndex) =>
    Array.from({ length: depths[trackIndex] }, (_, index) => {
      const { first, width } = slot(track, index);
      return first + read(width);
    }),
  );
  let build: PerkBuild = { warfighter, scout, survivalist, prestige };
  if (!isPerkBuild(build)) return Err("invalid-code");
  if (version === 2 || version === 3) {
    const slots = [...chosenMinorSlots(build)];
    let positions: number;
    if (version === 2) {
      if (bits === 0n || bits >= BigInt(3 ** slots.length)) return Err("invalid-code");
      positions = read(bits.toString(2).length);
    } else {
      const limit = 3 ** slots.length;
      positions = read(widthFor(limit));
      if (positions >= limit) return Err("invalid-code");
    }
    for (const [tree, row] of slots) {
      const trit = positions % 3;
      positions = Math.floor(positions / 3);
      if (trit !== 0) build = withMinorPosition(build, tree, row, trit === 1 ? 0 : 2);
    }
  }
  if (version === 3) {
    const updated = readRolls(build, read);
    if (!updated) return Err("invalid-code");
    build = updated;
  }
  if (Math.ceil(length / 8) !== bytes.length || bits !== 0n) {
    return Err("invalid-code");
  }
  return Ok(build);
}
