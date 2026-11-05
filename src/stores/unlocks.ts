import { computed, signal } from "@preact/signals";
import { isCapabilityId, isCount, isId, isUnlockProgress, isUnlockStatus } from "../storage";
import type { ItemId } from "../types/item";
import type { UnlockProgress, UnlockRecord, UnlockStatus } from "../types/progress";
import type { RecipeId } from "../types/recipe";
import type { CapabilityId } from "../types/unlock";

export function createUnlocksStore(initial: UnlockProgress) {
  if (!isUnlockProgress(initial)) throw new Error("初始化解锁记录无效。");
  const value = signal<UnlockProgress>(structuredClone(initial));
  function record(status: UnlockStatus): UnlockRecord {
    if (!isUnlockStatus(status)) throw new Error("解锁状态无效。");
    return { status, updatedAt: new Date().toISOString() };
  }
  return {
    state: computed(() => value.value),
    setRecipe(recipeId: RecipeId, status: UnlockStatus) {
      if (!isId(recipeId, "recipe:")) throw new Error("配方 ID 无效。");
      value.value = {
        ...value.value,
        recipes: { ...value.value.recipes, [recipeId]: record(status) },
      };
    },
    setManual(manualId: ItemId, status: UnlockStatus) {
      if (!isId(manualId, "item:")) throw new Error("手册 ID 无效。");
      value.value = {
        ...value.value,
        manuals: { ...value.value.manuals, [manualId]: record(status) },
      };
    },
    setCapability(capabilityId: CapabilityId, status: UnlockStatus) {
      if (!isCapabilityId(capabilityId)) throw new Error("打印能力或设施 ID 无效。");
      value.value = {
        ...value.value,
        capabilities: { ...value.value.capabilities, [capabilityId]: record(status) },
      };
    },
    setDmzLevel(level: number | null) {
      if (level !== null && (!isCount(level) || level === 0)) {
        throw new Error("等级必须是正安全整数或未知。");
      }
      value.value = { ...value.value, dmzLevel: level };
    },
    replace(progress: UnlockProgress) {
      if (!isUnlockProgress(progress)) throw new Error("替换解锁记录无效。");
      value.value = structuredClone(progress);
    },
  };
}
