import type { Item } from "../types/item";
import { weaponManualEntries } from "./weapons";

export const items = [
  {
    id: "item:synthetics",
    kind: "resource",
    name: { en: "Synthetics", zhCN: "合成材料", zhCNOrigin: "official" },
    sourceIds: ["source:official-fob"],
  },
  {
    id: "item:electronics",
    kind: "resource",
    name: { en: "Electronics", zhCN: "电子设备", zhCNOrigin: "official" },
    sourceIds: ["source:official-fob"],
  },
  {
    id: "item:chemicals",
    kind: "resource",
    name: { en: "Chemicals", zhCN: "化学药剂", zhCNOrigin: "official" },
    sourceIds: ["source:official-fob"],
  },
  {
    id: "item:metals",
    kind: "resource",
    name: { en: "Metals", zhCN: "金属", zhCNOrigin: "official" },
    sourceIds: ["source:official-fob"],
  },
  {
    id: "item:binding-catalyst",
    kind: "ingredient",
    name: {
      en: "Binding Catalyst",
      zhCN: "束缚催化剂",
      zhCNOrigin: "official",
      aliases: ["结合催化剂"],
    },
    sourceIds: ["source:official-fob", "source:dmztracker-printer-zh"],
  },
  {
    id: "item:biomaterials",
    kind: "ingredient",
    name: { en: "Biomaterials", zhCN: "生物材料", zhCNOrigin: "official" },
    sourceIds: ["source:official-fob", "source:hub-biomaterials"],
  },
  {
    id: "item:rigid-synthetics",
    kind: "ingredient",
    name: {
      en: "Rigid Synthetics",
      zhCN: "硬质合成材料",
      zhCNOrigin: "official",
      aliases: ["刚性合成材料"],
    },
    sourceIds: [
      "source:official-fob",
      "source:dmztracker-printer-zh",
      "source:hub-rigid-synthetics",
    ],
  },
  {
    id: "item:electronic-sensors",
    kind: "ingredient",
    name: { en: "Electronic Sensors", zhCN: "电子传感器", zhCNOrigin: "community" },
    sourceIds: ["source:dmztracker-printer-zh", "source:hub-recon-drone"],
  },
  {
    id: "item:structural-alloy",
    kind: "ingredient",
    name: { en: "Structural Alloy", zhCN: "结构合金", zhCNOrigin: "official" },
    sourceIds: [
      "source:official-progression-zh",
      "source:dmztracker-printer-zh",
      "source:hub-small-secure-backpack",
    ],
  },
  {
    id: "item:high-tenacity-fibers",
    kind: "ingredient",
    name: {
      en: "High-Tenacity Fibers",
      zhCN: "高韧度纤维",
      zhCNOrigin: "official",
      aliases: ["高韧性纤维"],
    },
    sourceIds: [
      "source:official-progression-zh",
      "source:dmztracker-printer-zh",
      "source:hub-ballistic-fabric",
    ],
  },
  {
    id: "item:ballistic-fabric",
    kind: "ingredient",
    name: { en: "Ballistic Fabric", zhCN: "防弹织物", zhCNOrigin: "community" },
    sourceIds: ["source:dmztracker-printer-zh", "source:hub-ballistic-fabric"],
  },
  {
    id: "item:bandage",
    kind: "equipment",
    category: "consumable",
    name: { en: "Bandage", zhCN: "绷带", zhCNOrigin: "official" },
    sourceIds: ["source:official-fob"],
  },
  {
    id: "item:medkit",
    kind: "equipment",
    category: "consumable",
    name: { en: "Medkit", zhCN: "医疗包", zhCNOrigin: "official" },
    sourceIds: ["source:official-fob"],
  },
  {
    id: "item:medium-backpack",
    kind: "equipment",
    category: "backpack",
    name: { en: "Medium Backpack", zhCN: "中型背包", zhCNOrigin: "official" },
    sourceIds: ["source:official-fob"],
  },
  {
    id: "item:sedative-inhaler",
    kind: "equipment",
    category: "consumable",
    name: {
      en: "Sedative Inhaler",
      zhCN: "镇静剂吸入器",
      zhCNOrigin: "official",
      aliases: ["镇静吸入剂"],
    },
    sourceIds: [
      "source:official-progression-zh",
      "source:dmztracker-printer-zh",
      "source:hub-sedative-inhaler",
    ],
  },
  {
    id: "item:recon-drone",
    kind: "equipment",
    category: "field-upgrade",
    name: {
      en: "Recon Drone",
      zhCN: "侦察无人机",
      zhCNOrigin: "official",
      aliases: ["斥候无人机"],
    },
    sourceIds: [
      "source:official-progression-zh",
      "source:dmztracker-printer-zh",
      "source:hub-recon-drone",
    ],
  },
  {
    id: "item:small-secure-backpack",
    kind: "equipment",
    category: "backpack",
    name: { en: "Small Secure Backpack", zhCN: "小型安全背包", zhCNOrigin: "community" },
    sourceIds: ["source:dmztracker-printer-zh", "source:hub-small-secure-backpack"],
  },
  {
    id: "item:radiation-blockers",
    kind: "equipment",
    category: "consumable",
    name: {
      en: "Radiation Blockers",
      zhCN: "防辐射药",
      zhCNOrigin: "official",
      aliases: ["抗辐射药"],
    },
    sourceIds: [
      "source:official-progression-zh",
      "source:dmztracker-printer-zh",
      "source:hub-radiation-blockers",
    ],
  },
  ...weaponManualEntries.map(
    (entry) =>
      ({
        id: entry.weaponItemId,
        kind: "weapon",
        category: entry.category,
        name: entry.weaponName,
        sourceIds: entry.sourceIds,
      }) satisfies Item,
  ),
  ...weaponManualEntries.map(
    (entry) =>
      ({
        id: entry.manualItemId,
        kind: "weapon-manual",
        weaponId: entry.weaponItemId,
        name: entry.manualName,
        sourceIds: entry.sourceIds,
      }) satisfies Item,
  ),
] as const satisfies readonly Item[];
