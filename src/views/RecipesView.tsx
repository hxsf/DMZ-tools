import { useTranslation } from "react-i18next";
import { UnlockList, type UnlockEntry, type UnlockGroup } from "../components/UnlockList";
import { useApp } from "../context";
import { getItemName, itemById } from "../data/display";
import { recipes } from "../data/recipes";
import type { Item } from "../types/item";

function recipeGroup(item: Item): UnlockGroup {
  if (item.kind === "ingredient") return "ingredient";
  if (item.kind === "equipment") return item.category;
  return "other";
}

export default function RecipesView() {
  const { t, i18n } = useTranslation();
  const { stores, persist } = useApp();
  const progress = stores.unlocks.state.value.recipes;
  const language = i18n.resolvedLanguage ?? i18n.language;
  const formatNumber = new Intl.NumberFormat(language);
  const entries = recipes.flatMap((recipe): UnlockEntry[] => {
    const item = itemById.get(recipe.output.itemId);
    if (!item) return [];
    const secondary =
      recipe.cost.status === "reported"
        ? recipe.cost.value.items
            .map((amount) => {
              const ingredient = itemById.get(amount.itemId);
              return t("unlock.materialAmount", {
                name: ingredient ? getItemName(ingredient, language) : amount.itemId,
                quantity: formatNumber.format(amount.quantity),
              });
            })
            .join(" · ")
        : undefined;
    return [
      {
        id: recipe.id,
        item,
        group: recipeGroup(item),
        checked: progress[recipe.id]?.status === "unlocked",
        secondary,
        notice: recipe.cost.status === "conflicting" ? "costConflict" : undefined,
        onChange(checked) {
          stores.unlocks.setRecipe(recipe.id, checked ? "unlocked" : "locked");
          void persist();
        },
      },
    ];
  });
  return <UnlockList entries={entries} kind="recipes" />;
}
