import type { Item } from "../types/item";
import { weaponManualEntries } from "./weapons";
import { itemRarities } from "./rarities";

const definitions = [
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
  {
    id: "item:alloyed-plating",
    kind: "ingredient",
    name: {
      en: "Alloyed Plating",
      zhCN: "合金装甲",
      zhCNOrigin: "community",
    },
    sourceIds: ["source:hub-printer-catalog", "source:hub-printer-catalog-zh"],
  },
  {
    id: "item:cpu",
    kind: "ingredient",
    name: {
      en: "CPU",
      zhCN: "CPU",
      zhCNOrigin: "official",
    },
    sourceIds: [
      "source:hub-printer-catalog",
      "source:hub-printer-catalog-zh",
      "source:official-progression-zh",
    ],
  },
  {
    id: "item:comms-module",
    kind: "ingredient",
    name: {
      en: "Comms Module",
      zhCN: "通讯模块",
      zhCNOrigin: "community",
    },
    sourceIds: ["source:hub-printer-catalog", "source:hub-printer-catalog-zh"],
  },
  {
    id: "item:control-unit",
    kind: "ingredient",
    name: {
      en: "Control Unit",
      zhCN: "控制单元",
      zhCNOrigin: "official",
    },
    sourceIds: [
      "source:hub-printer-catalog",
      "source:hub-printer-catalog-zh",
      "source:official-progression-zh",
    ],
  },
  {
    id: "item:detonators",
    kind: "ingredient",
    name: {
      en: "Detonators",
      zhCN: "起爆器",
      zhCNOrigin: "official",
    },
    sourceIds: [
      "source:hub-printer-catalog",
      "source:hub-printer-catalog-zh",
      "source:official-progression-zh",
    ],
  },
  {
    id: "item:experimental-compounds",
    kind: "ingredient",
    name: {
      en: "Experimental Compounds",
      zhCN: "实验性化合物",
      zhCNOrigin: "community",
    },
    sourceIds: ["source:hub-printer-catalog", "source:hub-printer-catalog-zh"],
  },
  {
    id: "item:military-composites",
    kind: "ingredient",
    name: {
      en: "Military Composites",
      zhCN: "军用复合材料",
      zhCNOrigin: "community",
    },
    sourceIds: ["source:hub-printer-catalog", "source:hub-printer-catalog-zh"],
  },
  {
    id: "item:nano-structured-alloy",
    kind: "ingredient",
    name: {
      en: "Nano-Structured Alloy",
      zhCN: "纳米结构合金",
      zhCNOrigin: "community",
    },
    sourceIds: ["source:hub-printer-catalog", "source:hub-printer-catalog-zh"],
  },
  {
    id: "item:nitro-compounds",
    kind: "ingredient",
    name: {
      en: "Nitro Compounds",
      zhCN: "硝基化合物",
      zhCNOrigin: "official",
    },
    sourceIds: [
      "source:hub-printer-catalog",
      "source:hub-printer-catalog-zh",
      "source:official-progression-zh",
    ],
  },
  {
    id: "item:nylon-cloth",
    kind: "ingredient",
    name: {
      en: "Nylon Cloth",
      zhCN: "尼龙布",
      zhCNOrigin: "official",
    },
    sourceIds: [
      "source:hub-printer-catalog",
      "source:hub-printer-catalog-zh",
      "source:official-progression-zh",
    ],
  },
  {
    id: "item:nylon-laminate",
    kind: "ingredient",
    name: {
      en: "Nylon Laminate",
      zhCN: "尼龙层压板",
      zhCNOrigin: "community",
    },
    sourceIds: ["source:hub-printer-catalog", "source:hub-printer-catalog-zh"],
  },
  {
    id: "item:power-regulator",
    kind: "ingredient",
    name: {
      en: "Power Regulator",
      zhCN: "动力调节器",
      zhCNOrigin: "community",
    },
    sourceIds: ["source:hub-printer-catalog", "source:hub-printer-catalog-zh"],
  },
  {
    id: "item:printed-circuit-board",
    kind: "ingredient",
    name: {
      en: "Printed Circuit Board",
      zhCN: "印刷电路板",
      zhCNOrigin: "official",
    },
    sourceIds: [
      "source:hub-printer-catalog",
      "source:hub-printer-catalog-zh",
      "source:official-progression-zh",
    ],
  },
  {
    id: "item:prototype-rf-module",
    kind: "ingredient",
    name: {
      en: "Prototype RF Module",
      zhCN: "原型射频模块",
      zhCNOrigin: "community",
    },
    sourceIds: ["source:hub-printer-catalog", "source:hub-printer-catalog-zh"],
  },
  {
    id: "item:reactive-metals",
    kind: "ingredient",
    name: {
      en: "Reactive Metals",
      zhCN: "活性金属",
      zhCNOrigin: "official",
    },
    sourceIds: [
      "source:hub-printer-catalog",
      "source:hub-printer-catalog-zh",
      "source:official-progression-zh",
    ],
  },
  {
    id: "item:stabilized-reagents",
    kind: "ingredient",
    name: {
      en: "Stabilized Reagents",
      zhCN: "稳定试剂",
      zhCNOrigin: "community",
    },
    sourceIds: ["source:hub-printer-catalog", "source:hub-printer-catalog-zh"],
  },
  {
    id: "item:stock-rod",
    kind: "ingredient",
    name: {
      en: "Stock Rod",
      zhCN: "枪托连杆",
      zhCNOrigin: "official",
    },
    sourceIds: [
      "source:hub-printer-catalog",
      "source:hub-printer-catalog-zh",
      "source:official-progression-zh",
    ],
  },
  {
    id: "item:turned-components",
    kind: "ingredient",
    name: {
      en: "Turned Components",
      zhCN: "精加工部件",
      zhCNOrigin: "community",
    },
    sourceIds: ["source:hub-printer-catalog", "source:hub-printer-catalog-zh"],
  },
  {
    id: "item:volatile-explosives",
    kind: "ingredient",
    name: {
      en: "Volatile Explosives",
      zhCN: "烈性炸药",
      zhCNOrigin: "community",
    },
    sourceIds: ["source:hub-printer-catalog", "source:hub-printer-catalog-zh"],
  },
  {
    id: "item:door-breacher-charge",
    kind: "equipment",
    category: "consumable",
    name: {
      en: "Door Breacher Charge",
      zhCN: "爆破炸药",
      zhCNOrigin: "official",
    },
    sourceIds: [
      "source:hub-printer-catalog",
      "source:hub-printer-catalog-zh",
      "source:official-progression-zh",
    ],
  },
  {
    id: "item:energy-drink",
    kind: "equipment",
    category: "consumable",
    name: {
      en: "Energy Drink",
      zhCN: "能量饮料",
      zhCNOrigin: "community",
    },
    sourceIds: ["source:hub-printer-catalog", "source:hub-printer-catalog-zh"],
  },
  {
    id: "item:pain-killers",
    kind: "equipment",
    category: "consumable",
    name: {
      en: "Pain Killers",
      zhCN: "止痛药",
      zhCNOrigin: "official",
      aliases: ["止疼药"],
    },
    sourceIds: [
      "source:hub-printer-catalog",
      "source:hub-printer-catalog-zh",
      "source:official-progression-zh",
    ],
  },
  {
    id: "item:self-revive-kit",
    kind: "equipment",
    category: "consumable",
    name: {
      en: "Self-Revive Kit",
      zhCN: "自救包",
      zhCNOrigin: "official",
    },
    sourceIds: [
      "source:hub-printer-catalog",
      "source:hub-printer-catalog-zh",
      "source:official-progression-zh",
    ],
  },
  {
    id: "item:smelling-salts",
    kind: "equipment",
    category: "consumable",
    name: {
      en: "Smelling Salts",
      zhCN: "嗅盐",
      zhCNOrigin: "community",
    },
    sourceIds: ["source:hub-printer-catalog", "source:hub-printer-catalog-zh"],
  },
  {
    id: "item:1-plate-armor-vest",
    kind: "equipment",
    category: "armor",
    name: {
      en: "1-Plate Armor Vest",
      zhCN: "单板防弹衣",
      zhCNOrigin: "official",
    },
    sourceIds: [
      "source:hub-printer-catalog",
      "source:hub-printer-catalog-zh",
      "source:official-progression-zh",
    ],
  },
  {
    id: "item:2-plate-armor-vest",
    kind: "equipment",
    category: "armor",
    name: {
      en: "2-Plate Armor Vest",
      zhCN: "双板防弹衣",
      zhCNOrigin: "official",
    },
    sourceIds: [
      "source:hub-printer-catalog",
      "source:hub-printer-catalog-zh",
      "source:official-progression-zh",
    ],
  },
  {
    id: "item:2-plate-ballistic-gel-vest",
    kind: "equipment",
    category: "armor",
    name: {
      en: "2-Plate Ballistic Gel Vest",
      zhCN: "双板弹道凝胶防弹衣",
      zhCNOrigin: "community",
    },
    sourceIds: ["source:hub-printer-catalog", "source:hub-printer-catalog-zh"],
  },
  {
    id: "item:2-plate-helmet-armor-vest",
    kind: "equipment",
    category: "armor",
    name: {
      en: "2-Plate Helmet Armor Vest",
      zhCN: "双板头盔防弹衣",
      zhCNOrigin: "official",
    },
    sourceIds: [
      "source:hub-printer-catalog",
      "source:hub-printer-catalog-zh",
      "source:official-progression-zh",
    ],
  },
  {
    id: "item:3-plate-armor-vest",
    kind: "equipment",
    category: "armor",
    name: {
      en: "3-Plate Armor Vest",
      zhCN: "三板防弹衣",
      zhCNOrigin: "official",
    },
    sourceIds: [
      "source:hub-printer-catalog",
      "source:hub-printer-catalog-zh",
      "source:official-progression-zh",
    ],
  },
  {
    id: "item:3-plate-ballistic-gel-vest",
    kind: "equipment",
    category: "armor",
    name: {
      en: "3-Plate Ballistic Gel Vest",
      zhCN: "三板弹道凝胶防弹衣",
      zhCNOrigin: "community",
    },
    sourceIds: ["source:hub-printer-catalog", "source:hub-printer-catalog-zh"],
  },
  {
    id: "item:3-plate-helmet-armor-vest",
    kind: "equipment",
    category: "armor",
    name: {
      en: "3-Plate Helmet Armor Vest",
      zhCN: "三板头盔防弹衣",
      zhCNOrigin: "community",
    },
    sourceIds: ["source:hub-printer-catalog", "source:hub-printer-catalog-zh"],
  },
  {
    id: "item:tempered-armor-vest",
    kind: "equipment",
    category: "armor",
    name: {
      en: "Tempered Armor Vest",
      zhCN: "强化防弹衣",
      zhCNOrigin: "community",
    },
    sourceIds: ["source:hub-printer-catalog", "source:hub-printer-catalog-zh"],
  },
  {
    id: "item:large-backpack",
    kind: "equipment",
    category: "backpack",
    name: {
      en: "Large Backpack",
      zhCN: "大型背包",
      zhCNOrigin: "official",
    },
    sourceIds: [
      "source:hub-printer-catalog",
      "source:hub-printer-catalog-zh",
      "source:official-progression-zh",
    ],
  },
  {
    id: "item:large-scavenger-backpack",
    kind: "equipment",
    category: "backpack",
    name: {
      en: "Large Scavenger Backpack",
      zhCN: "大型拾荒者背包",
      zhCNOrigin: "community",
    },
    sourceIds: ["source:hub-printer-catalog", "source:hub-printer-catalog-zh"],
  },
  {
    id: "item:large-secure-backpack",
    kind: "equipment",
    category: "backpack",
    name: {
      en: "Large Secure Backpack",
      zhCN: "大型保险背包",
      zhCNOrigin: "community",
    },
    sourceIds: ["source:hub-printer-catalog", "source:hub-printer-catalog-zh"],
  },
  {
    id: "item:medium-scavenger-backpack",
    kind: "equipment",
    category: "backpack",
    name: {
      en: "Medium Scavenger Backpack",
      zhCN: "中型拾荒者背包",
      zhCNOrigin: "community",
    },
    sourceIds: ["source:hub-printer-catalog", "source:hub-printer-catalog-zh"],
  },
  {
    id: "item:medium-secure-backpack",
    kind: "equipment",
    category: "backpack",
    name: {
      en: "Medium Secure Backpack",
      zhCN: "中型保险背包",
      zhCNOrigin: "community",
    },
    sourceIds: ["source:hub-printer-catalog", "source:hub-printer-catalog-zh"],
  },
  {
    id: "item:medium-weapon-backpack",
    kind: "equipment",
    category: "backpack",
    name: {
      en: "Medium Weapon Backpack",
      zhCN: "中型武器背包",
      zhCNOrigin: "official",
    },
    sourceIds: [
      "source:hub-printer-catalog",
      "source:hub-printer-catalog-zh",
      "source:official-progression-zh",
    ],
  },
  {
    id: "item:secure-scavenger-backpack",
    kind: "equipment",
    category: "backpack",
    name: {
      en: "Secure Scavenger Backpack",
      zhCN: "稳固拾荒者背包",
      zhCNOrigin: "community",
    },
    sourceIds: ["source:hub-printer-catalog", "source:hub-printer-catalog-zh"],
  },
  {
    id: "item:small-backpack",
    kind: "equipment",
    category: "backpack",
    name: {
      en: "Small Backpack",
      zhCN: "小型背包",
      zhCNOrigin: "official",
    },
    sourceIds: [
      "source:hub-printer-catalog",
      "source:hub-printer-catalog-zh",
      "source:official-progression-zh",
    ],
  },
  {
    id: "item:stun-grenade",
    kind: "equipment",
    category: "tactical",
    name: {
      en: "Concussion Grenade",
      zhCN: "震撼弹",
      zhCNOrigin: "official",
    },
    sourceIds: [
      "source:hub-printer-catalog",
      "source:hub-printer-catalog-zh",
      "source:official-progression-zh",
    ],
  },
  {
    id: "item:decoy-grenade",
    kind: "equipment",
    category: "tactical",
    name: {
      en: "Decoy Grenade",
      zhCN: "诱饵手雷",
      zhCNOrigin: "official",
    },
    sourceIds: [
      "source:hub-printer-catalog",
      "source:hub-printer-catalog-zh",
      "source:official-progression-zh",
    ],
  },
  {
    id: "item:flash",
    kind: "equipment",
    category: "tactical",
    name: {
      en: "Flash",
      zhCN: "闪光弹",
      zhCNOrigin: "community",
    },
    sourceIds: ["source:hub-printer-catalog", "source:hub-printer-catalog-zh"],
  },
  {
    id: "item:heartbeat-sensor",
    kind: "equipment",
    category: "tactical",
    name: {
      en: "Heartbeat Sensor",
      zhCN: "心跳探测器",
      zhCNOrigin: "official",
    },
    sourceIds: [
      "source:hub-printer-catalog",
      "source:hub-printer-catalog-zh",
      "source:official-progression-zh",
    ],
  },
  {
    id: "item:screamer-mine",
    kind: "equipment",
    category: "tactical",
    name: {
      en: "Screamer Mine",
      zhCN: "告警器",
      zhCNOrigin: "official",
    },
    sourceIds: [
      "source:hub-printer-catalog",
      "source:hub-printer-catalog-zh",
      "source:official-progression-zh",
    ],
  },
  {
    id: "item:shock-stick",
    kind: "equipment",
    category: "tactical",
    name: {
      en: "Shock Stick",
      zhCN: "电击陷阱",
      zhCNOrigin: "official",
    },
    sourceIds: [
      "source:hub-printer-catalog",
      "source:hub-printer-catalog-zh",
      "source:official-progression-zh",
    ],
  },
  {
    id: "item:smoke-grenade",
    kind: "equipment",
    category: "tactical",
    name: {
      en: "Smoke Grenade",
      zhCN: "烟雾弹",
      zhCNOrigin: "official",
    },
    sourceIds: [
      "source:hub-printer-catalog",
      "source:hub-printer-catalog-zh",
      "source:official-progression-zh",
    ],
  },
  {
    id: "item:snapshot-grenade",
    kind: "equipment",
    category: "tactical",
    name: {
      en: "Snapshot Grenade",
      zhCN: "快照手雷",
      zhCNOrigin: "official",
      aliases: ["探测手雷"],
    },
    sourceIds: [
      "source:hub-printer-catalog",
      "source:hub-printer-catalog-zh",
      "source:official-progression-zh",
    ],
  },
  {
    id: "item:spotter-scope",
    kind: "equipment",
    category: "tactical",
    name: {
      en: "Spotter Scope",
      zhCN: "望远镜",
      zhCNOrigin: "official",
    },
    sourceIds: [
      "source:hub-printer-catalog",
      "source:hub-printer-catalog-zh",
      "source:official-progression-zh",
    ],
  },
  {
    id: "item:stim",
    kind: "equipment",
    category: "tactical",
    name: {
      en: "Stim",
      zhCN: "强心针",
      zhCNOrigin: "official",
    },
    sourceIds: [
      "source:hub-printer-catalog",
      "source:hub-printer-catalog-zh",
      "source:official-progression-zh",
    ],
  },
  {
    id: "item:c4",
    kind: "equipment",
    category: "lethal",
    name: {
      en: "C4",
      zhCN: "塑胶炸弹",
      zhCNOrigin: "official",
    },
    sourceIds: [
      "source:hub-printer-catalog",
      "source:hub-printer-catalog-zh",
      "source:official-progression-zh",
    ],
  },
  {
    id: "item:claymore",
    kind: "equipment",
    category: "lethal",
    name: {
      en: "Claymore",
      zhCN: "阔剑地雷",
      zhCNOrigin: "official",
    },
    sourceIds: [
      "source:hub-printer-catalog",
      "source:hub-printer-catalog-zh",
      "source:official-progression-zh",
    ],
  },
  {
    id: "item:drill-charge",
    kind: "equipment",
    category: "lethal",
    name: {
      en: "Drill Charge",
      zhCN: "钻地炸弹",
      zhCNOrigin: "official",
      aliases: ["穿墙炸弹"],
    },
    sourceIds: [
      "source:hub-printer-catalog",
      "source:hub-printer-catalog-zh",
      "source:official-progression-zh",
    ],
  },
  {
    id: "item:frag-grenade",
    kind: "equipment",
    category: "lethal",
    name: {
      en: "Frag Grenade",
      zhCN: "破片手雷",
      zhCNOrigin: "official",
    },
    sourceIds: [
      "source:hub-printer-catalog",
      "source:hub-printer-catalog-zh",
      "source:official-progression-zh",
    ],
  },
  {
    id: "item:molotov-cocktail",
    kind: "equipment",
    category: "lethal",
    name: {
      en: "Molotov Cocktail",
      zhCN: "燃烧瓶",
      zhCNOrigin: "official",
    },
    sourceIds: [
      "source:hub-printer-catalog",
      "source:hub-printer-catalog-zh",
      "source:official-progression-zh",
    ],
  },
  {
    id: "item:proximity-mine",
    kind: "equipment",
    category: "lethal",
    name: {
      en: "Proximity Mine",
      zhCN: "近炸地雷",
      zhCNOrigin: "official",
    },
    sourceIds: [
      "source:hub-printer-catalog",
      "source:hub-printer-catalog-zh",
      "source:official-progression-zh",
    ],
  },
  {
    id: "item:semtex",
    kind: "equipment",
    category: "lethal",
    name: {
      en: "Semtex",
      zhCN: "粘性手雷",
      zhCNOrigin: "community",
    },
    sourceIds: ["source:hub-printer-catalog", "source:hub-printer-catalog-zh"],
  },
  {
    id: "item:thermite",
    kind: "equipment",
    category: "lethal",
    name: {
      en: "Thermite",
      zhCN: "铝热剂手雷",
      zhCNOrigin: "official",
      aliases: ["铝热剂"],
    },
    sourceIds: [
      "source:hub-printer-catalog",
      "source:hub-printer-catalog-zh",
      "source:official-progression-zh",
    ],
  },
  {
    id: "item:throwing-knife",
    kind: "equipment",
    category: "lethal",
    name: {
      en: "Throwing Knife",
      zhCN: "飞刀",
      zhCNOrigin: "official",
    },
    sourceIds: [
      "source:hub-printer-catalog",
      "source:hub-printer-catalog-zh",
      "source:official-progression-zh",
    ],
  },
  {
    id: "item:trip-wire",
    kind: "equipment",
    category: "lethal",
    name: {
      en: "Trip Wire",
      zhCN: "绊雷",
      zhCNOrigin: "official",
    },
    sourceIds: [
      "source:hub-printer-catalog",
      "source:hub-printer-catalog-zh",
      "source:official-progression-zh",
    ],
  },
  {
    id: "item:zip-gun",
    kind: "equipment",
    category: "lethal",
    name: {
      en: "Zip Gun",
      zhCN: "简易手枪",
      zhCNOrigin: "official",
    },
    sourceIds: [
      "source:hub-printer-catalog",
      "source:hub-printer-catalog-zh",
      "source:official-progression-zh",
    ],
  },
  {
    id: "item:ammo-box",
    kind: "equipment",
    category: "field-upgrade",
    name: {
      en: "Ammo Box",
      zhCN: "弹药箱",
      zhCNOrigin: "official",
    },
    sourceIds: [
      "source:hub-printer-catalog",
      "source:hub-printer-catalog-zh",
      "source:official-progression-zh",
    ],
  },
  {
    id: "item:armor-box",
    kind: "equipment",
    category: "field-upgrade",
    name: {
      en: "Armor Box",
      zhCN: "防弹插板箱",
      zhCNOrigin: "official",
    },
    sourceIds: [
      "source:hub-printer-catalog",
      "source:hub-printer-catalog-zh",
      "source:official-progression-zh",
    ],
  },
  {
    id: "item:ddos",
    kind: "equipment",
    category: "field-upgrade",
    name: {
      en: "DDOS",
      zhCN: "阻网器",
      zhCNOrigin: "community",
    },
    sourceIds: ["source:hub-printer-catalog", "source:hub-printer-catalog-zh"],
  },
  {
    id: "item:defibrillator",
    kind: "equipment",
    category: "field-upgrade",
    name: {
      en: "Defibrillator",
      zhCN: "除颤器",
      zhCNOrigin: "official",
    },
    sourceIds: [
      "source:hub-printer-catalog",
      "source:hub-printer-catalog-zh",
      "source:official-progression-zh",
    ],
  },
  {
    id: "item:fulton-drop-marker",
    kind: "equipment",
    category: "field-upgrade",
    name: {
      en: "Fulton Drop Marker",
      zhCN: "富尔顿空投指示器",
      zhCNOrigin: "community",
    },
    sourceIds: ["source:hub-printer-catalog", "source:hub-printer-catalog-zh"],
  },
  {
    id: "item:inflatable-decoy",
    kind: "equipment",
    category: "field-upgrade",
    name: {
      en: "Inflatable Decoy",
      zhCN: "充气诱饵",
      zhCNOrigin: "official",
    },
    sourceIds: [
      "source:hub-printer-catalog",
      "source:hub-printer-catalog-zh",
      "source:official-progression-zh",
    ],
  },
  {
    id: "item:portable-radar",
    kind: "equipment",
    category: "field-upgrade",
    name: {
      en: "Portable Radar",
      zhCN: "单兵雷达",
      zhCNOrigin: "official",
    },
    sourceIds: [
      "source:hub-printer-catalog",
      "source:hub-printer-catalog-zh",
      "source:official-progression-zh",
    ],
  },
  {
    id: "item:razor-wire-trap",
    kind: "equipment",
    category: "field-upgrade",
    name: {
      en: "Razor Wire Trap",
      zhCN: "铁丝网地雷",
      zhCNOrigin: "official",
    },
    sourceIds: [
      "source:hub-printer-catalog",
      "source:hub-printer-catalog-zh",
      "source:official-progression-zh",
    ],
  },
  {
    id: "item:rebreather",
    kind: "equipment",
    category: "field-upgrade",
    name: {
      en: "Rebreather",
      zhCN: "氧气罐",
      zhCNOrigin: "community",
    },
    sourceIds: ["source:hub-printer-catalog", "source:hub-printer-catalog-zh"],
  },
  {
    id: "item:revive-pistol",
    kind: "equipment",
    category: "field-upgrade",
    name: {
      en: "Revive Pistol",
      zhCN: "复苏手枪",
      zhCNOrigin: "official",
    },
    sourceIds: [
      "source:hub-printer-catalog",
      "source:hub-printer-catalog-zh",
      "source:official-progression-zh",
    ],
  },
  {
    id: "item:riot-shield",
    kind: "equipment",
    category: "field-upgrade",
    name: {
      en: "Riot Shield",
      zhCN: "防暴盾牌",
      zhCNOrigin: "official",
      aliases: ["防暴盾"],
    },
    sourceIds: [
      "source:hub-printer-catalog",
      "source:hub-printer-catalog-zh",
      "source:official-progression-zh",
    ],
  },
  {
    id: "item:sam-airburst-turret",
    kind: "equipment",
    category: "field-upgrade",
    name: {
      en: "SAM Airburst Turret",
      zhCN: "防空导弹",
      zhCNOrigin: "official",
    },
    sourceIds: [
      "source:hub-printer-catalog",
      "source:hub-printer-catalog-zh",
      "source:official-progression-zh",
    ],
  },
  {
    id: "item:seeker-drone",
    kind: "equipment",
    category: "field-upgrade",
    name: {
      en: "Seeker Drone",
      zhCN: "追踪无人机",
      zhCNOrigin: "official",
    },
    sourceIds: [
      "source:hub-printer-catalog",
      "source:hub-printer-catalog-zh",
      "source:official-progression-zh",
    ],
  },
  {
    id: "item:smoke-wall",
    kind: "equipment",
    category: "field-upgrade",
    name: {
      en: "Smoke Wall",
      zhCN: "烟幕",
      zhCNOrigin: "official",
    },
    sourceIds: [
      "source:hub-printer-catalog",
      "source:hub-printer-catalog-zh",
      "source:official-progression-zh",
    ],
  },
  {
    id: "item:trophy-system",
    kind: "equipment",
    category: "field-upgrade",
    name: {
      en: "Trophy System",
      zhCN: "主动防御系统",
      zhCNOrigin: "official",
      aliases: ["主防装置"],
    },
    sourceIds: [
      "source:hub-printer-catalog",
      "source:hub-printer-catalog-zh",
      "source:official-progression-zh",
    ],
  },
  {
    id: "item:advanced-uav",
    kind: "equipment",
    category: "fire-support",
    name: {
      en: "Advanced UAV",
      zhCN: "尖端无人机",
      zhCNOrigin: "official",
      aliases: ["尖端侦察机"],
    },
    sourceIds: [
      "source:hub-printer-catalog",
      "source:hub-printer-catalog-zh",
      "source:official-progression-zh",
    ],
  },
  {
    id: "item:artillery-beacon",
    kind: "equipment",
    category: "fire-support",
    name: {
      en: "Artillery Beacon",
      zhCN: "炮击信标",
      zhCNOrigin: "community",
    },
    sourceIds: ["source:hub-printer-catalog", "source:hub-printer-catalog-zh"],
  },
  {
    id: "item:bomb-glider",
    kind: "equipment",
    category: "fire-support",
    name: {
      en: "Bomb Glider",
      zhCN: "炸弹小飞机",
      zhCNOrigin: "official",
    },
    sourceIds: [
      "source:hub-printer-catalog",
      "source:hub-printer-catalog-zh",
      "source:official-progression-zh",
    ],
  },
  {
    id: "item:bombing-run",
    kind: "equipment",
    category: "fire-support",
    name: {
      en: "Bombing Run",
      zhCN: "战术轰炸",
      zhCNOrigin: "community",
    },
    sourceIds: ["source:hub-printer-catalog", "source:hub-printer-catalog-zh"],
  },
  {
    id: "item:care-package",
    kind: "equipment",
    category: "fire-support",
    name: {
      en: "Care Package",
      zhCN: "空投补给",
      zhCNOrigin: "official",
    },
    sourceIds: [
      "source:hub-printer-catalog",
      "source:hub-printer-catalog-zh",
      "source:official-progression-zh",
    ],
  },
  {
    id: "item:combat-drone",
    kind: "equipment",
    category: "fire-support",
    name: {
      en: "Combat Drone",
      zhCN: "战斗无人机",
      zhCNOrigin: "official",
    },
    sourceIds: [
      "source:hub-printer-catalog",
      "source:hub-printer-catalog-zh",
      "source:official-progression-zh",
    ],
  },
  {
    id: "item:crossfire",
    kind: "equipment",
    category: "fire-support",
    name: {
      en: "Crossfire",
      zhCN: "交叉空袭",
      zhCNOrigin: "official",
    },
    sourceIds: [
      "source:hub-printer-catalog",
      "source:hub-printer-catalog-zh",
      "source:official-progression-zh",
    ],
  },
  {
    id: "item:impact-warhead",
    kind: "equipment",
    category: "fire-support",
    name: {
      en: "Impact Warhead",
      zhCN: "钻地弹",
      zhCNOrigin: "official",
    },
    sourceIds: [
      "source:hub-printer-catalog",
      "source:hub-printer-catalog-zh",
      "source:official-progression-zh",
    ],
  },
  {
    id: "item:railgun-sentry",
    kind: "equipment",
    category: "fire-support",
    name: {
      en: "Railgun Sentry",
      zhCN: "电磁炮",
      zhCNOrigin: "official",
    },
    sourceIds: [
      "source:hub-printer-catalog",
      "source:hub-printer-catalog-zh",
      "source:official-progression-zh",
    ],
  },
  {
    id: "item:uav",
    kind: "equipment",
    category: "fire-support",
    name: {
      en: "UAV",
      zhCN: "无人侦察机",
      zhCNOrigin: "official",
    },
    sourceIds: [
      "source:hub-printer-catalog",
      "source:hub-printer-catalog-zh",
      "source:official-progression-zh",
    ],
  },
  {
    id: "item:disposable-parachute",
    kind: "equipment",
    category: "gear",
    name: {
      en: "Disposable Parachute",
      zhCN: "一次性降落伞",
      zhCNOrigin: "official",
    },
    sourceIds: [
      "source:hub-printer-catalog",
      "source:hub-printer-catalog-zh",
      "source:official-progression-zh",
    ],
  },
  {
    id: "item:durable-gas-mask",
    kind: "equipment",
    category: "gear",
    name: {
      en: "Durable Gas Mask",
      zhCN: "耐用防毒面具",
      zhCNOrigin: "official",
    },
    sourceIds: [
      "source:hub-printer-catalog",
      "source:hub-printer-catalog-zh",
      "source:official-progression-zh",
    ],
  },
  {
    id: "item:elite-night-vision-goggles",
    kind: "equipment",
    category: "gear",
    name: {
      en: "Elite Night Vision Goggles",
      zhCN: "精英夜视仪",
      zhCNOrigin: "community",
    },
    sourceIds: ["source:hub-printer-catalog", "source:hub-printer-catalog-zh"],
  },
  {
    id: "item:gas-mask",
    kind: "equipment",
    category: "gear",
    name: {
      en: "Gas Mask",
      zhCN: "防毒面具",
      zhCNOrigin: "official",
    },
    sourceIds: [
      "source:hub-printer-catalog",
      "source:hub-printer-catalog-zh",
      "source:official-progression-zh",
    ],
  },
  {
    id: "item:night-vision-goggles",
    kind: "equipment",
    category: "gear",
    name: {
      en: "Night Vision Goggles",
      zhCN: "夜视仪",
      zhCNOrigin: "community",
    },
    sourceIds: ["source:hub-printer-catalog", "source:hub-printer-catalog-zh"],
  },
  {
    id: "item:parachute",
    kind: "equipment",
    category: "gear",
    name: {
      en: "Parachute",
      zhCN: "降落伞",
      zhCNOrigin: "official",
    },
    sourceIds: [
      "source:hub-printer-catalog",
      "source:hub-printer-catalog-zh",
      "source:official-progression-zh",
    ],
  },
  {
    id: "item:weak-night-vision-goggles",
    kind: "equipment",
    category: "gear",
    name: {
      en: "Weak Night Vision Goggles",
      zhCN: "劣质夜视仪",
      zhCNOrigin: "community",
    },
    sourceIds: ["source:hub-printer-catalog", "source:hub-printer-catalog-zh"],
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

export const items: readonly Item[] = definitions.map((item): Item => {
  const rarity = itemRarities[item.id];
  return rarity ? { ...item, rarity } : item;
});
