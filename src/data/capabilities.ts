import type { Capability } from "../types/unlock";

export const capabilities = [
  {
    id: "3d-printer",
    name: "3D 打印机",
    unlock: {
      status: "reported",
      value: { kind: "dmz-level", level: 2 },
      sourceIds: ["source:official-fob", "source:official-progression"],
    },
  },
  {
    id: "field-upgrade-printing",
    name: "战场升级打印能力",
    unlock: {
      status: "reported",
      value: { kind: "dmz-level", level: 12 },
      sourceIds: ["source:official-progression"],
    },
  },
  {
    id: "uncommon-ingredient-printing",
    name: "精制材料打印能力",
    unlock: {
      status: "unknown",
      note: "资料确认需完成 Uncommon Ingredient Printing 升级；本批未核实升级费用、打印次数和全部前置，不自动判定获得能力。",
    },
  },
  {
    id: "epic-ingredient-printing",
    name: "史诗材料打印能力",
    unlock: {
      status: "unknown",
      note: "资料确认需完成 Epic Ingredient Printing 升级；本批未核实升级费用、打印次数和全部前置，不自动判定获得能力。",
    },
  },
  {
    id: "gunsmith",
    name: "军械改造",
    unlock: {
      status: "reported",
      value: { kind: "dmz-level", level: 10 },
      sourceIds: ["source:official-fob", "source:official-progression"],
    },
  },
] as const satisfies readonly Capability[];
