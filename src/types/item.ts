import type { Fact, SourceId } from "./source";

/** 项目内稳定 ID，不使用中文名或声称是官方 ID。 */
export type ItemId = `item:${string}`;

export type ItemRarity = "common" | "uncommon" | "rare" | "epic" | "legendary" | "ultra";

export type WeaponCategory =
  | "assault-rifle"
  | "smg"
  | "shotgun"
  | "lmg"
  | "marksman-rifle"
  | "sniper-rifle"
  | "pistol"
  | "launcher";

export interface ItemName {
  readonly en: string;
  readonly zhCN?: string;
  /** official 表示官方文章或客户端用名；具体证据与版本见物品 sourceIds。 */
  readonly zhCNOrigin?: "official" | "community" | "project";
  /** 用于多语检索，可能包含官网异名、社区译名或项目说明名。 */
  readonly aliases?: readonly string[];
}

interface ItemBase {
  readonly id: ItemId;
  readonly name: ItemName;
  readonly sourceIds: readonly [SourceId, ...SourceId[]];
  /** 缺省表示未收集；武器本体与对应手册的稀有度分别记录。 */
  readonly rarity?: Fact<ItemRarity>;
  /** 可选，缺省表示尚未收集。 */
  readonly icon?: string;
}

export type Item =
  | (ItemBase & { readonly kind: "resource" })
  | (ItemBase & { readonly kind: "ingredient" })
  | (ItemBase & {
      readonly kind: "equipment";
      readonly category:
        | "consumable"
        | "backpack"
        | "armor"
        | "tactical"
        | "lethal"
        | "field-upgrade"
        | "fire-support"
        | "gear";
    })
  | (ItemBase & { readonly kind: "weapon"; readonly category?: WeaponCategory })
  | (ItemBase & {
      readonly kind: "weapon-manual";
      readonly weaponId: ItemId;
    });

export interface ItemAmount {
  readonly itemId: ItemId;
  /** 正整数；外部输入需要运行时校验。 */
  readonly quantity: number;
}
