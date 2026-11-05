import type { Recipe } from "../types/recipe";

export const recipes = [
  {
    id: "recipe:bandage",
    output: {
      itemId: "item:bandage",
      quantity: { status: "unknown", note: "来源未明确每次打印的产量。" },
    },
    cost: {
      status: "reported",
      value: {
        items: [
          { itemId: "item:synthetics", quantity: 15 },
          { itemId: "item:chemicals", quantity: 15 },
        ],
        cash: null,
      },
      sourceIds: ["source:official-fob", "source:codmunity-crafting"],
    },
    unlock: {
      status: "reported",
      value: { kind: "dmz-level", level: 2 },
      sourceIds: ["source:official-fob", "source:official-progression"],
    },
    requires: {
      status: "reported",
      value: ["3d-printer"],
      sourceIds: ["source:official-fob"],
    },
  },
  {
    id: "recipe:medkit",
    output: {
      itemId: "item:medkit",
      quantity: { status: "unknown", note: "来源未明确每次打印的产量。" },
    },
    cost: {
      status: "reported",
      value: {
        items: [
          { itemId: "item:chemicals", quantity: 30 },
          { itemId: "item:binding-catalyst", quantity: 1 },
          { itemId: "item:biomaterials", quantity: 5 },
        ],
        cash: null,
      },
      sourceIds: ["source:official-fob", "source:codmunity-crafting"],
    },
    unlock: {
      status: "reported",
      value: { kind: "dmz-level", level: 2 },
      sourceIds: ["source:official-fob", "source:official-progression"],
    },
    requires: {
      status: "reported",
      value: ["3d-printer"],
      sourceIds: ["source:official-fob"],
    },
  },
  {
    id: "recipe:medium-backpack",
    output: {
      itemId: "item:medium-backpack",
      quantity: { status: "unknown", note: "来源未明确每次打印的产量。" },
    },
    cost: {
      status: "reported",
      value: {
        items: [
          { itemId: "item:synthetics", quantity: 50 },
          { itemId: "item:rigid-synthetics", quantity: 5 },
        ],
        cash: null,
      },
      sourceIds: ["source:official-fob", "source:codmunity-crafting"],
    },
    unlock: {
      status: "reported",
      value: { kind: "dmz-level", level: 2 },
      sourceIds: ["source:official-fob", "source:official-progression"],
    },
    requires: {
      status: "reported",
      value: ["3d-printer"],
      sourceIds: ["source:official-fob"],
    },
  },
  {
    id: "recipe:sedative-inhaler",
    output: {
      itemId: "item:sedative-inhaler",
      quantity: { status: "unknown", note: "来源未明确每次打印的产量。" },
    },
    cost: {
      status: "reported",
      value: {
        items: [
          { itemId: "item:synthetics", quantity: 15 },
          { itemId: "item:chemicals", quantity: 15 },
        ],
        cash: null,
      },
      sourceIds: ["source:hub-sedative-inhaler", "source:codmunity-crafting"],
    },
    unlock: {
      status: "reported",
      value: { kind: "dmz-level", level: 3 },
      sourceIds: ["source:official-progression"],
    },
    requires: {
      status: "reported",
      value: ["3d-printer"],
      sourceIds: ["source:official-progression"],
    },
  },
  {
    id: "recipe:recon-drone",
    output: {
      itemId: "item:recon-drone",
      quantity: { status: "unknown", note: "来源未明确每次打印的产量。" },
    },
    cost: {
      status: "reported",
      value: {
        items: [
          { itemId: "item:metals", quantity: 30 },
          { itemId: "item:electronic-sensors", quantity: 3 },
        ],
        cash: null,
      },
      sourceIds: ["source:hub-recon-drone", "source:dmztracker-printer"],
    },
    unlock: {
      status: "reported",
      value: { kind: "mission", missionName: "Counterfeit (DMZ Orders)" },
      sourceIds: ["source:dmztracker-printer"],
      note: "任务奖励配方的记载来自社区表，未在本轮实测。",
    },
    requires: {
      status: "reported",
      value: ["3d-printer", "field-upgrade-printing"],
      sourceIds: ["source:official-progression", "source:hub-recon-drone"],
      note: "官方等级表列出战场升级打印类别于 DMZ 12 级开放；配方解锁另行记录。",
    },
  },
  {
    id: "recipe:small-secure-backpack",
    output: {
      itemId: "item:small-secure-backpack",
      quantity: { status: "unknown", note: "来源未明确每次打印的产量。" },
    },
    cost: {
      status: "reported",
      value: {
        items: [
          { itemId: "item:metals", quantity: 50 },
          { itemId: "item:rigid-synthetics", quantity: 10 },
          { itemId: "item:structural-alloy", quantity: 3 },
        ],
        cash: null,
      },
      sourceIds: ["source:hub-small-secure-backpack", "source:codmunity-crafting"],
    },
    unlock: {
      status: "reported",
      value: { kind: "extract-recipe" },
      sourceIds: ["source:dmztracker-printer", "source:official-fob"],
      note: "社区表记载搜刮配方；撤离要求采用官方配方通则。",
    },
    requires: {
      status: "reported",
      value: ["3d-printer"],
      sourceIds: ["source:official-fob"],
    },
  },
  {
    id: "recipe:biomaterials",
    output: {
      itemId: "item:biomaterials",
      quantity: {
        status: "unknown",
        note: "DMZTracker 将每次产出 1 作为计算假设，本批不将其记录成已知游戏产量。",
      },
    },
    cost: {
      status: "reported",
      value: {
        items: [
          { itemId: "item:synthetics", quantity: 20 },
          { itemId: "item:chemicals", quantity: 20 },
        ],
        cash: null,
      },
      sourceIds: ["source:hub-biomaterials", "source:dmztracker-printer"],
    },
    unlock: {
      status: "reported",
      value: { kind: "capability", capabilityId: "uncommon-ingredient-printing" },
      sourceIds: ["source:dmztracker-printer"],
    },
    requires: {
      status: "reported",
      value: ["3d-printer", "uncommon-ingredient-printing"],
      sourceIds: ["source:official-fob", "source:dmztracker-printer"],
    },
  },
  {
    id: "recipe:rigid-synthetics",
    output: {
      itemId: "item:rigid-synthetics",
      quantity: {
        status: "unknown",
        note: "DMZTracker 将每次产出 1 作为计算假设，本批不将其记录成已知游戏产量。",
      },
    },
    cost: {
      status: "reported",
      value: {
        items: [
          { itemId: "item:synthetics", quantity: 20 },
          { itemId: "item:metals", quantity: 20 },
        ],
        cash: null,
      },
      sourceIds: ["source:hub-rigid-synthetics", "source:dmztracker-printer"],
    },
    unlock: {
      status: "reported",
      value: { kind: "capability", capabilityId: "uncommon-ingredient-printing" },
      sourceIds: ["source:dmztracker-printer"],
    },
    requires: {
      status: "reported",
      value: ["3d-printer", "uncommon-ingredient-printing"],
      sourceIds: ["source:official-fob", "source:dmztracker-printer"],
    },
  },
  {
    id: "recipe:ballistic-fabric",
    output: {
      itemId: "item:ballistic-fabric",
      quantity: {
        status: "unknown",
        note: "DMZTracker 将每次产出 1 作为计算假设，本批不将其记录成已知游戏产量。",
      },
    },
    cost: {
      status: "reported",
      value: {
        items: [
          { itemId: "item:synthetics", quantity: 100 },
          { itemId: "item:high-tenacity-fibers", quantity: 3 },
        ],
        cash: null,
      },
      sourceIds: ["source:hub-ballistic-fabric", "source:dmztracker-printer"],
    },
    unlock: {
      status: "reported",
      value: { kind: "capability", capabilityId: "epic-ingredient-printing" },
      sourceIds: ["source:dmztracker-printer"],
    },
    requires: {
      status: "reported",
      value: ["3d-printer", "epic-ingredient-printing"],
      sourceIds: ["source:official-fob", "source:dmztracker-printer"],
    },
  },
  {
    id: "recipe:radiation-blockers",
    output: {
      itemId: "item:radiation-blockers",
      quantity: { status: "unknown", note: "来源未明确每次打印的产量。" },
    },
    cost: {
      status: "conflicting",
      claims: [
        {
          value: {
            items: [
              { itemId: "item:chemicals", quantity: 30 },
              { itemId: "item:biomaterials", quantity: 3 },
            ],
            cash: null,
          },
          sourceIds: ["source:dmztracker-printer"],
        },
        {
          value: {
            items: [
              { itemId: "item:electronics", quantity: 15 },
              { itemId: "item:chemicals", quantity: 15 },
            ],
            cash: null,
          },
          sourceIds: ["source:hub-radiation-blockers", "source:codmunity-crafting"],
        },
      ],
      note: "来源列出的材料成本不一致，尚未核对当前游戏卡片；不能默认选择其中一组进行计算。",
    },
    unlock: {
      status: "reported",
      value: { kind: "extract-recipe" },
      sourceIds: ["source:dmztracker-printer", "source:official-fob"],
    },
    requires: {
      status: "reported",
      value: ["3d-printer"],
      sourceIds: ["source:official-fob"],
    },
  },
] as const satisfies readonly Recipe[];
