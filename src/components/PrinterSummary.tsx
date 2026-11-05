import { Trans, useTranslation } from "react-i18next";
import type { Result } from "ts-results-es";
import { getItemName, itemById } from "../data/display";
import { recipes as recipeData } from "../data/recipes";
import type { CalculationIssue, MaterialSummary, PrintDraft } from "../types/calculation";
import type { Recipe, RecipeId } from "../types/recipe";
import { CalculationIssues } from "./CalculationIssues";
import { Icon } from "./Icon";
import { ItemImage } from "./ItemImage";
import { MaterialList } from "./MaterialList";
import { QuantityStepper } from "./QuantityStepper";

const recipes: readonly Recipe[] = recipeData;

interface PrinterSummaryProps {
  readonly drafts: readonly PrintDraft[];
  readonly calculation: Result<MaterialSummary, readonly CalculationIssue[]>;
  readonly deduct: boolean;
  readonly adding: boolean;
  readonly onQuantityChange: (id: RecipeId, quantity: string) => void;
  readonly onOutputChange: (id: RecipeId, output: string) => void;
  readonly onDeductChange: (deduct: boolean) => void;
  readonly onSubmit: () => void;
}

export function PrinterSummary({
  drafts,
  calculation,
  deduct,
  adding,
  onQuantityChange,
  onOutputChange,
  onDeductChange,
  onSubmit,
}: PrinterSummaryProps) {
  const { t, i18n } = useTranslation();
  const language = i18n.resolvedLanguage ?? i18n.language;
  const format = new Intl.NumberFormat(language);
  return (
    <div class="printer-summary">
      <section class="target-panel" aria-labelledby="printer-targets-heading">
        <div class="panel-heading">
          <h2 id="printer-targets-heading">
            <Trans t={t} i18nKey="printer.targets" />
            <span class="group-count">{format.format(drafts.length)}</span>
          </h2>
        </div>
        <div class="target-content">
          {drafts.length > 0 ? (
            <>
              <div class="target-columns" aria-hidden="true">
                <span>
                  <Trans t={t} i18nKey="common.items" />
                </span>
                <span>
                  <Trans t={t} i18nKey="printer.count" />
                </span>
                <span>
                  <Trans t={t} i18nKey="printer.output" />
                </span>
                <span />
              </div>
              {drafts.map((draft) => {
                const recipe = recipes.find((entry) => entry.id === draft.recipeId);
                if (!recipe) return undefined;
                const item = itemById.get(recipe.output.itemId);
                const name = item ? getItemName(item, language) : recipe.output.itemId;
                const editableOutput = recipe.output.quantity.status === "unknown";
                const validOutput =
                  /^\d+$/.test(draft.outputPerCraft.trim()) &&
                  Number.isSafeInteger(Number(draft.outputPerCraft)) &&
                  Number(draft.outputPerCraft) > 0;
                return (
                  <div class="target-row" key={draft.recipeId}>
                    <div class="target-name">
                      <ItemImage itemId={recipe.output.itemId} />
                      <span>{name}</span>
                    </div>
                    <QuantityStepper
                      name={name}
                      value={draft.quantity}
                      disabled={adding}
                      onChange={(value) => onQuantityChange(draft.recipeId, value)}
                    />
                    <div class="output-field">
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={
                          recipe.output.quantity.status === "reported"
                            ? String(recipe.output.quantity.value)
                            : draft.outputPerCraft
                        }
                        placeholder={t("printer.needed")}
                        aria-label={t("printer.outputLabel", { name })}
                        aria-describedby={editableOutput ? "output-hint" : undefined}
                        aria-invalid={editableOutput && !validOutput}
                        readOnly={!editableOutput}
                        disabled={adding}
                        onInput={(event) =>
                          onOutputChange(draft.recipeId, event.currentTarget.value)
                        }
                      />
                    </div>
                    <button
                      class="icon-button"
                      type="button"
                      aria-label={t("common.remove", { name })}
                      disabled={adding}
                      onClick={() => onQuantityChange(draft.recipeId, "0")}
                    >
                      <Icon name="trash" />
                    </button>
                  </div>
                );
              })}
              {drafts.some(
                (draft) =>
                  recipes.find((recipe) => recipe.id === draft.recipeId)?.output.quantity.status ===
                  "unknown",
              ) && (
                <p class="field-hint" id="output-hint">
                  <Trans t={t} i18nKey="printer.outputHint" />
                </p>
              )}
            </>
          ) : (
            <p class="empty-state">
              <Trans t={t} i18nKey="printer.noTargets" />
            </p>
          )}
        </div>
      </section>
      <section class="result-panel" aria-labelledby="printer-materials-heading">
        <div class="panel-heading">
          <h2 id="printer-materials-heading">
            <Trans t={t} i18nKey="printer.materials" />
          </h2>
          <label class="checkbox-field">
            <input
              type="checkbox"
              checked={deduct}
              onChange={(event) => onDeductChange(event.currentTarget.checked)}
            />
            <Trans t={t} i18nKey="printer.deduct" />
          </label>
        </div>
        <div class="printer-material-content">
          {drafts.length === 0 ? (
            <p class="empty-state">
              <Trans t={t} i18nKey="printer.addHint" />
            </p>
          ) : calculation.isErr() ? (
            <CalculationIssues issues={calculation.error} />
          ) : (
            <>
              <MaterialList summary={calculation.value} deduct={deduct} />
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
        </div>
        <div class="action-row">
          <span class="field-hint">
            <Trans t={t} i18nKey="printer.directOnly" />
          </span>
          <button
            class="primary-button"
            type="button"
            disabled={adding || drafts.length === 0 || calculation.isErr()}
            onClick={onSubmit}
          >
            <Icon name="plus" />
            <Trans t={t} i18nKey="printer.addRequirements" />
          </button>
        </div>
      </section>
    </div>
  );
}
