import type { Item, ItemId, ItemRarity } from "../types/item";

const rarityOrder: Readonly<Record<ItemRarity, number>> = {
  common: 0,
  uncommon: 1,
  rare: 2,
  epic: 3,
  legendary: 4,
  ultra: 5,
};

// Only this tactical sequence is confirmed by the supplied client screenshots.
// Other ties retain source order; English names and project IDs are not official sort keys.
const tacticalOrder = new Map<ItemId, number>([
  ["item:stun-grenade", 0],
  ["item:snapshot-grenade", 1],
  ["item:smoke-grenade", 2],
  ["item:shock-stick", 3],
  ["item:screamer-mine", 4],
  ["item:flash", 5],
  ["item:decoy-grenade", 6],
  ["item:stim", 7],
  ["item:heartbeat-sensor", 8],
]);

/** Sort one category without changing its source data or the user's selection order. */
export function sortCatalogEntries<T>(
  entries: readonly T[],
  getItem: (entry: T) => Item,
  isUnlocked: (entry: T) => boolean,
): T[] {
  return entries
    .map((entry, index) => {
      const item = getItem(entry);
      return {
        entry,
        index,
        locked: isUnlocked(entry) ? 0 : 1,
        rarity: item.rarity?.status === "reported" ? rarityOrder[item.rarity.value] : 6,
        order: tacticalOrder.get(item.id) ?? tacticalOrder.size,
      };
    })
    .sort(
      (a, b) =>
        a.locked - b.locked || a.rarity - b.rarity || a.order - b.order || a.index - b.index,
    )
    .map(({ entry }) => entry);
}
