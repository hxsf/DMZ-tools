import { Trans, useTranslation } from "react-i18next";
import { getItemName, itemById } from "../data/display";
import { recipes } from "../data/recipes";
import type { CalculationIssue } from "../types/calculation";

export function CalculationIssues({ issues }: { issues: readonly CalculationIssue[] }) {
  const { t, i18n } = useTranslation();
  return (
    <ul class="calculation-issues" role="status">
      {issues.map((issue, index) => {
        const itemId =
          issue.itemId ?? recipes.find((recipe) => recipe.id === issue.recipeId)?.output.itemId;
        const item = itemId ? itemById.get(itemId) : undefined;
        return (
          <li key={`${issue.code}-${index}`}>
            {item && (
              <strong>
                {getItemName(item, i18n.language)}
                <span aria-hidden="true"> · </span>
              </strong>
            )}
            <Trans t={t} i18nKey={`issue.${issue.code}`} />
          </li>
        );
      })}
    </ul>
  );
}
