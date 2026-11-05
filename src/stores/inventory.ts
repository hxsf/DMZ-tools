import { computed, signal } from "@preact/signals";
import { isCount, isId, isInventory } from "../storage";
import type { ItemId } from "../types/item";
import type { Inventory } from "../types/progress";

export function createInventoryStore(initial: Inventory) {
  if (!isInventory(initial)) throw new Error("初始化库存无效。");
  const value = signal<Inventory>(structuredClone(initial));
  return {
    state: computed(() => value.value),
    setQuantity(itemId: ItemId, quantity: number) {
      if (!isId(itemId, "item:")) throw new Error("物品 ID 无效。");
      if (!isCount(quantity)) throw new Error("物品数量必须是非负安全整数。");
      value.value = { ...value.value, items: { ...value.value.items, [itemId]: quantity } };
    },
    forgetQuantity(itemId: ItemId) {
      if (!isId(itemId, "item:")) throw new Error("物品 ID 无效。");
      const items = { ...value.value.items };
      delete items[itemId];
      value.value = { ...value.value, items };
    },
    setCash(cash: number | null) {
      if (cash !== null && !isCount(cash)) throw new Error("现金必须是非负安全整数或未知。");
      value.value = { ...value.value, cash };
    },
    replace(inventory: Inventory) {
      if (!isInventory(inventory)) throw new Error("替换库存无效。");
      value.value = structuredClone(inventory);
    },
  };
}
