import type { Option } from "ts-results-es";
import type { ItemId } from "./item";
import type { RecipeId } from "./recipe";

/** 编辑中的数量保留原始输入，只有通过校验后才进入制作目标。 */
export interface PrintDraft {
  readonly recipeId: RecipeId;
  readonly quantity: string;
  readonly outputPerCraft: string;
}

export interface MaterialRow {
  readonly itemId: ItemId;
  readonly required: number;
  readonly owned: Option<number>;
  readonly missing: Option<number>;
}

export interface MaterialSummary {
  readonly rows: readonly MaterialRow[];
  /** 目标的总现金成本；任一配方费用未知时为 None，不抵扣现金库存。 */
  readonly cash: Option<number>;
}

export interface CalculationIssue {
  readonly code:
    | "unknown-recipe"
    | "unknown-output"
    | "conflicting-output"
    | "unknown-cost"
    | "conflicting-cost"
    | "invalid-quantity"
    | "invalid-inventory"
    | "overflow";
  readonly recipeId?: RecipeId;
  readonly itemId?: ItemId;
}
