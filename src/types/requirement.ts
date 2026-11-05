import type { ItemId } from "./item";
import type { RecipeId } from "./recipe";

export type PlanId = `plan:${string}`;

export type RequirementTarget =
  | {
      readonly kind: "collect";
      readonly itemId: ItemId;
      readonly quantity: number;
    }
  | {
      readonly kind: "craft";
      readonly recipeId: RecipeId;
      /** 目标成品数量，而非打印次数；计算时需已知每次产量。 */
      readonly quantity: number;
    };

export interface RequirementPlan {
  readonly id: PlanId;
  readonly title: string;
  readonly status: "active" | "paused" | "completed";
  readonly priority: number;
  readonly targets: readonly RequirementTarget[];
}
