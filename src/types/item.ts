import type { SourceId } from "./source";

/** 项目内稳定 ID，不使用中文名或声称是官方 ID。 */
export type ItemId = `item:${string}`;

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
  /** official 表示官方发表的用名；不等于已核对当前客户端。出处见物品 sourceIds。 */
  readonly zhCNOrigin?: "official" | "community" | "project";
  /** 用于多语检索，可能包含官网异名、社区译名或项目说明名。 */
  readonly aliases?: readonly string[];
}

interface ItemBase {
  readonly id: ItemId;
  readonly name: ItemName;
  readonly sourceIds: readonly [SourceId, ...SourceId[]];
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
