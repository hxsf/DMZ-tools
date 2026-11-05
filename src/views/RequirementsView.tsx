import { useState } from "preact/hooks";
import { Trans, useTranslation } from "react-i18next";
import { calculateMaterials } from "../calculations/materials";
import { CalculationIssues } from "../components/CalculationIssues";
import { Icon } from "../components/Icon";
import { ItemImage } from "../components/ItemImage";
import { MaterialList } from "../components/MaterialList";
import { useApp } from "../context";
import { getItemName, itemById } from "../data/display";
import { recipes as recipeData } from "../data/recipes";
import type { Recipe } from "../types/recipe";
import type { RequirementPlan } from "../types/requirement";
import { appPath } from "../paths";

const recipes: readonly Recipe[] = recipeData;

export default function RequirementsView() {
  const { t, i18n } = useTranslation();
  const { stores, persist } = useApp();
  const [filter, setFilter] = useState<"active" | "completed">("active");
  const [saving, setSaving] = useState(false);
  const language = i18n.resolvedLanguage ?? i18n.language;
  const format = new Intl.NumberFormat(language);
  const plans = stores.plans.state.value.filter((plan) =>
    plan.targets.some((target) => target.kind === "craft"),
  );
  const activePlans = plans.filter((plan) => plan.status === "active");
  const activeTargets = activePlans.flatMap((plan) =>
    plan.targets.filter((target) => target.kind === "craft"),
  );
  const visiblePlans = plans.filter((plan) =>
    filter === "completed" ? plan.status === "completed" : plan.status !== "completed",
  );
  const calculation = calculateMaterials(activeTargets, recipes, stores.inventory.state.value);

  async function changeStatus(plan: RequirementPlan) {
    if (saving) return;
    setSaving(true);
    stores.plans.upsert({ ...plan, status: plan.status === "active" ? "completed" : "active" });
    await persist();
    setSaving(false);
  }

  async function removePlan(plan: RequirementPlan) {
    if (saving) return;
    setSaving(true);
    stores.plans.remove(plan.id);
    await persist();
    setSaving(false);
  }

  if (plans.length === 0)
    return (
      <div class="requirements-page">
        <div class="empty-state requirements-empty">
          <Icon name="checklist" />
          <h2>
            <Trans t={t} i18nKey="requirements.empty" />
          </h2>
          <p>
            <Trans t={t} i18nKey="requirements.emptyHint" />
          </p>
          <a class="primary-button" href={appPath("/printer")}>
            <Icon name="plus" />
            <Trans t={t} i18nKey="requirements.goPrinter" />
          </a>
        </div>
      </div>
    );

  return (
    <div class="requirements-page">
      <div class="requirements-toolbar">
        <div class="status-tabs" role="group" aria-label={t("requirements.goals")}>
          {(["active", "completed"] as const).map((status) => (
            <button
              type="button"
              key={status}
              class={filter === status ? "is-active" : undefined}
              aria-pressed={filter === status}
              onClick={() => setFilter(status)}
            >
              <Trans t={t} i18nKey={`requirements.${status}`} />
              <span class="group-count">
                {format.format(
                  plans.filter((plan) =>
                    status === "completed"
                      ? plan.status === "completed"
                      : plan.status !== "completed",
                  ).length,
                )}
              </span>
            </button>
          ))}
        </div>
        <a class="text-action" href={appPath("/printer")}>
          <Icon name="plus" />
          <Trans t={t} i18nKey="printer.targets" />
        </a>
      </div>
      <div class="requirements-layout">
        <details class="plans-panel" open>
          <summary class="panel-heading">
            <span>
              <Trans t={t} i18nKey="requirements.goals" />
              <span class="group-count">{format.format(visiblePlans.length)}</span>
            </span>
            <Icon name="chevron-down" />
          </summary>
          {visiblePlans.map((plan) => (
            <details class="plan" key={plan.id} open>
              <summary class="plan-summary">
                <span class="plan-title">{plan.title}</span>
                <span class="group-count">
                  {format.format(plan.targets.filter((target) => target.kind === "craft").length)}
                </span>
                <Icon name="chevron-down" />
              </summary>
              {plan.targets.map((target, index) => {
                if (target.kind !== "craft") return undefined;
                const recipe = recipes.find((entry) => entry.id === target.recipeId);
                const item = recipe ? itemById.get(recipe.output.itemId) : undefined;
                const output =
                  recipe?.output.quantity.status === "reported"
                    ? recipe.output.quantity.value
                    : target.outputPerCraft;
                return (
                  <div class="plan-target" key={`${target.recipeId}-${index}`}>
                    {recipe && <ItemImage itemId={recipe.output.itemId} />}
                    <span>
                      {item ? getItemName(item, language) : target.recipeId}
                      <small>
                        {output === undefined ? (
                          <Trans t={t} i18nKey="requirements.requiresOutput" />
                        ) : (
                          <Trans
                            t={t}
                            i18nKey="requirements.output"
                            values={{ count: format.format(output) }}
                          />
                        )}
                      </small>
                    </span>
                    <strong>× {format.format(target.quantity)}</strong>
                  </div>
                );
              })}
              {plan.targets.some((target) => target.kind === "collect") && (
                <p class="field-hint">
                  <Trans t={t} i18nKey="requirements.legacy" />
                </p>
              )}
              <div class="plan-actions">
                <button
                  class="text-action"
                  type="button"
                  disabled={saving}
                  onClick={() => void changeStatus(plan)}
                >
                  <Trans
                    t={t}
                    i18nKey={
                      plan.status === "active" ? "requirements.complete" : "requirements.restore"
                    }
                  />
                </button>
                <button
                  class="icon-button"
                  type="button"
                  aria-label={t("requirements.remove")}
                  disabled={saving}
                  onClick={() => void removePlan(plan)}
                >
                  <Icon name="trash" />
                </button>
              </div>
            </details>
          ))}
          {visiblePlans.length === 0 && (
            <p class="empty-state">
              <Trans
                t={t}
                i18nKey={filter === "active" ? "requirements.noActive" : "requirements.empty"}
              />
            </p>
          )}
        </details>
        <section class="result-panel" aria-labelledby="requirements-materials-heading">
          <div class="panel-heading">
            <h2 id="requirements-materials-heading">
              <Trans t={t} i18nKey="requirements.materials" />
            </h2>
            <span class="field-hint">
              <Trans t={t} i18nKey="requirements.allActive" />
            </span>
          </div>
          {activeTargets.length === 0 ? (
            <p class="empty-state">
              <Trans t={t} i18nKey="requirements.noActive" />
            </p>
          ) : calculation.isErr() ? (
            <CalculationIssues issues={calculation.error} />
          ) : (
            <>
              <MaterialList summary={calculation.value} />
              <p class="cash-summary">
                {calculation.value.cash.isSome() ? (
                  <Trans
                    t={t}
                    i18nKey="printer.cash"
                    values={{ count: format.format(calculation.value.cash.value) }}
                  />
                ) : (
                  <Trans t={t} i18nKey="printer.cashUnknown" />
                )}
              </p>
            </>
          )}
          <p class="field-hint">
            <Trans t={t} i18nKey="requirements.shared" />
          </p>
        </section>
      </div>
    </div>
  );
}
