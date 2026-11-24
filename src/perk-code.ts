import { Err, Ok, type Result } from "ts-results-es";
import {
  maxBranchDepth,
  maxPrestigeSlots,
  maxTreePoints,
  perkBranches,
  type PerkBuild,
} from "./types/perk-build";

const tracks = [...perkBranches, "prestige"] as const;
type Track = (typeof tracks)[number];

export function emptyPerkBuild(): PerkBuild {
  return { warfighter: [], scout: [], survivalist: [], prestige: [] };
}

// V1 wire ranges are permanent. A display reorder or translation must never change them.
function slot(track: Track, index: number) {
  if (track === "prestige") return { first: 67, count: 12, width: 4 };
  if (index % 3 !== 2) return { first: 1, count: 48, width: 6 };
  const pair = perkBranches.indexOf(track) * 3 + Math.floor(index / 3);
  return { first: 49 + pair * 2, count: 2, width: 1 };
}

export function isPerkBuild(value: unknown): value is PerkBuild {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return false;
  const record = value as Record<string, unknown>;
  let points = 0;
  for (const track of tracks) {
    const ids = record[track];
    const limit = track === "prestige" ? maxPrestigeSlots : maxBranchDepth;
    if (!Array.isArray(ids) || ids.length > limit || new Set(ids).size !== ids.length) return false;
    for (const [index, id] of ids.entries()) {
      const { first, count } = slot(track, index);
      if (typeof id !== "number" || !Number.isInteger(id) || id < first || id >= first + count) {
        return false;
      }
    }
    if (track !== "prestige") points += ids.length;
  }
  return points <= maxTreePoints;
}

function base64url(bytes: string): string {
  return btoa(bytes).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/, "");
}

// Little-endian bit stream: version (2 bits), tree lengths (4+4+4), prestige length (2),
// then the selected slots in track order. Only the last byte is zero-padded.
const version = 1;

export function encodePerkBuild(build: PerkBuild): Result<string, "invalid-build"> {
  if (!isPerkBuild(build)) return Err("invalid-build");
  let bits = 0n;
  let length = 0;
  function write(value: number, width: number) {
    bits |= BigInt(value) << BigInt(length);
    length += width;
  }
  write(version, 2);
  for (const track of tracks) write(build[track].length, track === "prestige" ? 2 : 4);
  for (const track of tracks) {
    for (const [index, id] of build[track].entries()) {
      const { first, width } = slot(track, index);
      write(id - first, width);
    }
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
  // An 18-point build with all 3 permanent traits needs at most 116 bits (20 characters).
  if (
    typeof code !== "string" ||
    code.length < 3 ||
    code.length > 20 ||
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
  if (read(2) !== version) return Err("unsupported-version");
  const depths = tracks.map((track) => read(track === "prestige" ? 2 : 4));
  const [warfighter, scout, survivalist, prestige] = tracks.map((track, trackIndex) =>
    Array.from({ length: depths[trackIndex] }, (_, index) => {
      const { first, width } = slot(track, index);
      return first + read(width);
    }),
  );
  const build = { warfighter, scout, survivalist, prestige };
  if (Math.ceil(length / 8) !== bytes.length || bits !== 0n || !isPerkBuild(build)) {
    return Err("invalid-code");
  }
  return Ok(build);
}
