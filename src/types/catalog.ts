import type { Item } from "./item";
import type { Recipe } from "./recipe";
import type { DataSource } from "./source";
import type { Capability, WeaponManualUnlock } from "./unlock";

export interface Catalog {
  readonly schemaVersion: 1;
  readonly game: "mw4-dmz";
  readonly dataVersion: string;
  readonly collectedOn: string;
  /** 本批为代表性样本，不表示全量或已实测。 */
  readonly coverage: "sample" | "full";
  readonly sources: readonly DataSource[];
  readonly items: readonly Item[];
  readonly recipes: readonly Recipe[];
  readonly capabilities: readonly Capability[];
  readonly manualUnlocks: readonly WeaponManualUnlock[];
}
