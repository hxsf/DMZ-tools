import type { Item } from "../types/item";
import { items } from "./items";

export const itemById = new Map<string, Item>(items.map((item) => [item.id, item]));

export function getItemName(item: Item, language: string): string {
  return language.startsWith("zh") ? (item.name.zhCN ?? item.name.en) : item.name.en;
}
