import type { Catalog } from "../types/catalog";
import { capabilities } from "./capabilities";
import { items } from "./items";
import { manualUnlocks } from "./manuals";
import { recipes } from "./recipes";
import { sources } from "./sources";

export const catalog = {
  schemaVersion: 1,
  game: "mw4-dmz",
  dataVersion: "2026-11-05.rarity.1",
  collectedOn: "2026-11-05",
  coverage: "sample",
  sources,
  items,
  recipes,
  capabilities,
  manualUnlocks,
} as const satisfies Catalog;
