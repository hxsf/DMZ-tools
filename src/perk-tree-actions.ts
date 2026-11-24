import { Err, Ok, type Result } from "ts-results-es";
import { perks } from "./data/perks";
import {
  deactivateMinorRoll,
  getMinorRoll,
  recordMinorRoll,
  setPrestigeSlot,
  withMinorPosition,
} from "./perk-code";
import type { MinorPosition, PerkBuild, PerkTree } from "./types/perk-build";

/** Clear one board cell. Higher rolls stay visible when their route loses a prerequisite. */
export function clearPerkSlot(
  build: PerkBuild,
  track: PerkTree | "prestige",
  row: number,
  position: MinorPosition = 0,
): Result<PerkBuild, "invalid-build"> {
  if (track === "prestige") return setPrestigeSlot(build, row, undefined);

  const major = row % 3 === 0;
  const wireId = major
    ? perks.filter((perk) => perk.kind === "major" && perk.tree === track && perk.row === row)[
        position
      ]?.wireId
    : getMinorRoll(build, track, row, position);
  if (wireId === undefined) return Err("invalid-build");
  if (wireId !== build[track][row - 1]) {
    return major ? Err("invalid-build") : recordMinorRoll(build, track, row, position, undefined);
  }

  let next = build;
  for (let tier = build[track].length; tier > row; tier--) {
    if (tier % 3 === 0) {
      next = { ...next, [track]: next[track].slice(0, -1) };
    } else {
      const unspent = deactivateMinorRoll(next, track, tier);
      if (unspent.isErr()) return unspent;
      next = unspent.value;
    }
  }
  return Ok(
    withMinorPosition({ ...next, [track]: next[track].slice(0, -1) }, track, row, undefined),
  );
}
