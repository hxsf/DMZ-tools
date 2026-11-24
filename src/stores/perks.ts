import { computed, signal } from "@preact/signals";
import { Err, Ok, type Result } from "ts-results-es";
import { isPerkBuild } from "../perk-code";
import type { PerkBuild } from "../types/perk-build";

export function createPerksStore(initial: PerkBuild) {
  if (!isPerkBuild(initial)) throw new Error("初始化特性树无效。");
  const value = signal<PerkBuild>(structuredClone(initial));

  return {
    state: computed(() => value.value),
    replace(build: PerkBuild): Result<void, "invalid-build"> {
      if (!isPerkBuild(build)) return Err("invalid-build");
      value.value = structuredClone(build);
      return Ok(undefined);
    },
  };
}
