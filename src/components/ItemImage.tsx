import { itemImages } from "../data/images";
import { itemById } from "../data/display";
import type { ItemId } from "../types/item";

export function ItemImage({ itemId }: { itemId: ItemId }) {
  const source = itemImages[itemId];
  const isResource = itemById.get(itemId)?.kind === "resource";
  return source ? (
    <img
      class={`item-image${isResource ? " is-resource" : ""}`}
      src={source}
      alt=""
      loading="lazy"
    />
  ) : undefined;
}
