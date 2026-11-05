import type { ItemId } from "./item";
import type { RecipeId } from "./recipe";
import type { RequirementPlan } from "./requirement";
import type { CapabilityId } from "./unlock";

export type UnlockStatus = "unknown" | "locked" | "unlocked";

export interface UnlockRecord {
  readonly status: UnlockStatus;
  /** 用户确认时间；不会根据等级奖励静默推断已拥有配方。 */
  readonly updatedAt: string;
}

export interface Inventory {
  /** 未录入的物品数量未知；显式 0 才表示用户确认没有。 */
  readonly items: Readonly<Partial<Record<ItemId, number>>>;
  readonly cash: number | null;
}

export interface UnlockProgress {
  readonly recipes: Readonly<Partial<Record<RecipeId, UnlockRecord>>>;
  readonly manuals: Readonly<Partial<Record<ItemId, UnlockRecord>>>;
  readonly capabilities: Readonly<Partial<Record<CapabilityId, UnlockRecord>>>;
  readonly dmzLevel: number | null;
}

/** 只保存用户输入，缺口与完成率等派生值每次重新计算。 */
export interface UserSnapshot {
  readonly schemaVersion: 1;
  readonly inventory: Inventory;
  readonly unlocks: UnlockProgress;
  readonly plans: readonly RequirementPlan[];
}
