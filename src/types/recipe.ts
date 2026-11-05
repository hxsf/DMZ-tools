import type { ItemAmount, ItemId } from "./item";
import type { Fact } from "./source";
import type { CapabilityId, UnlockCondition } from "./unlock";

export type RecipeId = `recipe:${string}`;

export interface RecipeCost {
  readonly items: readonly ItemAmount[];
  /** null 表示现金费用未知，0 才表示已确认不消耗现金。 */
  readonly cash: number | null;
}

export interface Recipe {
  readonly id: RecipeId;
  readonly output: {
    readonly itemId: ItemId;
    /** 每次打印产量；网页的“+1”操作按钮不能当作产量证据。 */
    readonly quantity: Fact<number>;
  };
  readonly cost: Fact<RecipeCost>;
  /** 获取条件为可选资料；缺失也能收录、查询和手动标记解锁。 */
  readonly unlock?: Fact<UnlockCondition>;
  readonly requires: Fact<readonly CapabilityId[]>;
}
