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
  return points <= maxTreePoints;
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

export function encodePerkBuild(build: PerkBuild): Result<string, "invalid-build"> {
  if (!isPerkBuild(build)) return Err("invalid-build");
  let bits = 0n;
  let length = 0;
  function write(value: number, width: number) {
    bits |= BigInt(value) << BigInt(length);
    length += width;
  }
  const positions = packPositions(build);
  write(positions === 0 ? 1 : 2, 2);
  for (const track of tracks) write(build[track].length, track === "prestige" ? 2 : 4);
  for (const track of tracks) {
    for (const [index, id] of build[track].entries()) {
      const { first, width } = slot(track, index);
      write(id - first, width);
    }
  }
  if (positions !== 0) write(positions, positions.toString(2).length);
  let bytes = "";
  for (let offset = 0; offset < length; offset += 8) {
    bytes += String.fromCharCode(Number((bits >> BigInt(offset)) & 255n));
  }
  return Ok(base64url(bytes));
}

export function decodePerkBuild(
  code: string,
): Result<PerkBuild, "invalid-code" | "unsupported-version"> {
  // The largest V2 build has depths 2/8/8 and 3 prestige traits: 116 ID bits + 18 position bits.
  if (
    typeof code !== "string" ||
    code.length < 3 ||
    code.length > 23 ||
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
  if (version !== 1 && version !== 2) return Err("unsupported-version");
  const depths = tracks.map((track) => read(track === "prestige" ? 2 : 4));
  const [warfighter, scout, survivalist, prestige] = tracks.map((track, trackIndex) =>
    Array.from({ length: depths[trackIndex] }, (_, index) => {
      const { first, width } = slot(track, index);
      return first + read(width);
    }),
  );
  let build: PerkBuild = { warfighter, scout, survivalist, prestige };
  if (!isPerkBuild(build)) return Err("invalid-code");
  if (version === 2) {
    if (bits === 0n) return Err("invalid-code");
    length += bits.toString(2).length;
    for (const [tree, row] of chosenMinorSlots(build)) {
      const position = Number(bits % 3n);
      bits /= 3n;
      if (position !== 0) build = withMinorPosition(build, tree, row, position === 1 ? 0 : 2);
    }
  }
  if (Math.ceil(length / 8) !== bytes.length || bits !== 0n) {
    return Err("invalid-code");
  }
  return Ok(build);
}
