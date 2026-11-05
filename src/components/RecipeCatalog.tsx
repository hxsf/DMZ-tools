import { useState } from "preact/hooks";
import { Trans, useTranslation } from "react-i18next";
import { getItemName, itemById } from "../data/display";
import { recipes } from "../data/recipes";
import type { RecipeId } from "../types/recipe";
import { Icon } from "./Icon";
import { ItemImage } from "./ItemImage";
import { QuantityStepper } from "./QuantityStepper";

const categoryOrder = [
  "consumable",
  "armor",
  "backpack",
  "tactical",
  "lethal",
  "field-upgrade",
  "fire-support",
  "gear",
  "ingredient",
] as const;
type RecipeCategory = (typeof categoryOrder)[number];

const entries = recipes.flatMap((recipe) => {
  const item = itemById.get(recipe.output.itemId);
  if (!item || (item.kind !== "ingredient" && item.kind !== "equipment")) return [];
  return [{ recipe, item, category: item.kind === "ingredient" ? "ingredient" : item.category }];
});

interface RecipeCatalogProps {
  readonly quantities: ReadonlyMap<RecipeId, string>;
  readonly disabled: boolean;
  readonly onQuantityChange: (recipeId: RecipeId, value: string) => void;
}

function normalizeSearch(text: string): string {
  return text.normalize("NFKC").toLocaleLowerCase().replace(/\s+/g, "");
}

export function RecipeCatalog({ quantities, disabled, onQuantityChange }: RecipeCatalogProps) {
  const { t, i18n } = useTranslation();
  const language = i18n.resolvedLanguage ?? i18n.language;
  const format = new Intl.NumberFormat(language);
  const [search, setSearch] = useState("");
  const [collapsed, setCollapsed] = useState<ReadonlySet<RecipeCategory>>(new Set());
  const [searchCollapsed, setSearchCollapsed] = useState<ReadonlySet<RecipeCategory>>(new Set());
  const query = normalizeSearch(search);
  const expandedState = query ? searchCollapsed : collapsed;
  const visible = entries.filter(({ item }) =>
    [item.name.en, item.name.zhCN ?? "", ...(item.name.aliases ?? [])].some((name) =>
      normalizeSearch(name).includes(query),
    ),
  );

  function toggleCategory(category: RecipeCategory) {
    const next = new Set(expandedState);
    if (next.has(category)) next.delete(category);
    else next.add(category);
    if (query) setSearchCollapsed(next);
    else setCollapsed(next);
  }

  return (
    <section class="printer-catalog" aria-label={t("printer.catalog")}>
      <div class="printer-catalog-toolbar">
        <label class="catalog-search">
          <Icon name="search" />
          <input
            type="search"
            value={search}
            aria-label={t("printer.search")}
            placeholder={t("printer.search")}
            onInput={(event) => {
              setSearch(event.currentTarget.value);
              setSearchCollapsed(new Set());
            }}
          />
        </label>
      </div>
      <div class="printer-catalog-list">
        {categoryOrder.map((category) => {
          const rows = visible.filter((entry) => entry.category === category);
          if (rows.length === 0) return undefined;
          const expanded = !expandedState.has(category);
          const contentId = `printer-${category}-products`;
          return (
            <section class="printer-category" key={category}>
              <button
                class="group-heading"
                type="button"
                aria-expanded={expanded}
                aria-controls={contentId}
                onClick={() => toggleCategory(category)}
              >
                <Icon name={expanded ? "chevron-down" : "chevron-right"} />
                <Trans t={t} i18nKey={`unlock.groups.${category}`} />
                <span class="group-count">{format.format(rows.length)}</span>
              </button>
              <div class="printer-product-list" id={contentId} hidden={!expanded}>
                {rows.map(({ recipe, item }) => {
                  const name = getItemName(item, language);
                  return (
                    <div
                      class={`printer-product-row${quantities.has(recipe.id) ? " is-selected" : ""}`}
                      key={recipe.id}
                    >
                      <div class="printer-product-name">
                        <ItemImage itemId={item.id} />
                        <span class="printer-product-copy">
                          <span>{name}</span>
                          {recipe.cost.status === "conflicting" && (
                            <small class="item-notice">
                              <Trans t={t} i18nKey="printer.conflict" />
                            </small>
                          )}
                        </span>
                      </div>
                      <QuantityStepper
                        name={name}
                        value={quantities.get(recipe.id) ?? "0"}
                        disabled={disabled}
                        onChange={(value) => onQuantityChange(recipe.id, value)}
                      />
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
        {visible.length === 0 && (
          <p class="empty-state" role="status">
            <Trans t={t} i18nKey="printer.emptySearch" />
          </p>
        )}
      </div>
    </section>
  );
}
