import { useTranslation } from "react-i18next";
import { itemImages } from "../data/images";
import { itemById } from "../data/display";
import type { ItemId } from "../types/item";

export function ItemImage({ itemId }: { itemId: ItemId }) {
  const { t } = useTranslation();
  const item = itemById.get(itemId);
  const source = itemImages[itemId];
  const isResource = item?.kind === "resource";
  const rarity = item?.rarity?.status === "reported" ? item.rarity.value : undefined;
  const rarityLabel = rarity
    ? t("rarity.label", {
        rarity: t(`rarity.${rarity}`),
      })
    : undefined;
  return source ? (
    <img
      class={`item-image${isResource ? " is-resource" : ""}`}
      data-rarity={rarity}
      src={source}
      alt={rarityLabel ?? ""}
      title={rarityLabel}
      loading="lazy"
    />
  ) : undefined;
}
