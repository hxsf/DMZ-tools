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
import type { Recipe, RecipeId } from "../types/recipe";
import type { RequirementTarget } from "../types/requirement";
import { appPath } from "../paths";

const recipes: readonly Recipe[] = recipeData;

interface DraftTarget {
  readonly recipeId: RecipeId;
  readonly quantity: string;
  readonly outputPerCraft: string;
}

function parseCount(raw: string): number {
  return /^\d+$/.test(raw.trim()) ? Number(raw) : Number.NaN;
}

function validCount(raw: string): boolean {
  const value = parseCount(raw);
  return Number.isSafeInteger(value) && value > 0;
}

export default function PrinterView() {
  const { t, i18n } = useTranslation();
  const { stores, persist, saveStatus } = useApp();
  const [drafts, setDrafts] = useState<readonly DraftTarget[]>([]);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [deduct, setDeduct] = useState(true);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const language = i18n.resolvedLanguage ?? i18n.language;
  const format = new Intl.NumberFormat(language);
  const targets: readonly RequirementTarget[] = drafts.map((draft) => ({
    kind: "craft",
    recipeId: draft.recipeId,
    quantity: parseCount(draft.quantity),
    ...(draft.outputPerCraft.trim() === ""
      ? {}
      : { outputPerCraft: parseCount(draft.outputPerCraft) }),
  }));
  const calculation = calculateMaterials(targets, recipes, stores.inventory.state.value);
  const query = search.trim().toLocaleLowerCase(language);
  const options = recipes.filter((recipe) => {
    if (drafts.some((draft) => draft.recipeId === recipe.id)) return false;
    const item = itemById.get(recipe.output.itemId);
    if (!item) return false;
    return [item.name.en, item.name.zhCN ?? "", ...(item.name.aliases ?? [])]
      .join(" ")
      .toLocaleLowerCase(language)
      .includes(query);
  });

  function updateDraft(recipeId: RecipeId, change: Partial<DraftTarget>) {
    setAdded(false);
    setDrafts((current) =>
      current.map((draft) => (draft.recipeId === recipeId ? { ...draft, ...change } : draft)),
    );
  }

  async function addRequirements() {
    if (adding || targets.length === 0 || calculation.isErr()) return;
    setAdding(true);
    setAdded(false);
    stores.plans.upsert({
      id: `plan:${crypto.randomUUID()}`,
      title: t("printer.planName", { count: stores.plans.state.value.length + 1 }),
      status: "active",
      priority: 0,
      targets,
    });
    await persist();
    setDrafts([]);
    setAdding(false);
    setAdded(saveStatus.value === "saved");
  }

  return (
    <div class="printer-page">
      {added && (
        <div class="notice success" role="status">
          <Trans t={t} i18nKey="printer.added" />
          <a class="text-action" href={appPath("/requirements")}>
            <Trans t={t} i18nKey="printer.openRequirements" />
          </a>
        </div>
      )}
      <div class="calculator-layout">
        <details class="target-panel" open>
          <summary class="panel-heading">
            <span>
              <Trans t={t} i18nKey="printer.targets" />
              <span class="group-count">{format.format(drafts.length)}</span>
            </span>
            <Icon name="chevron-down" />
          </summary>
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
                  const quantity = parseCount(draft.quantity);
                  const editableOutput = recipe.output.quantity.status === "unknown";
                  return (
                    <div class="target-row" key={draft.recipeId}>
                      <div class="target-name">
                        <ItemImage itemId={recipe.output.itemId} />
                        <span>{name}</span>
                      </div>
                      <div class="quantity-field">
                        <div class="quantity-stepper">
                          <button
                            type="button"
                            aria-label={t("common.decrease", { name })}
                            disabled={adding || !validCount(draft.quantity) || quantity <= 1}
                            onClick={() =>
                              updateDraft(draft.recipeId, { quantity: String(quantity - 1) })
                            }
                          >
                            <Icon name="minus" />
                          </button>
                          <input
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            value={draft.quantity}
                            aria-label={t("printer.countLabel", { name })}
                            aria-invalid={!validCount(draft.quantity)}
                            disabled={adding}
                            onInput={(event) =>
                              updateDraft(draft.recipeId, { quantity: event.currentTarget.value })
                            }
                          />
                          <button
                            type="button"
                            aria-label={t("common.increase", { name })}
                            disabled={
                              adding ||
                              !validCount(draft.quantity) ||
                              quantity >= Number.MAX_SAFE_INTEGER
                            }
                            onClick={() =>
                              updateDraft(draft.recipeId, { quantity: String(quantity + 1) })
                            }
                          >
                            <Icon name="plus" />
                          </button>
                        </div>
                      </div>
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
                          aria-invalid={editableOutput && !validCount(draft.outputPerCraft)}
                          readOnly={!editableOutput}
                          disabled={adding}
                          onInput={(event) =>
                            updateDraft(draft.recipeId, {
                              outputPerCraft: event.currentTarget.value,
                            })
                          }
                        />
                      </div>
                      <button
                        class="icon-button"
                        type="button"
                        aria-label={t("common.remove", { name })}
                        disabled={adding}
                        onClick={() =>
                          setDrafts((current) =>
                            current.filter((entry) => entry.recipeId !== draft.recipeId),
                          )
                        }
                      >
                        <Icon name="trash" />
                      </button>
                    </div>
                  );
                })}
                {drafts.some(
                  (draft) =>
                    recipes.find((recipe) => recipe.id === draft.recipeId)?.output.quantity
                      .status === "unknown",
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
            <div class="recipe-picker">
              <button
                class="add-item-button"
                type="button"
                aria-expanded={pickerOpen}
                aria-controls="recipe-options"
                disabled={adding}
                onClick={() => setPickerOpen((open) => !open)}
              >
                <Icon name="plus" />
                <Trans t={t} i18nKey="printer.add" />
              </button>
              {pickerOpen && (
                <div class="recipe-options" id="recipe-options">
                  <label class="recipe-search">
                    <Icon name="search" />
                    <input
                      type="search"
                      value={search}
                      placeholder={t("printer.search")}
                      aria-label={t("printer.search")}
                      onInput={(event) => setSearch(event.currentTarget.value)}
                    />
                  </label>
                  {options.map((recipe) => {
                    const item = itemById.get(recipe.output.itemId);
                    return (
                      <button
                        type="button"
                        class="recipe-option"
                        key={recipe.id}
                        disabled={adding}
                        onClick={() => {
                          setDrafts((current) => [
                            ...current,
                            { recipeId: recipe.id, quantity: "1", outputPerCraft: "" },
                          ]);
                          setPickerOpen(false);
                          setSearch("");
                          setAdded(false);
                        }}
                      >
                        <ItemImage itemId={recipe.output.itemId} />
                        <span>{item ? getItemName(item, language) : recipe.output.itemId}</span>
                        {recipe.cost.status === "conflicting" && (
                          <small>
                            <Trans t={t} i18nKey="printer.conflict" />
                          </small>
                        )}
                        <Icon name="plus" />
                      </button>
                    );
                  })}
                  {options.length === 0 && (
                    <p class="field-hint">
                      <Trans t={t} i18nKey="printer.emptySearch" />
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </details>
        <section class="result-panel" aria-labelledby="printer-materials-heading">
          <div class="panel-heading">
            <h2 id="printer-materials-heading">
              <Trans t={t} i18nKey="printer.materials" />
            </h2>
            <label class="checkbox-field">
              <input
                type="checkbox"
                checked={deduct}
                onChange={(event) => setDeduct(event.currentTarget.checked)}
              />
              <Trans t={t} i18nKey="printer.deduct" />
            </label>
          </div>
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
          <div class="action-row">
            <span class="field-hint">
              <Trans t={t} i18nKey="printer.directOnly" />
            </span>
            <button
              class="primary-button"
              type="button"
              disabled={adding || drafts.length === 0 || calculation.isErr()}
              onClick={() => void addRequirements()}
            >
              <Icon name="plus" />
              <Trans t={t} i18nKey="printer.addRequirements" />
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
