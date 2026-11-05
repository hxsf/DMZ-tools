import { Err, None, Ok, Option, Some, type Result } from "ts-results-es";
import type { CalculationIssue, MaterialRow, MaterialSummary } from "../types/calculation";
import type { ItemId } from "../types/item";
import type { Inventory } from "../types/progress";
import type { Recipe, RecipeId } from "../types/recipe";
import type { RequirementTarget } from "../types/requirement";

const maximumCount = BigInt(Number.MAX_SAFE_INTEGER);

function isCount(value: number): boolean {
  return Number.isSafeInteger(value) && value >= 0;
}

function isPositiveCount(value: number): boolean {
  return isCount(value) && value > 0;
}

/**
 * 最小版只计算直接材料。各目标先汇总，随后统一抵扣一次共享库存。
 * 不改写库存；未知产量和成本冲突必须由调用方处理，不按默认值计算。
 */
export function calculateMaterials(
  targets: readonly RequirementTarget[],
  recipes: readonly Recipe[],
  inventory: Inventory,
): Result<MaterialSummary, readonly CalculationIssue[]> {
  const recipeById = new Map(recipes.map((recipe) => [recipe.id, recipe]));
  const totals = new Map<ItemId, bigint>();
  const issues: CalculationIssue[] = [];
  let cash = 0n;
  let cashKnown = true;

  function addRequired(itemId: ItemId, amount: bigint, recipeId?: RecipeId) {
    const sum = (totals.get(itemId) ?? 0n) + amount;
    if (sum > maximumCount) {
      issues.push({ code: "overflow", itemId, ...(recipeId ? { recipeId } : {}) });
    } else {
      totals.set(itemId, sum);
    }
  }

  for (const target of targets) {
    const context =
      target.kind === "craft" ? { recipeId: target.recipeId } : { itemId: target.itemId };
    if (!isPositiveCount(target.quantity)) {
      issues.push({ code: "invalid-quantity", ...context });
      continue;
    }
    if (target.kind === "collect") {
      addRequired(target.itemId, BigInt(target.quantity));
      continue;
    }
    if (target.outputPerCraft !== undefined && !isPositiveCount(target.outputPerCraft)) {
      issues.push({ code: "invalid-quantity", recipeId: target.recipeId });
      continue;
    }

    const recipe = recipeById.get(target.recipeId);
    if (!recipe) {
      issues.push({ code: "unknown-recipe", recipeId: target.recipeId });
      continue;
    }

    const quantity = recipe.output.quantity;
    const output = quantity.status === "reported" ? quantity.value : target.outputPerCraft;
    let ready = true;
    if (quantity.status === "conflicting") {
      issues.push({ code: "conflicting-output", recipeId: recipe.id });
      ready = false;
    } else if (output === undefined) {
      issues.push({ code: "unknown-output", recipeId: recipe.id });
      ready = false;
    } else if (!isPositiveCount(output)) {
      issues.push({ code: "invalid-quantity", recipeId: recipe.id });
      ready = false;
    }

    if (recipe.cost.status !== "reported") {
      issues.push({
        code: recipe.cost.status === "conflicting" ? "conflicting-cost" : "unknown-cost",
        recipeId: recipe.id,
      });
      continue;
    }
    if (!ready || output === undefined) continue;

    // BigInt 避免安全整数边界附近的加法、除法和乘法舍入。
    const batches = (BigInt(target.quantity) + BigInt(output) - 1n) / BigInt(output);
    for (const ingredient of recipe.cost.value.items) {
      if (!isPositiveCount(ingredient.quantity)) {
        issues.push({ code: "invalid-quantity", recipeId: recipe.id, itemId: ingredient.itemId });
        continue;
      }
      addRequired(ingredient.itemId, BigInt(ingredient.quantity) * batches, recipe.id);
    }

    const batchCash = recipe.cost.value.cash;
    if (batchCash === null) {
      cashKnown = false;
    } else if (!isCount(batchCash)) {
      issues.push({ code: "invalid-quantity", recipeId: recipe.id });
    } else {
      cash += BigInt(batchCash) * batches;
      if (cash > maximumCount) issues.push({ code: "overflow", recipeId: recipe.id });
    }
  }

  const rows: MaterialRow[] = [];
  for (const [itemId, total] of totals) {
    const quantity = inventory.items[itemId];
    if (quantity !== undefined && !isCount(quantity)) {
      issues.push({ code: "invalid-inventory", itemId });
      continue;
    }
    const required = Number(total);
    const owned = Option.fromOptional(quantity);
    rows.push({
      itemId,
      required,
      owned,
      missing: owned.map((amount) => Math.max(0, required - amount)),
    });
  }

  return issues.length > 0
    ? Err(issues)
    : Ok({ rows, cash: cashKnown ? Some(Number(cash)) : None });
}
