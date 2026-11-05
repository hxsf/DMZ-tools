import type { ItemId } from "./item";
import type { Fact } from "./source";

export type CapabilityId =
  | "3d-printer"
  | "field-upgrade-printing"
  | "uncommon-ingredient-printing"
  | "epic-ingredient-printing"
  | "gunsmith";

/** 配方如何获得，与获得后能否制作分开记录。 */
export type UnlockCondition =
  | { readonly kind: "dmz-level"; readonly level: number }
  | { readonly kind: "extract-recipe" }
  | { readonly kind: "mission"; readonly missionName: string }
  | { readonly kind: "capability"; readonly capabilityId: CapabilityId }
  | {
      readonly kind: "all" | "any";
      readonly conditions: readonly [UnlockCondition, ...UnlockCondition[]];
    };

export interface Capability {
  readonly id: CapabilityId;
  readonly name: string;
  readonly unlock: Fact<UnlockCondition>;
}

/** 手册实体可被消耗，永久购买权限独立于物品库存。 */
export interface WeaponManualUnlock {
  readonly manualItemId: ItemId;
  readonly weaponItemId: ItemId;
  /** 以下均为可选参考信息，不限制用户手动标记。 */
  readonly completion?: Fact<"successful-exfil">;
  readonly consumedOnCompletion?: Fact<boolean>;
  readonly cashReward?: Fact<number>;
  readonly purchaseRequires?: readonly CapabilityId[];
}
