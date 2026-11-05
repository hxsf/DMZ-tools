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
  {
    id: "recipe:alloyed-plating",
    output: {
      itemId: "item:alloyed-plating",
      quantity: {
        status: "unknown",
        note: "来源未明确每次打印产量；网页数量按钮与可打印次数不作为产量证据。",
      },
    },
    cost: {
      status: "reported",
      value: {
        items: [
          {
            itemId: "item:metals",
            quantity: 100,
          },
          {
            itemId: "item:structural-alloy",
            quantity: 3,
          },
        ],
        cash: null,
      },
      sourceIds: ["source:hub-printer-catalog", "source:dmztracker-printer"],
    },
    unlock: {
      status: "reported",
      value: {
        kind: "capability",
        capabilityId: "epic-ingredient-printing",
      },
      sourceIds: ["source:dmztracker-printer"],
    },
    requires: {
      status: "reported",
      value: ["3d-printer", "epic-ingredient-printing"],
      sourceIds: ["source:hub-printer-catalog", "source:dmztracker-printer"],
    },
  },
  {
    id: "recipe:comms-module",
    output: {
      itemId: "item:comms-module",
      quantity: {
        status: "unknown",
        note: "来源未明确每次打印产量；网页数量按钮与可打印次数不作为产量证据。",
      },
    },
    cost: {
      status: "reported",
      value: {
        items: [
          {
            itemId: "item:electronics",
            quantity: 100,
          },
          {
            itemId: "item:cpu",
            quantity: 3,
          },
        ],
        cash: null,
      },
      sourceIds: ["source:hub-printer-catalog", "source:dmztracker-printer"],
    },
    unlock: {
      status: "reported",
      value: {
        kind: "capability",
        capabilityId: "epic-ingredient-printing",
      },
      sourceIds: ["source:dmztracker-printer"],
    },
    requires: {
      status: "reported",
      value: ["3d-printer", "epic-ingredient-printing"],
      sourceIds: ["source:hub-printer-catalog", "source:dmztracker-printer"],
    },
  },
  {
    id: "recipe:control-unit",
    output: {
      itemId: "item:control-unit",
      quantity: {
        status: "unknown",
        note: "来源未明确每次打印产量；网页数量按钮与可打印次数不作为产量证据。",
      },
    },
    cost: {
      status: "reported",
      value: {
        items: [
          {
            itemId: "item:electronics",
            quantity: 20,
          },
          {
            itemId: "item:metals",
            quantity: 20,
          },
        ],
        cash: null,
      },
      sourceIds: ["source:hub-printer-catalog", "source:dmztracker-printer"],
    },
    unlock: {
      status: "reported",
      value: {
        kind: "capability",
        capabilityId: "uncommon-ingredient-printing",
      },
      sourceIds: ["source:dmztracker-printer"],
    },
    requires: {
      status: "reported",
      value: ["3d-printer", "uncommon-ingredient-printing"],
      sourceIds: ["source:hub-printer-catalog", "source:dmztracker-printer"],
    },
  },
  {
    id: "recipe:detonators",
    output: {
      itemId: "item:detonators",
      quantity: {
        status: "unknown",
        note: "来源未明确每次打印产量；网页数量按钮与可打印次数不作为产量证据。",
      },
    },
    cost: {
      status: "conflicting",
      claims: [
        {
          value: {
            items: [
              {
                itemId: "item:electronics",
                quantity: 20,
              },
              {
                itemId: "item:metals",
                quantity: 20,
              },
            ],
            cash: null,
          },
          sourceIds: ["source:hub-printer-catalog"],
        },
        {
          value: {
            items: [
              {
                itemId: "item:electronics",
                quantity: 20,
              },
              {
                itemId: "item:chemicals",
                quantity: 20,
              },
            ],
            cash: null,
          },
          sourceIds: ["source:dmztracker-printer"],
        },
      ],
      note: "社区来源对直接材料用量记载不一致，暂不选择其中一版用于计算，待游戏内核对。",
    },
    unlock: {
      status: "reported",
      value: {
        kind: "capability",
        capabilityId: "uncommon-ingredient-printing",
      },
      sourceIds: ["source:dmztracker-printer"],
    },
    requires: {
      status: "reported",
      value: ["3d-printer", "uncommon-ingredient-printing"],
      sourceIds: ["source:hub-printer-catalog", "source:dmztracker-printer"],
    },
  },
  {
    id: "recipe:electronic-sensors",
    output: {
      itemId: "item:electronic-sensors",
      quantity: {
        status: "unknown",
        note: "来源未明确每次打印产量；网页数量按钮与可打印次数不作为产量证据。",
      },
    },
    cost: {
      status: "reported",
      value: {
        items: [
          {
            itemId: "item:synthetics",
            quantity: 20,
          },
          {
            itemId: "item:electronics",
            quantity: 20,
          },
        ],
        cash: null,
      },
      sourceIds: ["source:hub-printer-catalog", "source:dmztracker-printer"],
    },
    unlock: {
      status: "reported",
      value: {
        kind: "capability",
        capabilityId: "uncommon-ingredient-printing",
      },
      sourceIds: ["source:dmztracker-printer"],
    },
    requires: {
      status: "reported",
      value: ["3d-printer", "uncommon-ingredient-printing"],
      sourceIds: ["source:hub-printer-catalog", "source:dmztracker-printer"],
    },
  },
  {
    id: "recipe:nylon-laminate",
    output: {
      itemId: "item:nylon-laminate",
      quantity: {
        status: "unknown",
        note: "来源未明确每次打印产量；网页数量按钮与可打印次数不作为产量证据。",
      },
    },
    cost: {
      status: "reported",
      value: {
        items: [
          {
            itemId: "item:synthetics",
            quantity: 100,
          },
          {
            itemId: "item:nylon-cloth",
            quantity: 3,
          },
        ],
        cash: null,
      },
      sourceIds: ["source:hub-printer-catalog", "source:dmztracker-printer"],
    },
    unlock: {
      status: "reported",
      value: {
        kind: "capability",
        capabilityId: "epic-ingredient-printing",
      },
      sourceIds: ["source:dmztracker-printer"],
    },
    requires: {
      status: "reported",
      value: ["3d-printer", "epic-ingredient-printing"],
      sourceIds: ["source:hub-printer-catalog", "source:dmztracker-printer"],
    },
  },
  {
    id: "recipe:power-regulator",
    output: {
      itemId: "item:power-regulator",
      quantity: {
        status: "unknown",
        note: "来源未明确每次打印产量；网页数量按钮与可打印次数不作为产量证据。",
      },
    },
    cost: {
      status: "reported",
      value: {
        items: [
          {
            itemId: "item:electronics",
            quantity: 100,
          },
          {
            itemId: "item:printed-circuit-board",
            quantity: 3,
          },
        ],
        cash: null,
      },
      sourceIds: ["source:hub-printer-catalog", "source:dmztracker-printer"],
    },
    unlock: {
      status: "reported",
      value: {
        kind: "capability",
        capabilityId: "epic-ingredient-printing",
      },
      sourceIds: ["source:dmztracker-printer"],
    },
    requires: {
      status: "reported",
      value: ["3d-printer", "epic-ingredient-printing"],
      sourceIds: ["source:hub-printer-catalog", "source:dmztracker-printer"],
    },
  },
  {
    id: "recipe:reactive-metals",
    output: {
      itemId: "item:reactive-metals",
      quantity: {
        status: "unknown",
        note: "来源未明确每次打印产量；网页数量按钮与可打印次数不作为产量证据。",
      },
    },
    cost: {
      status: "reported",
      value: {
        items: [
          {
            itemId: "item:chemicals",
            quantity: 20,
          },
          {
            itemId: "item:metals",
            quantity: 20,
          },
        ],
        cash: null,
      },
      sourceIds: ["source:hub-printer-catalog", "source:dmztracker-printer"],
    },
    unlock: {
      status: "reported",
      value: {
        kind: "capability",
        capabilityId: "uncommon-ingredient-printing",
      },
      sourceIds: ["source:dmztracker-printer"],
    },
    requires: {
      status: "reported",
      value: ["3d-printer", "uncommon-ingredient-printing"],
      sourceIds: ["source:hub-printer-catalog", "source:dmztracker-printer"],
    },
  },
  {
    id: "recipe:stabilized-reagents",
    output: {
      itemId: "item:stabilized-reagents",
      quantity: {
        status: "unknown",
        note: "来源未明确每次打印产量；网页数量按钮与可打印次数不作为产量证据。",
      },
    },
    cost: {
      status: "reported",
      value: {
        items: [
          {
            itemId: "item:chemicals",
            quantity: 100,
          },
          {
            itemId: "item:binding-catalyst",
            quantity: 3,
          },
        ],
        cash: null,
      },
      sourceIds: ["source:hub-printer-catalog", "source:dmztracker-printer"],
    },
    unlock: {
      status: "reported",
      value: {
        kind: "capability",
        capabilityId: "epic-ingredient-printing",
      },
      sourceIds: ["source:dmztracker-printer"],
    },
    requires: {
      status: "reported",
      value: ["3d-printer", "epic-ingredient-printing"],
      sourceIds: ["source:hub-printer-catalog", "source:dmztracker-printer"],
    },
  },
  {
    id: "recipe:turned-components",
    output: {
      itemId: "item:turned-components",
      quantity: {
        status: "unknown",
        note: "来源未明确每次打印产量；网页数量按钮与可打印次数不作为产量证据。",
      },
    },
    cost: {
      status: "reported",
      value: {
        items: [
          {
            itemId: "item:metals",
            quantity: 100,
          },
          {
            itemId: "item:stock-rod",
            quantity: 3,
          },
        ],
        cash: null,
      },
      sourceIds: ["source:hub-printer-catalog", "source:dmztracker-printer"],
    },
    unlock: {
      status: "reported",
      value: {
        kind: "capability",
        capabilityId: "epic-ingredient-printing",
      },
      sourceIds: ["source:dmztracker-printer"],
    },
    requires: {
      status: "reported",
      value: ["3d-printer", "epic-ingredient-printing"],
      sourceIds: ["source:hub-printer-catalog", "source:dmztracker-printer"],
    },
  },
  {
    id: "recipe:volatile-explosives",
    output: {
      itemId: "item:volatile-explosives",
      quantity: {
        status: "unknown",
        note: "来源未明确每次打印产量；网页数量按钮与可打印次数不作为产量证据。",
      },
    },
    cost: {
      status: "reported",
      value: {
        items: [
          {
            itemId: "item:chemicals",
            quantity: 100,
          },
          {
            itemId: "item:nitro-compounds",
            quantity: 3,
          },
        ],
        cash: null,
      },
      sourceIds: ["source:hub-printer-catalog", "source:dmztracker-printer"],
    },
    unlock: {
      status: "reported",
      value: {
        kind: "capability",
        capabilityId: "epic-ingredient-printing",
      },
      sourceIds: ["source:dmztracker-printer"],
    },
    requires: {
      status: "reported",
      value: ["3d-printer", "epic-ingredient-printing"],
      sourceIds: ["source:hub-printer-catalog", "source:dmztracker-printer"],
    },
  },
  {
    id: "recipe:door-breacher-charge",
    output: {
      itemId: "item:door-breacher-charge",
      quantity: {
        status: "unknown",
        note: "来源未明确每次打印产量；网页数量按钮与可打印次数不作为产量证据。",
      },
    },
    cost: {
      status: "conflicting",
      claims: [
        {
          value: {
            items: [
              {
                itemId: "item:experimental-compounds",
                quantity: 1,
              },
              {
                itemId: "item:stock-rod",
                quantity: 5,
              },
              {
                itemId: "item:volatile-explosives",
                quantity: 3,
              },
            ],
            cash: null,
          },
          sourceIds: ["source:hub-printer-catalog", "source:dmztracker-printer"],
        },
        {
          value: {
            items: [
              {
                itemId: "item:stock-rod",
                quantity: 1,
              },
            ],
            cash: null,
          },
          sourceIds: ["source:codmunity-crafting"],
          note: "CODMunity 的 2026-10-26 页面仅列出这些材料，与本轮另两站记载不同；未当成其余材料不消耗的证据。",
        },
      ],
      note: "社区来源对直接材料用量记载不一致，暂不选择其中一版用于计算，待游戏内核对。",
    },
    unlock: {
      status: "reported",
      value: {
        kind: "extract-recipe",
      },
      sourceIds: ["source:dmztracker-printer", "source:official-fob"],
      note: "社区表记载搜刮配方；撤离要求采用官方配方通则。",
    },
    requires: {
      status: "reported",
      value: ["3d-printer"],
      sourceIds: ["source:hub-printer-catalog"],
    },
  },
  {
    id: "recipe:energy-drink",
    output: {
      itemId: "item:energy-drink",
      quantity: {
        status: "unknown",
        note: "来源未明确每次打印产量；网页数量按钮与可打印次数不作为产量证据。",
      },
    },
    cost: {
      status: "reported",
      value: {
        items: [
          {
            itemId: "item:chemicals",
            quantity: 10,
          },
          {
            itemId: "item:metals",
            quantity: 10,
          },
        ],
        cash: null,
      },
      sourceIds: [
        "source:hub-printer-catalog",
        "source:dmztracker-printer",
        "source:codmunity-crafting",
      ],
    },
    unlock: {
      status: "reported",
      value: {
        kind: "extract-recipe",
      },
      sourceIds: ["source:dmztracker-printer", "source:official-fob"],
      note: "社区表记载搜刮配方；撤离要求采用官方配方通则。",
    },
    requires: {
      status: "reported",
      value: ["3d-printer"],
      sourceIds: ["source:hub-printer-catalog"],
    },
  },
  {
    id: "recipe:pain-killers",
    output: {
      itemId: "item:pain-killers",
      quantity: {
        status: "unknown",
        note: "来源未明确每次打印产量；网页数量按钮与可打印次数不作为产量证据。",
      },
    },
    cost: {
      status: "reported",
      value: {
        items: [
          {
            itemId: "item:electronics",
            quantity: 15,
          },
          {
            itemId: "item:chemicals",
            quantity: 15,
          },
        ],
        cash: null,
      },
      sourceIds: [
        "source:hub-printer-catalog",
        "source:dmztracker-printer",
        "source:codmunity-crafting",
      ],
    },
    unlock: {
      status: "reported",
      value: {
        kind: "extract-recipe",
      },
      sourceIds: ["source:dmztracker-printer", "source:official-fob"],
      note: "社区表记载搜刮配方；撤离要求采用官方配方通则。",
    },
    requires: {
      status: "reported",
      value: ["3d-printer"],
      sourceIds: ["source:hub-printer-catalog"],
    },
  },
  {
    id: "recipe:self-revive-kit",
    output: {
      itemId: "item:self-revive-kit",
      quantity: {
        status: "unknown",
        note: "来源未明确每次打印产量；网页数量按钮与可打印次数不作为产量证据。",
      },
    },
    cost: {
      status: "conflicting",
      claims: [
        {
          value: {
            items: [
              {
                itemId: "item:stabilized-reagents",
                quantity: 1,
              },
              {
                itemId: "item:binding-catalyst",
                quantity: 3,
              },
              {
                itemId: "item:biomaterials",
                quantity: 5,
              },
            ],
            cash: null,
          },
          sourceIds: ["source:hub-printer-catalog", "source:dmztracker-printer"],
        },
        {
          value: {
            items: [
              {
                itemId: "item:biomaterials",
                quantity: 5,
              },
              {
                itemId: "item:binding-catalyst",
                quantity: 3,
              },
            ],
            cash: null,
          },
          sourceIds: ["source:codmunity-crafting"],
          note: "CODMunity 的 2026-10-26 页面仅列出这些材料，与本轮另两站记载不同；未当成其余材料不消耗的证据。",
        },
      ],
      note: "社区来源对直接材料用量记载不一致，暂不选择其中一版用于计算，待游戏内核对。",
    },
    unlock: {
      status: "reported",
      value: {
        kind: "dmz-level",
        level: 48,
      },
      sourceIds: ["source:dmztracker-printer"],
    },
    requires: {
      status: "reported",
      value: ["3d-printer"],
      sourceIds: ["source:hub-printer-catalog"],
    },
  },
  {
    id: "recipe:smelling-salts",
    output: {
      itemId: "item:smelling-salts",
      quantity: {
        status: "unknown",
        note: "来源未明确每次打印产量；网页数量按钮与可打印次数不作为产量证据。",
      },
    },
    cost: {
      status: "reported",
      value: {
        items: [
          {
            itemId: "item:chemicals",
            quantity: 30,
          },
          {
            itemId: "item:detonators",
            quantity: 3,
          },
        ],
        cash: null,
      },
      sourceIds: ["source:hub-printer-catalog", "source:dmztracker-printer"],
    },
    unlock: {
      status: "reported",
      value: {
        kind: "extract-recipe",
      },
      sourceIds: ["source:dmztracker-printer", "source:official-fob"],
      note: "社区表记载搜刮配方；撤离要求采用官方配方通则。",
    },
    requires: {
      status: "reported",
      value: ["3d-printer"],
      sourceIds: ["source:hub-printer-catalog"],
    },
  },
  {
    id: "recipe:1-plate-armor-vest",
    output: {
      itemId: "item:1-plate-armor-vest",
      quantity: {
        status: "unknown",
        note: "来源未明确每次打印产量；网页数量按钮与可打印次数不作为产量证据。",
      },
    },
    cost: {
      status: "reported",
      value: {
        items: [
          {
            itemId: "item:synthetics",
            quantity: 25,
          },
          {
            itemId: "item:metals",
            quantity: 25,
          },
        ],
        cash: null,
      },
      sourceIds: [
        "source:hub-printer-catalog",
        "source:dmztracker-printer",
        "source:codmunity-crafting",
      ],
    },
    unlock: {
      status: "reported",
      value: {
        kind: "dmz-level",
        level: 2,
      },
      sourceIds: ["source:official-progression"],
      note: "官方 DMZ 等级表将初始打印配方列在 2 级。",
    },
    requires: {
      status: "reported",
      value: ["3d-printer"],
      sourceIds: ["source:hub-printer-catalog"],
    },
  },
  {
    id: "recipe:2-plate-armor-vest",
    output: {
      itemId: "item:2-plate-armor-vest",
      quantity: {
        status: "unknown",
        note: "来源未明确每次打印产量；网页数量按钮与可打印次数不作为产量证据。",
      },
    },
    cost: {
      status: "reported",
      value: {
        items: [
          {
            itemId: "item:synthetics",
            quantity: 50,
          },
          {
            itemId: "item:reactive-metals",
            quantity: 5,
          },
        ],
        cash: null,
      },
      sourceIds: [
        "source:hub-printer-catalog",
        "source:dmztracker-printer",
        "source:codmunity-crafting",
      ],
    },
    unlock: {
      status: "reported",
      value: {
        kind: "dmz-level",
        level: 2,
      },
      sourceIds: ["source:official-progression"],
      note: "官方 DMZ 等级表将初始打印配方列在 2 级。",
    },
    requires: {
      status: "reported",
      value: ["3d-printer"],
      sourceIds: ["source:hub-printer-catalog"],
    },
  },
  {
    id: "recipe:2-plate-ballistic-gel-vest",
    output: {
      itemId: "item:2-plate-ballistic-gel-vest",
      quantity: {
        status: "unknown",
        note: "来源未明确每次打印产量；网页数量按钮与可打印次数不作为产量证据。",
      },
    },
    cost: {
      status: "reported",
      value: {
        items: [
          {
            itemId: "item:synthetics",
            quantity: 50,
          },
          {
            itemId: "item:binding-catalyst",
            quantity: 3,
          },
          {
            itemId: "item:reactive-metals",
            quantity: 10,
          },
        ],
        cash: null,
      },
      sourceIds: ["source:hub-printer-catalog", "source:dmztracker-printer"],
    },
    unlock: {
      status: "reported",
      value: {
        kind: "extract-recipe",
      },
      sourceIds: ["source:dmztracker-printer", "source:official-fob"],
      note: "社区表记载搜刮配方；撤离要求采用官方配方通则。",
    },
    requires: {
      status: "reported",
      value: ["3d-printer"],
      sourceIds: ["source:hub-printer-catalog"],
    },
  },
  {
    id: "recipe:2-plate-helmet-armor-vest",
    output: {
      itemId: "item:2-plate-helmet-armor-vest",
      quantity: {
        status: "unknown",
        note: "来源未明确每次打印产量；网页数量按钮与可打印次数不作为产量证据。",
      },
    },
    cost: {
      status: "reported",
      value: {
        items: [
          {
            itemId: "item:synthetics",
            quantity: 50,
          },
          {
            itemId: "item:structural-alloy",
            quantity: 3,
          },
          {
            itemId: "item:reactive-metals",
            quantity: 10,
          },
        ],
        cash: null,
      },
      sourceIds: ["source:hub-printer-catalog", "source:dmztracker-printer"],
    },
    unlock: {
      status: "reported",
      value: {
        kind: "extract-recipe",
      },
      sourceIds: ["source:dmztracker-printer", "source:official-fob"],
      note: "社区表记载搜刮配方；撤离要求采用官方配方通则。",
    },
    requires: {
      status: "reported",
      value: ["3d-printer"],
      sourceIds: ["source:hub-printer-catalog"],
    },
  },
  {
    id: "recipe:3-plate-armor-vest",
    output: {
      itemId: "item:3-plate-armor-vest",
      quantity: {
        status: "unknown",
        note: "来源未明确每次打印产量；网页数量按钮与可打印次数不作为产量证据。",
      },
    },
    cost: {
      status: "reported",
      value: {
        items: [
          {
            itemId: "item:ballistic-fabric",
            quantity: 2,
          },
          {
            itemId: "item:nylon-cloth",
            quantity: 5,
          },
          {
            itemId: "item:reactive-metals",
            quantity: 10,
          },
        ],
        cash: null,
      },
      sourceIds: ["source:hub-printer-catalog", "source:dmztracker-printer"],
    },
    unlock: {
      status: "unknown",
      note: "社区表仅记载为 DMZ 指令奖励，未列出具体任务；不影响手动标记解锁。",
    },
    requires: {
      status: "reported",
      value: ["3d-printer"],
      sourceIds: ["source:hub-printer-catalog"],
    },
  },
  {
    id: "recipe:3-plate-ballistic-gel-vest",
    output: {
      itemId: "item:3-plate-ballistic-gel-vest",
      quantity: {
        status: "unknown",
        note: "来源未明确每次打印产量；网页数量按钮与可打印次数不作为产量证据。",
      },
    },
    cost: {
      status: "reported",
      value: {
        items: [
          {
            itemId: "item:experimental-compounds",
            quantity: 2,
          },
          {
            itemId: "item:stabilized-reagents",
            quantity: 4,
          },
          {
            itemId: "item:biomaterials",
            quantity: 10,
          },
        ],
        cash: null,
      },
      sourceIds: ["source:hub-printer-catalog", "source:dmztracker-printer"],
    },
    unlock: {
      status: "reported",
      value: {
        kind: "extract-recipe",
      },
      sourceIds: ["source:dmztracker-printer", "source:official-fob"],
      note: "社区表记载搜刮配方；撤离要求采用官方配方通则。",
    },
    requires: {
      status: "reported",
      value: ["3d-printer"],
      sourceIds: ["source:hub-printer-catalog"],
    },
  },
  {
    id: "recipe:3-plate-helmet-armor-vest",
    output: {
      itemId: "item:3-plate-helmet-armor-vest",
      quantity: {
        status: "unknown",
        note: "来源未明确每次打印产量；网页数量按钮与可打印次数不作为产量证据。",
      },
    },
    cost: {
      status: "reported",
      value: {
        items: [
          {
            itemId: "item:nano-structured-alloy",
            quantity: 2,
          },
          {
            itemId: "item:alloyed-plating",
            quantity: 4,
          },
          {
            itemId: "item:reactive-metals",
            quantity: 10,
          },
        ],
        cash: null,
      },
      sourceIds: ["source:hub-printer-catalog", "source:dmztracker-printer"],
    },
    unlock: {
      status: "reported",
      value: {
        kind: "extract-recipe",
      },
      sourceIds: ["source:dmztracker-printer", "source:official-fob"],
      note: "社区表记载搜刮配方；撤离要求采用官方配方通则。",
    },
    requires: {
      status: "reported",
      value: ["3d-printer"],
      sourceIds: ["source:hub-printer-catalog"],
    },
  },
  {
    id: "recipe:tempered-armor-vest",
    output: {
      itemId: "item:tempered-armor-vest",
      quantity: {
        status: "unknown",
        note: "来源未明确每次打印产量；网页数量按钮与可打印次数不作为产量证据。",
      },
    },
    cost: {
      status: "reported",
      value: {
        items: [
          {
            itemId: "item:military-composites",
            quantity: 2,
          },
          {
            itemId: "item:ballistic-fabric",
            quantity: 4,
          },
          {
            itemId: "item:rigid-synthetics",
            quantity: 10,
          },
        ],
        cash: null,
      },
      sourceIds: [
        "source:hub-printer-catalog",
        "source:dmztracker-printer",
        "source:codmunity-crafting",
      ],
    },
    unlock: {
      status: "reported",
      value: {
        kind: "extract-recipe",
      },
      sourceIds: ["source:dmztracker-printer", "source:official-fob"],
      note: "社区表记载搜刮配方；撤离要求采用官方配方通则。",
    },
    requires: {
      status: "reported",
      value: ["3d-printer"],
      sourceIds: ["source:hub-printer-catalog"],
    },
  },
  {
    id: "recipe:large-backpack",
    output: {
      itemId: "item:large-backpack",
      quantity: {
        status: "unknown",
        note: "来源未明确每次打印产量；网页数量按钮与可打印次数不作为产量证据。",
      },
    },
    cost: {
      status: "reported",
      value: {
        items: [
          {
            itemId: "item:nylon-laminate",
            quantity: 2,
          },
          {
            itemId: "item:structural-alloy",
            quantity: 5,
          },
          {
            itemId: "item:rigid-synthetics",
            quantity: 10,
          },
        ],
        cash: null,
      },
      sourceIds: ["source:hub-printer-catalog", "source:dmztracker-printer"],
    },
    unlock: {
      status: "unknown",
      note: "社区表仅记载为 DMZ 指令奖励，未列出具体任务；不影响手动标记解锁。",
    },
    requires: {
      status: "reported",
      value: ["3d-printer"],
      sourceIds: ["source:hub-printer-catalog"],
    },
  },
  {
    id: "recipe:large-scavenger-backpack",
    output: {
      itemId: "item:large-scavenger-backpack",
      quantity: {
        status: "unknown",
        note: "来源未明确每次打印产量；网页数量按钮与可打印次数不作为产量证据。",
      },
    },
    cost: {
      status: "reported",
      value: {
        items: [
          {
            itemId: "item:nylon-laminate",
            quantity: 2,
          },
          {
            itemId: "item:high-tenacity-fibers",
            quantity: 5,
          },
          {
            itemId: "item:rigid-synthetics",
            quantity: 10,
          },
        ],
        cash: null,
      },
      sourceIds: ["source:hub-printer-catalog", "source:dmztracker-printer"],
    },
    unlock: {
      status: "reported",
      value: {
        kind: "extract-recipe",
      },
      sourceIds: ["source:dmztracker-printer", "source:official-fob"],
      note: "社区表记载搜刮配方；撤离要求采用官方配方通则。",
    },
    requires: {
      status: "reported",
      value: ["3d-printer"],
      sourceIds: ["source:hub-printer-catalog"],
    },
  },
  {
    id: "recipe:large-secure-backpack",
    output: {
      itemId: "item:large-secure-backpack",
      quantity: {
        status: "unknown",
        note: "来源未明确每次打印产量；网页数量按钮与可打印次数不作为产量证据。",
      },
    },
    cost: {
      status: "reported",
      value: {
        items: [
          {
            itemId: "item:prototype-rf-module",
            quantity: 2,
          },
          {
            itemId: "item:alloyed-plating",
            quantity: 4,
          },
          {
            itemId: "item:rigid-synthetics",
            quantity: 10,
          },
        ],
        cash: null,
      },
      sourceIds: ["source:hub-printer-catalog", "source:dmztracker-printer"],
    },
    unlock: {
      status: "reported",
      value: {
        kind: "extract-recipe",
      },
      sourceIds: ["source:dmztracker-printer", "source:official-fob"],
      note: "社区表记载搜刮配方；撤离要求采用官方配方通则。",
    },
    requires: {
      status: "reported",
      value: ["3d-printer"],
      sourceIds: ["source:hub-printer-catalog"],
    },
  },
  {
    id: "recipe:medium-scavenger-backpack",
    output: {
      itemId: "item:medium-scavenger-backpack",
      quantity: {
        status: "unknown",
        note: "来源未明确每次打印产量；网页数量按钮与可打印次数不作为产量证据。",
      },
    },
    cost: {
      status: "reported",
      value: {
        items: [
          {
            itemId: "item:metals",
            quantity: 50,
          },
          {
            itemId: "item:nylon-cloth",
            quantity: 3,
          },
          {
            itemId: "item:rigid-synthetics",
            quantity: 10,
          },
        ],
        cash: null,
      },
      sourceIds: ["source:hub-printer-catalog", "source:dmztracker-printer"],
    },
    unlock: {
      status: "reported",
      value: {
        kind: "extract-recipe",
      },
      sourceIds: ["source:dmztracker-printer", "source:official-fob"],
      note: "社区表记载搜刮配方；撤离要求采用官方配方通则。",
    },
    requires: {
      status: "reported",
      value: ["3d-printer"],
      sourceIds: ["source:hub-printer-catalog"],
    },
  },
  {
    id: "recipe:medium-secure-backpack",
    output: {
      itemId: "item:medium-secure-backpack",
      quantity: {
        status: "unknown",
        note: "来源未明确每次打印产量；网页数量按钮与可打印次数不作为产量证据。",
      },
    },
    cost: {
      status: "reported",
      value: {
        items: [
          {
            itemId: "item:alloyed-plating",
            quantity: 2,
          },
          {
            itemId: "item:nylon-cloth",
            quantity: 5,
          },
          {
            itemId: "item:reactive-metals",
            quantity: 10,
          },
        ],
        cash: null,
      },
      sourceIds: ["source:hub-printer-catalog", "source:dmztracker-printer"],
    },
    unlock: {
      status: "reported",
      value: {
        kind: "extract-recipe",
      },
      sourceIds: ["source:dmztracker-printer", "source:official-fob"],
      note: "社区表记载搜刮配方；撤离要求采用官方配方通则。",
    },
    requires: {
      status: "reported",
      value: ["3d-printer"],
      sourceIds: ["source:hub-printer-catalog"],
    },
  },
  {
    id: "recipe:medium-weapon-backpack",
    output: {
      itemId: "item:medium-weapon-backpack",
      quantity: {
        status: "unknown",
        note: "来源未明确每次打印产量；网页数量按钮与可打印次数不作为产量证据。",
      },
    },
    cost: {
      status: "reported",
      value: {
        items: [
          {
            itemId: "item:synthetics",
            quantity: 50,
          },
          {
            itemId: "item:high-tenacity-fibers",
            quantity: 3,
          },
          {
            itemId: "item:rigid-synthetics",
            quantity: 10,
          },
        ],
        cash: null,
      },
      sourceIds: ["source:hub-printer-catalog", "source:dmztracker-printer"],
    },
    unlock: {
      status: "reported",
      value: {
        kind: "extract-recipe",
      },
      sourceIds: ["source:dmztracker-printer", "source:official-fob"],
      note: "社区表记载搜刮配方；撤离要求采用官方配方通则。",
    },
    requires: {
      status: "reported",
      value: ["3d-printer"],
      sourceIds: ["source:hub-printer-catalog"],
    },
  },
  {
    id: "recipe:secure-scavenger-backpack",
    output: {
      itemId: "item:secure-scavenger-backpack",
      quantity: {
        status: "unknown",
        note: "来源未明确每次打印产量；网页数量按钮与可打印次数不作为产量证据。",
      },
    },
    cost: {
      status: "reported",
      value: {
        items: [
          {
            itemId: "item:military-composites",
            quantity: 2,
          },
          {
            itemId: "item:nylon-laminate",
            quantity: 4,
          },
          {
            itemId: "item:reactive-metals",
            quantity: 10,
          },
        ],
        cash: null,
      },
      sourceIds: [
        "source:hub-printer-catalog",
        "source:dmztracker-printer",
        "source:codmunity-crafting",
      ],
    },
    unlock: {
      status: "reported",
      value: {
        kind: "extract-recipe",
      },
      sourceIds: ["source:dmztracker-printer", "source:official-fob"],
      note: "社区表记载搜刮配方；撤离要求采用官方配方通则。",
    },
    requires: {
      status: "reported",
      value: ["3d-printer"],
      sourceIds: ["source:hub-printer-catalog"],
    },
  },
  {
    id: "recipe:small-backpack",
    output: {
      itemId: "item:small-backpack",
      quantity: {
        status: "unknown",
        note: "来源未明确每次打印产量；网页数量按钮与可打印次数不作为产量证据。",
      },
    },
    cost: {
      status: "reported",
      value: {
        items: [
          {
            itemId: "item:synthetics",
            quantity: 25,
          },
          {
            itemId: "item:metals",
            quantity: 25,
          },
        ],
        cash: null,
      },
      sourceIds: [
        "source:hub-printer-catalog",
        "source:dmztracker-printer",
        "source:codmunity-crafting",
      ],
    },
    unlock: {
      status: "reported",
      value: {
        kind: "dmz-level",
        level: 2,
      },
      sourceIds: ["source:official-progression"],
      note: "官方 DMZ 等级表将初始打印配方列在 2 级。",
    },
    requires: {
      status: "reported",
      value: ["3d-printer"],
      sourceIds: ["source:hub-printer-catalog"],
    },
  },
  {
    id: "recipe:stun-grenade",
    output: {
      itemId: "item:stun-grenade",
      quantity: {
        status: "unknown",
        note: "来源未明确每次打印产量；网页数量按钮与可打印次数不作为产量证据。",
      },
    },
    cost: {
      status: "reported",
      value: {
        items: [
          {
            itemId: "item:synthetics",
            quantity: 10,
          },
          {
            itemId: "item:chemicals",
            quantity: 10,
          },
        ],
        cash: null,
      },
      sourceIds: ["source:hub-printer-catalog", "source:dmztracker-printer"],
    },
    unlock: {
      status: "reported",
      value: {
        kind: "dmz-level",
        level: 4,
      },
      sourceIds: ["source:dmztracker-printer"],
    },
    requires: {
      status: "reported",
      value: ["3d-printer"],
      sourceIds: ["source:hub-printer-catalog"],
    },
  },
  {
    id: "recipe:decoy-grenade",
    output: {
      itemId: "item:decoy-grenade",
      quantity: {
        status: "unknown",
        note: "来源未明确每次打印产量；网页数量按钮与可打印次数不作为产量证据。",
      },
    },
    cost: {
      status: "reported",
      value: {
        items: [
          {
            itemId: "item:synthetics",
            quantity: 10,
          },
          {
            itemId: "item:chemicals",
            quantity: 10,
          },
        ],
        cash: null,
      },
      sourceIds: ["source:hub-printer-catalog", "source:dmztracker-printer"],
    },
    unlock: {
      status: "unknown",
      note: "社区表仅记载为 DMZ 指令奖励，未列出具体任务；不影响手动标记解锁。",
    },
    requires: {
      status: "reported",
      value: ["3d-printer"],
      sourceIds: ["source:hub-printer-catalog"],
    },
  },
  {
    id: "recipe:flash",
    output: {
      itemId: "item:flash",
      quantity: {
        status: "unknown",
        note: "来源未明确每次打印产量；网页数量按钮与可打印次数不作为产量证据。",
      },
    },
    cost: {
      status: "reported",
      value: {
        items: [
          {
            itemId: "item:synthetics",
            quantity: 10,
          },
          {
            itemId: "item:chemicals",
            quantity: 10,
          },
        ],
        cash: null,
      },
      sourceIds: ["source:hub-printer-catalog", "source:dmztracker-printer"],
    },
    unlock: {
      status: "unknown",
      note: "社区表仅记载为 DMZ 指令奖励，未列出具体任务；不影响手动标记解锁。",
    },
    requires: {
      status: "reported",
      value: ["3d-printer"],
      sourceIds: ["source:hub-printer-catalog"],
    },
  },
  {
    id: "recipe:heartbeat-sensor",
    output: {
      itemId: "item:heartbeat-sensor",
      quantity: {
        status: "unknown",
        note: "来源未明确每次打印产量；网页数量按钮与可打印次数不作为产量证据。",
      },
    },
    cost: {
      status: "reported",
      value: {
        items: [
          {
            itemId: "item:synthetics",
            quantity: 25,
          },
          {
            itemId: "item:chemicals",
            quantity: 25,
          },
        ],
        cash: null,
      },
      sourceIds: ["source:hub-printer-catalog", "source:dmztracker-printer"],
    },
    unlock: {
      status: "reported",
      value: {
        kind: "extract-recipe",
      },
      sourceIds: ["source:dmztracker-printer", "source:official-fob"],
      note: "社区表记载搜刮配方；撤离要求采用官方配方通则。",
    },
    requires: {
      status: "reported",
      value: ["3d-printer"],
      sourceIds: ["source:hub-printer-catalog"],
    },
  },
  {
    id: "recipe:screamer-mine",
    output: {
      itemId: "item:screamer-mine",
      quantity: {
        status: "unknown",
        note: "来源未明确每次打印产量；网页数量按钮与可打印次数不作为产量证据。",
      },
    },
    cost: {
      status: "reported",
      value: {
        items: [
          {
            itemId: "item:synthetics",
            quantity: 10,
          },
          {
            itemId: "item:chemicals",
            quantity: 10,
          },
        ],
        cash: null,
      },
      sourceIds: ["source:hub-printer-catalog", "source:dmztracker-printer"],
    },
    unlock: {
      status: "reported",
      value: {
        kind: "extract-recipe",
      },
      sourceIds: ["source:dmztracker-printer", "source:official-fob"],
      note: "社区表记载搜刮配方；撤离要求采用官方配方通则。",
    },
    requires: {
      status: "reported",
      value: ["3d-printer"],
      sourceIds: ["source:hub-printer-catalog"],
    },
  },
  {
    id: "recipe:shock-stick",
    output: {
      itemId: "item:shock-stick",
      quantity: {
        status: "unknown",
        note: "来源未明确每次打印产量；网页数量按钮与可打印次数不作为产量证据。",
      },
    },
    cost: {
      status: "reported",
      value: {
        items: [
          {
            itemId: "item:synthetics",
            quantity: 10,
          },
          {
            itemId: "item:chemicals",
            quantity: 10,
          },
        ],
        cash: null,
      },
      sourceIds: ["source:hub-printer-catalog", "source:dmztracker-printer"],
    },
    unlock: {
      status: "reported",
      value: {
        kind: "dmz-level",
        level: 17,
      },
      sourceIds: ["source:dmztracker-printer"],
    },
    requires: {
      status: "reported",
      value: ["3d-printer"],
      sourceIds: ["source:hub-printer-catalog"],
    },
  },
  {
    id: "recipe:smoke-grenade",
    output: {
      itemId: "item:smoke-grenade",
      quantity: {
        status: "unknown",
        note: "来源未明确每次打印产量；网页数量按钮与可打印次数不作为产量证据。",
      },
    },
    cost: {
      status: "reported",
      value: {
        items: [
          {
            itemId: "item:synthetics",
            quantity: 10,
          },
          {
            itemId: "item:chemicals",
            quantity: 10,
          },
        ],
        cash: null,
      },
      sourceIds: ["source:hub-printer-catalog", "source:dmztracker-printer"],
    },
    unlock: {
      status: "reported",
      value: {
        kind: "dmz-level",
        level: 4,
      },
      sourceIds: ["source:dmztracker-printer"],
    },
    requires: {
      status: "reported",
      value: ["3d-printer"],
      sourceIds: ["source:hub-printer-catalog"],
    },
  },
  {
    id: "recipe:snapshot-grenade",
    output: {
      itemId: "item:snapshot-grenade",
      quantity: {
        status: "unknown",
        note: "来源未明确每次打印产量；网页数量按钮与可打印次数不作为产量证据。",
      },
    },
    cost: {
      status: "reported",
      value: {
        items: [
          {
            itemId: "item:synthetics",
            quantity: 10,
          },
          {
            itemId: "item:chemicals",
            quantity: 10,
          },
        ],
        cash: null,
      },
      sourceIds: ["source:hub-printer-catalog", "source:dmztracker-printer"],
    },
    unlock: {
      status: "reported",
      value: {
        kind: "dmz-level",
        level: 9,
      },
      sourceIds: ["source:dmztracker-printer"],
    },
    requires: {
      status: "reported",
      value: ["3d-printer"],
      sourceIds: ["source:hub-printer-catalog"],
    },
  },
  {
    id: "recipe:spotter-scope",
    output: {
      itemId: "item:spotter-scope",
      quantity: {
        status: "unknown",
        note: "来源未明确每次打印产量；网页数量按钮与可打印次数不作为产量证据。",
      },
    },
    cost: {
      status: "reported",
      value: {
        items: [
          {
            itemId: "item:synthetics",
            quantity: 50,
          },
          {
            itemId: "item:electronic-sensors",
            quantity: 5,
          },
        ],
        cash: null,
      },
      sourceIds: ["source:hub-printer-catalog", "source:dmztracker-printer"],
    },
    unlock: {
      status: "reported",
      value: {
        kind: "dmz-level",
        level: 12,
      },
      sourceIds: ["source:dmztracker-printer"],
    },
    requires: {
      status: "reported",
      value: ["3d-printer"],
      sourceIds: ["source:hub-printer-catalog"],
    },
  },
  {
    id: "recipe:stim",
    output: {
      itemId: "item:stim",
      quantity: {
        status: "unknown",
        note: "来源未明确每次打印产量；网页数量按钮与可打印次数不作为产量证据。",
      },
    },
    cost: {
      status: "reported",
      value: {
        items: [
          {
            itemId: "item:synthetics",
            quantity: 15,
          },
          {
            itemId: "item:chemicals",
            quantity: 15,
          },
        ],
        cash: null,
      },
      sourceIds: ["source:hub-printer-catalog", "source:dmztracker-printer"],
    },
    unlock: {
      status: "reported",
      value: {
        kind: "extract-recipe",
      },
      sourceIds: ["source:dmztracker-printer", "source:official-fob"],
      note: "社区表记载搜刮配方；撤离要求采用官方配方通则。",
    },
    requires: {
      status: "reported",
      value: ["3d-printer"],
      sourceIds: ["source:hub-printer-catalog"],
    },
  },
  {
    id: "recipe:c4",
    output: {
      itemId: "item:c4",
      quantity: {
        status: "unknown",
        note: "来源未明确每次打印产量；网页数量按钮与可打印次数不作为产量证据。",
      },
    },
    cost: {
      status: "reported",
      value: {
        items: [
          {
            itemId: "item:chemicals",
            quantity: 10,
          },
          {
            itemId: "item:metals",
            quantity: 10,
          },
        ],
        cash: null,
      },
      sourceIds: ["source:hub-printer-catalog", "source:dmztracker-printer"],
    },
    unlock: {
      status: "unknown",
      note: "社区表仅记载为 DMZ 指令奖励，未列出具体任务；不影响手动标记解锁。",
    },
    requires: {
      status: "reported",
      value: ["3d-printer"],
      sourceIds: ["source:hub-printer-catalog"],
    },
  },
  {
    id: "recipe:claymore",
    output: {
      itemId: "item:claymore",
      quantity: {
        status: "unknown",
        note: "来源未明确每次打印产量；网页数量按钮与可打印次数不作为产量证据。",
      },
    },
    cost: {
      status: "reported",
      value: {
        items: [
          {
            itemId: "item:chemicals",
            quantity: 10,
          },
          {
            itemId: "item:metals",
            quantity: 10,
          },
        ],
        cash: null,
      },
      sourceIds: ["source:hub-printer-catalog", "source:dmztracker-printer"],
    },
    unlock: {
      status: "reported",
      value: {
        kind: "extract-recipe",
      },
      sourceIds: ["source:dmztracker-printer", "source:official-fob"],
      note: "社区表记载搜刮配方；撤离要求采用官方配方通则。",
    },
    requires: {
      status: "reported",
      value: ["3d-printer"],
      sourceIds: ["source:hub-printer-catalog"],
    },
  },
  {
    id: "recipe:drill-charge",
    output: {
      itemId: "item:drill-charge",
      quantity: {
        status: "unknown",
        note: "来源未明确每次打印产量；网页数量按钮与可打印次数不作为产量证据。",
      },
    },
    cost: {
      status: "reported",
      value: {
        items: [
          {
            itemId: "item:chemicals",
            quantity: 15,
          },
          {
            itemId: "item:metals",
            quantity: 15,
          },
        ],
        cash: null,
      },
      sourceIds: ["source:hub-printer-catalog", "source:dmztracker-printer"],
    },
    unlock: {
      status: "reported",
      value: {
        kind: "extract-recipe",
      },
      sourceIds: ["source:dmztracker-printer", "source:official-fob"],
      note: "社区表记载搜刮配方；撤离要求采用官方配方通则。",
    },
    requires: {
      status: "reported",
      value: ["3d-printer"],
      sourceIds: ["source:hub-printer-catalog"],
    },
  },
  {
    id: "recipe:frag-grenade",
    output: {
      itemId: "item:frag-grenade",
      quantity: {
        status: "unknown",
        note: "来源未明确每次打印产量；网页数量按钮与可打印次数不作为产量证据。",
      },
    },
    cost: {
      status: "reported",
      value: {
        items: [
          {
            itemId: "item:chemicals",
            quantity: 10,
          },
          {
            itemId: "item:metals",
            quantity: 10,
          },
        ],
        cash: null,
      },
      sourceIds: ["source:hub-printer-catalog", "source:dmztracker-printer"],
    },
    unlock: {
      status: "reported",
      value: {
        kind: "dmz-level",
        level: 7,
      },
      sourceIds: ["source:dmztracker-printer"],
    },
    requires: {
      status: "reported",
      value: ["3d-printer"],
      sourceIds: ["source:hub-printer-catalog"],
    },
  },
  {
    id: "recipe:molotov-cocktail",
    output: {
      itemId: "item:molotov-cocktail",
      quantity: {
        status: "unknown",
        note: "来源未明确每次打印产量；网页数量按钮与可打印次数不作为产量证据。",
      },
    },
    cost: {
      status: "reported",
      value: {
        items: [
          {
            itemId: "item:chemicals",
            quantity: 10,
          },
          {
            itemId: "item:metals",
            quantity: 10,
          },
        ],
        cash: null,
      },
      sourceIds: ["source:hub-printer-catalog", "source:dmztracker-printer"],
    },
    unlock: {
      status: "reported",
      value: {
        kind: "dmz-level",
        level: 36,
      },
      sourceIds: ["source:dmztracker-printer"],
    },
    requires: {
      status: "reported",
      value: ["3d-printer"],
      sourceIds: ["source:hub-printer-catalog"],
    },
  },
  {
    id: "recipe:proximity-mine",
    output: {
      itemId: "item:proximity-mine",
      quantity: {
        status: "unknown",
        note: "来源未明确每次打印产量；网页数量按钮与可打印次数不作为产量证据。",
      },
    },
    cost: {
      status: "reported",
      value: {
        items: [
          {
            itemId: "item:chemicals",
            quantity: 10,
          },
          {
            itemId: "item:metals",
            quantity: 10,
          },
        ],
        cash: null,
      },
      sourceIds: ["source:hub-printer-catalog", "source:dmztracker-printer"],
    },
    unlock: {
      status: "reported",
      value: {
        kind: "extract-recipe",
      },
      sourceIds: ["source:dmztracker-printer", "source:official-fob"],
      note: "社区表记载搜刮配方；撤离要求采用官方配方通则。",
    },
    requires: {
      status: "reported",
      value: ["3d-printer"],
      sourceIds: ["source:hub-printer-catalog"],
    },
  },
  {
    id: "recipe:semtex",
    output: {
      itemId: "item:semtex",
      quantity: {
        status: "unknown",
        note: "来源未明确每次打印产量；网页数量按钮与可打印次数不作为产量证据。",
      },
    },
    cost: {
      status: "reported",
      value: {
        items: [
          {
            itemId: "item:chemicals",
            quantity: 10,
          },
          {
            itemId: "item:metals",
            quantity: 10,
          },
        ],
        cash: null,
      },
      sourceIds: ["source:hub-printer-catalog", "source:dmztracker-printer"],
    },
    unlock: {
      status: "reported",
      value: {
        kind: "dmz-level",
        level: 23,
      },
      sourceIds: ["source:dmztracker-printer"],
    },
    requires: {
      status: "reported",
      value: ["3d-printer"],
      sourceIds: ["source:hub-printer-catalog"],
    },
  },
  {
    id: "recipe:thermite",
    output: {
      itemId: "item:thermite",
      quantity: {
        status: "unknown",
        note: "来源未明确每次打印产量；网页数量按钮与可打印次数不作为产量证据。",
      },
    },
    cost: {
      status: "reported",
      value: {
        items: [
          {
            itemId: "item:chemicals",
            quantity: 10,
          },
          {
            itemId: "item:metals",
            quantity: 10,
          },
        ],
        cash: null,
      },
      sourceIds: ["source:hub-printer-catalog", "source:dmztracker-printer"],
    },
    unlock: {
      status: "reported",
      value: {
        kind: "dmz-level",
        level: 41,
      },
      sourceIds: ["source:dmztracker-printer"],
    },
    requires: {
      status: "reported",
      value: ["3d-printer"],
      sourceIds: ["source:hub-printer-catalog"],
    },
  },
  {
    id: "recipe:throwing-knife",
    output: {
      itemId: "item:throwing-knife",
      quantity: {
        status: "unknown",
        note: "来源未明确每次打印产量；网页数量按钮与可打印次数不作为产量证据。",
      },
    },
    cost: {
      status: "reported",
      value: {
        items: [
          {
            itemId: "item:chemicals",
            quantity: 25,
          },
          {
            itemId: "item:metals",
            quantity: 25,
          },
        ],
        cash: null,
      },
      sourceIds: ["source:hub-printer-catalog", "source:dmztracker-printer"],
    },
    unlock: {
      status: "reported",
      value: {
        kind: "dmz-level",
        level: 7,
      },
      sourceIds: ["source:dmztracker-printer"],
    },
    requires: {
      status: "reported",
      value: ["3d-printer"],
      sourceIds: ["source:hub-printer-catalog"],
    },
  },
  {
    id: "recipe:trip-wire",
    output: {
      itemId: "item:trip-wire",
      quantity: {
        status: "unknown",
        note: "来源未明确每次打印产量；网页数量按钮与可打印次数不作为产量证据。",
      },
    },
    cost: {
      status: "reported",
      value: {
        items: [
          {
            itemId: "item:chemicals",
            quantity: 15,
          },
          {
            itemId: "item:metals",
            quantity: 15,
          },
        ],
        cash: null,
      },
      sourceIds: ["source:hub-printer-catalog", "source:dmztracker-printer"],
    },
    unlock: {
      status: "reported",
      value: {
        kind: "extract-recipe",
      },
      sourceIds: ["source:dmztracker-printer", "source:official-fob"],
      note: "社区表记载搜刮配方；撤离要求采用官方配方通则。",
    },
    requires: {
      status: "reported",
      value: ["3d-printer"],
      sourceIds: ["source:hub-printer-catalog"],
    },
  },
  {
    id: "recipe:zip-gun",
    output: {
      itemId: "item:zip-gun",
      quantity: {
        status: "unknown",
        note: "来源未明确每次打印产量；网页数量按钮与可打印次数不作为产量证据。",
      },
    },
    cost: {
      status: "reported",
      value: {
        items: [
          {
            itemId: "item:chemicals",
            quantity: 10,
          },
          {
            itemId: "item:metals",
            quantity: 10,
          },
        ],
        cash: null,
      },
      sourceIds: ["source:hub-printer-catalog", "source:dmztracker-printer"],
    },
    unlock: {
      status: "reported",
      value: {
        kind: "extract-recipe",
      },
      sourceIds: ["source:dmztracker-printer", "source:official-fob"],
      note: "社区表记载搜刮配方；撤离要求采用官方配方通则。",
    },
    requires: {
      status: "reported",
      value: ["3d-printer"],
      sourceIds: ["source:hub-printer-catalog"],
    },
  },
  {
    id: "recipe:ammo-box",
    output: {
      itemId: "item:ammo-box",
      quantity: {
        status: "unknown",
        note: "来源未明确每次打印产量；网页数量按钮与可打印次数不作为产量证据。",
      },
    },
    cost: {
      status: "reported",
      value: {
        items: [
          {
            itemId: "item:synthetics",
            quantity: 15,
          },
          {
            itemId: "item:metals",
            quantity: 15,
          },
        ],
        cash: null,
      },
      sourceIds: ["source:hub-printer-catalog", "source:dmztracker-printer"],
    },
    unlock: {
      status: "reported",
      value: {
        kind: "dmz-level",
        level: 12,
      },
      sourceIds: ["source:dmztracker-printer"],
    },
    requires: {
      status: "reported",
      value: ["3d-printer", "field-upgrade-printing"],
      sourceIds: ["source:hub-printer-catalog", "source:official-progression"],
    },
  },
  {
    id: "recipe:armor-box",
    output: {
      itemId: "item:armor-box",
      quantity: {
        status: "unknown",
        note: "来源未明确每次打印产量；网页数量按钮与可打印次数不作为产量证据。",
      },
    },
    cost: {
      status: "conflicting",
      claims: [
        {
          value: {
            items: [
              {
                itemId: "item:metals",
                quantity: 30,
              },
              {
                itemId: "item:reactive-metals",
                quantity: 3,
              },
            ],
            cash: null,
          },
          sourceIds: ["source:hub-printer-catalog", "source:dmztracker-printer"],
        },
        {
          value: {
            items: [
              {
                itemId: "item:reactive-metals",
                quantity: 1,
              },
            ],
            cash: null,
          },
          sourceIds: ["source:codmunity-crafting"],
          note: "CODMunity 的 2026-10-26 页面仅列出这些材料，与本轮另两站记载不同；未当成其余材料不消耗的证据。",
        },
      ],
      note: "社区来源对直接材料用量记载不一致，暂不选择其中一版用于计算，待游戏内核对。",
    },
    unlock: {
      status: "reported",
      value: {
        kind: "dmz-level",
        level: 14,
      },
      sourceIds: ["source:dmztracker-printer"],
    },
    requires: {
      status: "reported",
      value: ["3d-printer", "field-upgrade-printing"],
      sourceIds: ["source:hub-printer-catalog", "source:official-progression"],
    },
  },
  {
    id: "recipe:ddos",
    output: {
      itemId: "item:ddos",
      quantity: {
        status: "unknown",
        note: "来源未明确每次打印产量；网页数量按钮与可打印次数不作为产量证据。",
      },
    },
    cost: {
      status: "reported",
      value: {
        items: [
          {
            itemId: "item:electronics",
            quantity: 30,
          },
          {
            itemId: "item:detonators",
            quantity: 3,
          },
        ],
        cash: null,
      },
      sourceIds: ["source:hub-printer-catalog", "source:dmztracker-printer"],
    },
    unlock: {
      status: "reported",
      value: {
        kind: "mission",
        missionName: "Underground (DMZ Orders)",
      },
      sourceIds: ["source:dmztracker-printer"],
      note: "任务奖励配方的记载来自社区表，未在本轮实测。",
    },
    requires: {
      status: "reported",
      value: ["3d-printer", "field-upgrade-printing"],
      sourceIds: ["source:hub-printer-catalog", "source:official-progression"],
    },
  },
  {
    id: "recipe:defibrillator",
    output: {
      itemId: "item:defibrillator",
      quantity: {
        status: "unknown",
        note: "来源未明确每次打印产量；网页数量按钮与可打印次数不作为产量证据。",
      },
    },
    cost: {
      status: "reported",
      value: {
        items: [
          {
            itemId: "item:electronics",
            quantity: 30,
          },
          {
            itemId: "item:control-unit",
            quantity: 3,
          },
        ],
        cash: null,
      },
      sourceIds: ["source:hub-printer-catalog", "source:dmztracker-printer"],
    },
    unlock: {
      status: "reported",
      value: {
        kind: "mission",
        missionName: "Critical Extraction (Story Mission)",
      },
      sourceIds: ["source:dmztracker-printer"],
    },
    requires: {
      status: "reported",
      value: ["3d-printer", "field-upgrade-printing"],
      sourceIds: ["source:hub-printer-catalog", "source:official-progression"],
    },
  },
  {
    id: "recipe:fulton-drop-marker",
    output: {
      itemId: "item:fulton-drop-marker",
      quantity: {
        status: "unknown",
        note: "来源未明确每次打印产量；网页数量按钮与可打印次数不作为产量证据。",
      },
    },
    cost: {
      status: "reported",
      value: {
        items: [
          {
            itemId: "item:prototype-rf-module",
            quantity: 1,
          },
          {
            itemId: "item:comms-module",
            quantity: 3,
          },
          {
            itemId: "item:control-unit",
            quantity: 5,
          },
        ],
        cash: null,
      },
      sourceIds: ["source:hub-printer-catalog", "source:dmztracker-printer"],
    },
    unlock: {
      status: "reported",
      value: {
        kind: "extract-recipe",
      },
      sourceIds: ["source:dmztracker-printer", "source:official-fob"],
      note: "社区表记载搜刮配方；撤离要求采用官方配方通则。",
    },
    requires: {
      status: "reported",
      value: ["3d-printer", "field-upgrade-printing"],
      sourceIds: ["source:hub-printer-catalog", "source:official-progression"],
    },
  },
  {
    id: "recipe:inflatable-decoy",
    output: {
      itemId: "item:inflatable-decoy",
      quantity: {
        status: "unknown",
        note: "来源未明确每次打印产量；网页数量按钮与可打印次数不作为产量证据。",
      },
    },
    cost: {
      status: "reported",
      value: {
        items: [
          {
            itemId: "item:synthetics",
            quantity: 15,
          },
          {
            itemId: "item:electronics",
            quantity: 15,
          },
        ],
        cash: null,
      },
      sourceIds: ["source:hub-printer-catalog", "source:dmztracker-printer"],
    },
    unlock: {
      status: "reported",
      value: {
        kind: "dmz-level",
        level: 52,
      },
      sourceIds: ["source:dmztracker-printer"],
    },
    requires: {
      status: "reported",
      value: ["3d-printer", "field-upgrade-printing"],
      sourceIds: ["source:hub-printer-catalog", "source:official-progression"],
    },
  },
  {
    id: "recipe:portable-radar",
    output: {
      itemId: "item:portable-radar",
      quantity: {
        status: "unknown",
        note: "来源未明确每次打印产量；网页数量按钮与可打印次数不作为产量证据。",
      },
    },
    cost: {
      status: "reported",
      value: {
        items: [
          {
            itemId: "item:synthetics",
            quantity: 15,
          },
          {
            itemId: "item:electronics",
            quantity: 15,
          },
        ],
        cash: null,
      },
      sourceIds: ["source:hub-printer-catalog", "source:dmztracker-printer"],
    },
    unlock: {
      status: "reported",
      value: {
        kind: "extract-recipe",
      },
      sourceIds: ["source:dmztracker-printer", "source:official-fob"],
      note: "社区表记载搜刮配方；撤离要求采用官方配方通则。",
    },
    requires: {
      status: "reported",
      value: ["3d-printer", "field-upgrade-printing"],
      sourceIds: ["source:hub-printer-catalog", "source:official-progression"],
    },
  },
  {
    id: "recipe:razor-wire-trap",
    output: {
      itemId: "item:razor-wire-trap",
      quantity: {
        status: "unknown",
        note: "来源未明确每次打印产量；网页数量按钮与可打印次数不作为产量证据。",
      },
    },
    cost: {
      status: "reported",
      value: {
        items: [
          {
            itemId: "item:electronics",
            quantity: 15,
          },
          {
            itemId: "item:metals",
            quantity: 15,
          },
        ],
        cash: null,
      },
      sourceIds: ["source:hub-printer-catalog", "source:dmztracker-printer"],
    },
    unlock: {
      status: "reported",
      value: {
        kind: "extract-recipe",
      },
      sourceIds: ["source:dmztracker-printer", "source:official-fob"],
      note: "社区表记载搜刮配方；撤离要求采用官方配方通则。",
    },
    requires: {
      status: "reported",
      value: ["3d-printer", "field-upgrade-printing"],
      sourceIds: ["source:hub-printer-catalog", "source:official-progression"],
    },
  },
  {
    id: "recipe:rebreather",
    output: {
      itemId: "item:rebreather",
      quantity: {
        status: "unknown",
        note: "来源未明确每次打印产量；网页数量按钮与可打印次数不作为产量证据。",
      },
    },
    cost: {
      status: "reported",
      value: {
        items: [
          {
            itemId: "item:synthetics",
            quantity: 15,
          },
          {
            itemId: "item:chemicals",
            quantity: 15,
          },
        ],
        cash: null,
      },
      sourceIds: ["source:hub-printer-catalog", "source:dmztracker-printer"],
    },
    unlock: {
      status: "reported",
      value: {
        kind: "extract-recipe",
      },
      sourceIds: ["source:dmztracker-printer", "source:official-fob"],
      note: "社区表记载搜刮配方；撤离要求采用官方配方通则。",
    },
    requires: {
      status: "reported",
      value: ["3d-printer", "field-upgrade-printing"],
      sourceIds: ["source:hub-printer-catalog", "source:official-progression"],
    },
  },
  {
    id: "recipe:revive-pistol",
    output: {
      itemId: "item:revive-pistol",
      quantity: {
        status: "unknown",
        note: "来源未明确每次打印产量；网页数量按钮与可打印次数不作为产量证据。",
      },
    },
    cost: {
      status: "reported",
      value: {
        items: [
          {
            itemId: "item:power-regulator",
            quantity: 2,
          },
          {
            itemId: "item:binding-catalyst",
            quantity: 3,
          },
          {
            itemId: "item:detonators",
            quantity: 5,
          },
        ],
        cash: null,
      },
      sourceIds: [
        "source:hub-printer-catalog",
        "source:dmztracker-printer",
        "source:codmunity-crafting",
      ],
    },
    unlock: {
      status: "reported",
      value: {
        kind: "dmz-level",
        level: 25,
      },
      sourceIds: ["source:dmztracker-printer"],
    },
    requires: {
      status: "reported",
      value: ["3d-printer", "field-upgrade-printing"],
      sourceIds: ["source:hub-printer-catalog", "source:official-progression"],
    },
  },
  {
    id: "recipe:riot-shield",
    output: {
      itemId: "item:riot-shield",
      quantity: {
        status: "unknown",
        note: "来源未明确每次打印产量；网页数量按钮与可打印次数不作为产量证据。",
      },
    },
    cost: {
      status: "reported",
      value: {
        items: [
          {
            itemId: "item:synthetics",
            quantity: 15,
          },
          {
            itemId: "item:metals",
            quantity: 15,
          },
        ],
        cash: null,
      },
      sourceIds: ["source:hub-printer-catalog", "source:dmztracker-printer"],
    },
    unlock: {
      status: "reported",
      value: {
        kind: "extract-recipe",
      },
      sourceIds: ["source:dmztracker-printer", "source:official-fob"],
      note: "社区表记载搜刮配方；撤离要求采用官方配方通则。",
    },
    requires: {
      status: "reported",
      value: ["3d-printer", "field-upgrade-printing"],
      sourceIds: ["source:hub-printer-catalog", "source:official-progression"],
    },
  },
  {
    id: "recipe:sam-airburst-turret",
    output: {
      itemId: "item:sam-airburst-turret",
      quantity: {
        status: "unknown",
        note: "来源未明确每次打印产量；网页数量按钮与可打印次数不作为产量证据。",
      },
    },
    cost: {
      status: "reported",
      value: {
        items: [
          {
            itemId: "item:metals",
            quantity: 30,
          },
          {
            itemId: "item:detonators",
            quantity: 3,
          },
        ],
        cash: null,
      },
      sourceIds: ["source:hub-printer-catalog", "source:dmztracker-printer"],
    },
    unlock: {
      status: "reported",
      value: {
        kind: "extract-recipe",
      },
      sourceIds: ["source:dmztracker-printer", "source:official-fob"],
      note: "社区表记载搜刮配方；撤离要求采用官方配方通则。",
    },
    requires: {
      status: "reported",
      value: ["3d-printer", "field-upgrade-printing"],
      sourceIds: ["source:hub-printer-catalog", "source:official-progression"],
    },
  },
  {
    id: "recipe:seeker-drone",
    output: {
      itemId: "item:seeker-drone",
      quantity: {
        status: "unknown",
        note: "来源未明确每次打印产量；网页数量按钮与可打印次数不作为产量证据。",
      },
    },
    cost: {
      status: "reported",
      value: {
        items: [
          {
            itemId: "item:synthetics",
            quantity: 15,
          },
          {
            itemId: "item:electronics",
            quantity: 15,
          },
        ],
        cash: null,
      },
      sourceIds: ["source:hub-printer-catalog", "source:dmztracker-printer"],
    },
    unlock: {
      status: "reported",
      value: {
        kind: "extract-recipe",
      },
      sourceIds: ["source:dmztracker-printer", "source:official-fob"],
      note: "社区表记载搜刮配方；撤离要求采用官方配方通则。",
    },
    requires: {
      status: "reported",
      value: ["3d-printer", "field-upgrade-printing"],
      sourceIds: ["source:hub-printer-catalog", "source:official-progression"],
    },
  },
  {
    id: "recipe:smoke-wall",
    output: {
      itemId: "item:smoke-wall",
      quantity: {
        status: "unknown",
        note: "来源未明确每次打印产量；网页数量按钮与可打印次数不作为产量证据。",
      },
    },
    cost: {
      status: "reported",
      value: {
        items: [
          {
            itemId: "item:electronics",
            quantity: 15,
          },
          {
            itemId: "item:chemicals",
            quantity: 15,
          },
        ],
        cash: null,
      },
      sourceIds: ["source:hub-printer-catalog", "source:dmztracker-printer"],
    },
    unlock: {
      status: "reported",
      value: {
        kind: "extract-recipe",
      },
      sourceIds: ["source:dmztracker-printer", "source:official-fob"],
      note: "社区表记载搜刮配方；撤离要求采用官方配方通则。",
    },
    requires: {
      status: "reported",
      value: ["3d-printer", "field-upgrade-printing"],
      sourceIds: ["source:hub-printer-catalog", "source:official-progression"],
    },
  },
  {
    id: "recipe:trophy-system",
    output: {
      itemId: "item:trophy-system",
      quantity: {
        status: "unknown",
        note: "来源未明确每次打印产量；网页数量按钮与可打印次数不作为产量证据。",
      },
    },
    cost: {
      status: "reported",
      value: {
        items: [
          {
            itemId: "item:electronics",
            quantity: 15,
          },
          {
            itemId: "item:control-unit",
            quantity: 3,
          },
        ],
        cash: null,
      },
      sourceIds: ["source:hub-printer-catalog", "source:dmztracker-printer"],
    },
    unlock: {
      status: "reported",
      value: {
        kind: "extract-recipe",
      },
      sourceIds: ["source:dmztracker-printer", "source:official-fob"],
      note: "社区表记载搜刮配方；撤离要求采用官方配方通则。",
    },
    requires: {
      status: "reported",
      value: ["3d-printer", "field-upgrade-printing"],
      sourceIds: ["source:hub-printer-catalog", "source:official-progression"],
    },
  },
  {
    id: "recipe:advanced-uav",
    output: {
      itemId: "item:advanced-uav",
      quantity: {
        status: "unknown",
        note: "来源未明确每次打印产量；网页数量按钮与可打印次数不作为产量证据。",
      },
    },
    cost: {
      status: "reported",
      value: {
        items: [
          {
            itemId: "item:comms-module",
            quantity: 2,
          },
          {
            itemId: "item:nitro-compounds",
            quantity: 3,
          },
          {
            itemId: "item:electronic-sensors",
            quantity: 5,
          },
        ],
        cash: null,
      },
      sourceIds: ["source:hub-printer-catalog", "source:dmztracker-printer"],
    },
    unlock: {
      status: "reported",
      value: {
        kind: "extract-recipe",
      },
      sourceIds: ["source:dmztracker-printer", "source:official-fob"],
      note: "社区表记载搜刮配方；撤离要求采用官方配方通则。",
    },
    requires: {
      status: "reported",
      value: ["3d-printer"],
      sourceIds: ["source:hub-printer-catalog"],
    },
  },
  {
    id: "recipe:artillery-beacon",
    output: {
      itemId: "item:artillery-beacon",
      quantity: {
        status: "unknown",
        note: "来源未明确每次打印产量；网页数量按钮与可打印次数不作为产量证据。",
      },
    },
    cost: {
      status: "reported",
      value: {
        items: [
          {
            itemId: "item:volatile-explosives",
            quantity: 2,
          },
          {
            itemId: "item:nitro-compounds",
            quantity: 3,
          },
          {
            itemId: "item:detonators",
            quantity: 5,
          },
        ],
        cash: null,
      },
      sourceIds: ["source:hub-printer-catalog", "source:dmztracker-printer"],
    },
    unlock: {
      status: "reported",
      value: {
        kind: "extract-recipe",
      },
      sourceIds: ["source:dmztracker-printer", "source:official-fob"],
      note: "社区表记载搜刮配方；撤离要求采用官方配方通则。",
    },
    requires: {
      status: "reported",
      value: ["3d-printer"],
      sourceIds: ["source:hub-printer-catalog"],
    },
  },
  {
    id: "recipe:bomb-glider",
    output: {
      itemId: "item:bomb-glider",
      quantity: {
        status: "unknown",
        note: "来源未明确每次打印产量；网页数量按钮与可打印次数不作为产量证据。",
      },
    },
    cost: {
      status: "conflicting",
      claims: [
        {
          value: {
            items: [
              {
                itemId: "item:chemicals",
                quantity: 30,
              },
              {
                itemId: "item:stock-rod",
                quantity: 2,
              },
              {
                itemId: "item:control-unit",
                quantity: 5,
              },
            ],
            cash: null,
          },
          sourceIds: ["source:hub-printer-catalog", "source:dmztracker-printer"],
        },
        {
          value: {
            items: [
              {
                itemId: "item:stock-rod",
                quantity: 1,
              },
            ],
            cash: null,
          },
          sourceIds: ["source:codmunity-crafting"],
          note: "CODMunity 的 2026-10-26 页面仅列出这些材料，与本轮另两站记载不同；未当成其余材料不消耗的证据。",
        },
      ],
      note: "社区来源对直接材料用量记载不一致，暂不选择其中一版用于计算，待游戏内核对。",
    },
    unlock: {
      status: "reported",
      value: {
        kind: "extract-recipe",
      },
      sourceIds: ["source:dmztracker-printer", "source:official-fob"],
      note: "社区表记载搜刮配方；撤离要求采用官方配方通则。",
    },
    requires: {
      status: "reported",
      value: ["3d-printer"],
      sourceIds: ["source:hub-printer-catalog"],
    },
  },
  {
    id: "recipe:bombing-run",
    output: {
      itemId: "item:bombing-run",
      quantity: {
        status: "unknown",
        note: "来源未明确每次打印产量；网页数量按钮与可打印次数不作为产量证据。",
      },
    },
    cost: {
      status: "reported",
      value: {
        items: [
          {
            itemId: "item:chemicals",
            quantity: 30,
          },
          {
            itemId: "item:nitro-compounds",
            quantity: 2,
          },
          {
            itemId: "item:control-unit",
            quantity: 5,
          },
        ],
        cash: null,
      },
      sourceIds: ["source:hub-printer-catalog", "source:dmztracker-printer"],
    },
    unlock: {
      status: "reported",
      value: {
        kind: "extract-recipe",
      },
      sourceIds: ["source:dmztracker-printer", "source:official-fob"],
      note: "社区表记载搜刮配方；撤离要求采用官方配方通则。",
    },
    requires: {
      status: "reported",
      value: ["3d-printer"],
      sourceIds: ["source:hub-printer-catalog"],
    },
  },
  {
    id: "recipe:care-package",
    output: {
      itemId: "item:care-package",
      quantity: {
        status: "unknown",
        note: "来源未明确每次打印产量；网页数量按钮与可打印次数不作为产量证据。",
      },
    },
    cost: {
      status: "reported",
      value: {
        items: [
          {
            itemId: "item:electronics",
            quantity: 20,
          },
          {
            itemId: "item:control-unit",
            quantity: 2,
          },
          {
            itemId: "item:rigid-synthetics",
            quantity: 2,
          },
        ],
        cash: null,
      },
      sourceIds: ["source:hub-printer-catalog", "source:dmztracker-printer"],
    },
    unlock: {
      status: "reported",
      value: {
        kind: "dmz-level",
        level: 28,
      },
      sourceIds: ["source:dmztracker-printer"],
    },
    requires: {
      status: "reported",
      value: ["3d-printer"],
      sourceIds: ["source:hub-printer-catalog"],
    },
  },
  {
    id: "recipe:combat-drone",
    output: {
      itemId: "item:combat-drone",
      quantity: {
        status: "unknown",
        note: "来源未明确每次打印产量；网页数量按钮与可打印次数不作为产量证据。",
      },
    },
    cost: {
      status: "reported",
      value: {
        items: [
          {
            itemId: "item:electronics",
            quantity: 30,
          },
          {
            itemId: "item:cpu",
            quantity: 2,
          },
          {
            itemId: "item:control-unit",
            quantity: 5,
          },
        ],
        cash: null,
      },
      sourceIds: ["source:hub-printer-catalog", "source:dmztracker-printer"],
    },
    unlock: {
      status: "reported",
      value: {
        kind: "extract-recipe",
      },
      sourceIds: ["source:dmztracker-printer", "source:official-fob"],
      note: "社区表记载搜刮配方；撤离要求采用官方配方通则。",
    },
    requires: {
      status: "reported",
      value: ["3d-printer"],
      sourceIds: ["source:hub-printer-catalog"],
    },
  },
  {
    id: "recipe:crossfire",
    output: {
      itemId: "item:crossfire",
      quantity: {
        status: "unknown",
        note: "来源未明确每次打印产量；网页数量按钮与可打印次数不作为产量证据。",
      },
    },
    cost: {
      status: "reported",
      value: {
        items: [
          {
            itemId: "item:prototype-rf-module",
            quantity: 2,
          },
          {
            itemId: "item:volatile-explosives",
            quantity: 3,
          },
          {
            itemId: "item:electronic-sensors",
            quantity: 5,
          },
        ],
        cash: null,
      },
      sourceIds: ["source:hub-printer-catalog", "source:dmztracker-printer"],
    },
    unlock: {
      status: "reported",
      value: {
        kind: "extract-recipe",
      },
      sourceIds: ["source:dmztracker-printer", "source:official-fob"],
      note: "社区表记载搜刮配方；撤离要求采用官方配方通则。",
    },
    requires: {
      status: "reported",
      value: ["3d-printer"],
      sourceIds: ["source:hub-printer-catalog"],
    },
  },
  {
    id: "recipe:impact-warhead",
    output: {
      itemId: "item:impact-warhead",
      quantity: {
        status: "unknown",
        note: "来源未明确每次打印产量；网页数量按钮与可打印次数不作为产量证据。",
      },
    },
    cost: {
      status: "reported",
      value: {
        items: [
          {
            itemId: "item:turned-components",
            quantity: 2,
          },
          {
            itemId: "item:nitro-compounds",
            quantity: 3,
          },
          {
            itemId: "item:detonators",
            quantity: 5,
          },
        ],
        cash: null,
      },
      sourceIds: ["source:hub-printer-catalog", "source:dmztracker-printer"],
    },
    unlock: {
      status: "reported",
      value: {
        kind: "extract-recipe",
      },
      sourceIds: ["source:dmztracker-printer", "source:official-fob"],
      note: "社区表记载搜刮配方；撤离要求采用官方配方通则。",
    },
    requires: {
      status: "reported",
      value: ["3d-printer"],
      sourceIds: ["source:hub-printer-catalog"],
    },
  },
  {
    id: "recipe:railgun-sentry",
    output: {
      itemId: "item:railgun-sentry",
      quantity: {
        status: "unknown",
        note: "来源未明确每次打印产量；网页数量按钮与可打印次数不作为产量证据。",
      },
    },
    cost: {
      status: "reported",
      value: {
        items: [
          {
            itemId: "item:power-regulator",
            quantity: 2,
          },
          {
            itemId: "item:nitro-compounds",
            quantity: 3,
          },
          {
            itemId: "item:control-unit",
            quantity: 5,
          },
        ],
        cash: null,
      },
      sourceIds: ["source:hub-printer-catalog", "source:dmztracker-printer"],
    },
    unlock: {
      status: "reported",
      value: {
        kind: "extract-recipe",
      },
      sourceIds: ["source:dmztracker-printer", "source:official-fob"],
      note: "社区表记载搜刮配方；撤离要求采用官方配方通则。",
    },
    requires: {
      status: "reported",
      value: ["3d-printer"],
      sourceIds: ["source:hub-printer-catalog"],
    },
  },
  {
    id: "recipe:uav",
    output: {
      itemId: "item:uav",
      quantity: {
        status: "unknown",
        note: "来源未明确每次打印产量；网页数量按钮与可打印次数不作为产量证据。",
      },
    },
    cost: {
      status: "reported",
      value: {
        items: [
          {
            itemId: "item:electronics",
            quantity: 30,
          },
          {
            itemId: "item:structural-alloy",
            quantity: 2,
          },
          {
            itemId: "item:electronic-sensors",
            quantity: 5,
          },
        ],
        cash: null,
      },
      sourceIds: ["source:hub-printer-catalog", "source:dmztracker-printer"],
    },
    unlock: {
      status: "reported",
      value: {
        kind: "dmz-level",
        level: 31,
      },
      sourceIds: ["source:dmztracker-printer"],
    },
    requires: {
      status: "reported",
      value: ["3d-printer"],
      sourceIds: ["source:hub-printer-catalog"],
    },
  },
  {
    id: "recipe:disposable-parachute",
    output: {
      itemId: "item:disposable-parachute",
      quantity: {
        status: "unknown",
        note: "来源未明确每次打印产量；网页数量按钮与可打印次数不作为产量证据。",
      },
    },
    cost: {
      status: "conflicting",
      claims: [
        {
          value: {
            items: [
              {
                itemId: "item:chemicals",
                quantity: 30,
              },
              {
                itemId: "item:rigid-synthetics",
                quantity: 3,
              },
            ],
            cash: null,
          },
          sourceIds: ["source:hub-printer-catalog", "source:dmztracker-printer"],
        },
        {
          value: {
            items: [
              {
                itemId: "item:rigid-synthetics",
                quantity: 1,
              },
            ],
            cash: null,
          },
          sourceIds: ["source:codmunity-crafting"],
          note: "CODMunity 的 2026-10-26 页面仅列出这些材料，与本轮另两站记载不同；未当成其余材料不消耗的证据。",
        },
      ],
      note: "社区来源对直接材料用量记载不一致，暂不选择其中一版用于计算，待游戏内核对。",
    },
    unlock: {
      status: "reported",
      value: {
        kind: "dmz-level",
        level: 55,
      },
      sourceIds: ["source:dmztracker-printer"],
    },
    requires: {
      status: "reported",
      value: ["3d-printer"],
      sourceIds: ["source:hub-printer-catalog"],
    },
  },
  {
    id: "recipe:durable-gas-mask",
    output: {
      itemId: "item:durable-gas-mask",
      quantity: {
        status: "unknown",
        note: "来源未明确每次打印产量；网页数量按钮与可打印次数不作为产量证据。",
      },
    },
    cost: {
      status: "reported",
      value: {
        items: [
          {
            itemId: "item:chemicals",
            quantity: 30,
          },
          {
            itemId: "item:high-tenacity-fibers",
            quantity: 1,
          },
          {
            itemId: "item:biomaterials",
            quantity: 5,
          },
        ],
        cash: null,
      },
      sourceIds: ["source:hub-printer-catalog", "source:dmztracker-printer"],
    },
    unlock: {
      status: "reported",
      value: {
        kind: "extract-recipe",
      },
      sourceIds: ["source:dmztracker-printer", "source:official-fob"],
      note: "社区表记载搜刮配方；撤离要求采用官方配方通则。",
    },
    requires: {
      status: "reported",
      value: ["3d-printer"],
      sourceIds: ["source:hub-printer-catalog"],
    },
  },
  {
    id: "recipe:elite-night-vision-goggles",
    output: {
      itemId: "item:elite-night-vision-goggles",
      quantity: {
        status: "unknown",
        note: "来源未明确每次打印产量；网页数量按钮与可打印次数不作为产量证据。",
      },
    },
    cost: {
      status: "reported",
      value: {
        items: [
          {
            itemId: "item:power-regulator",
            quantity: 2,
          },
          {
            itemId: "item:cpu",
            quantity: 3,
          },
          {
            itemId: "item:electronic-sensors",
            quantity: 5,
          },
        ],
        cash: null,
      },
      sourceIds: ["source:hub-printer-catalog", "source:dmztracker-printer"],
    },
    unlock: {
      status: "reported",
      value: {
        kind: "extract-recipe",
      },
      sourceIds: ["source:dmztracker-printer", "source:official-fob"],
      note: "社区表记载搜刮配方；撤离要求采用官方配方通则。",
    },
    requires: {
      status: "reported",
      value: ["3d-printer"],
      sourceIds: ["source:hub-printer-catalog"],
    },
  },
  {
    id: "recipe:gas-mask",
    output: {
      itemId: "item:gas-mask",
      quantity: {
        status: "unknown",
        note: "来源未明确每次打印产量；网页数量按钮与可打印次数不作为产量证据。",
      },
    },
    cost: {
      status: "reported",
      value: {
        items: [
          {
            itemId: "item:chemicals",
            quantity: 30,
          },
          {
            itemId: "item:rigid-synthetics",
            quantity: 3,
          },
        ],
        cash: null,
      },
      sourceIds: ["source:hub-printer-catalog", "source:dmztracker-printer"],
    },
    unlock: {
      status: "reported",
      value: {
        kind: "dmz-level",
        level: 26,
      },
      sourceIds: ["source:dmztracker-printer"],
    },
    requires: {
      status: "reported",
      value: ["3d-printer"],
      sourceIds: ["source:hub-printer-catalog"],
    },
  },
  {
    id: "recipe:night-vision-goggles",
    output: {
      itemId: "item:night-vision-goggles",
      quantity: {
        status: "unknown",
        note: "来源未明确每次打印产量；网页数量按钮与可打印次数不作为产量证据。",
      },
    },
    cost: {
      status: "reported",
      value: {
        items: [
          {
            itemId: "item:metals",
            quantity: 50,
          },
          {
            itemId: "item:printed-circuit-board",
            quantity: 3,
          },
          {
            itemId: "item:control-unit",
            quantity: 10,
          },
        ],
        cash: null,
      },
      sourceIds: ["source:hub-printer-catalog", "source:dmztracker-printer"],
    },
    unlock: {
      status: "reported",
      value: {
        kind: "mission",
        missionName: "Underground (DMZ Orders)",
      },
      sourceIds: ["source:dmztracker-printer"],
      note: "任务奖励配方的记载来自社区表，未在本轮实测。",
    },
    requires: {
      status: "reported",
      value: ["3d-printer"],
      sourceIds: ["source:hub-printer-catalog"],
    },
  },
  {
    id: "recipe:parachute",
    output: {
      itemId: "item:parachute",
      quantity: {
        status: "unknown",
        note: "来源未明确每次打印产量；网页数量按钮与可打印次数不作为产量证据。",
      },
    },
    cost: {
      status: "reported",
      value: {
        items: [
          {
            itemId: "item:turned-components",
            quantity: 2,
          },
          {
            itemId: "item:nylon-cloth",
            quantity: 5,
          },
          {
            itemId: "item:rigid-synthetics",
            quantity: 10,
          },
        ],
        cash: null,
      },
      sourceIds: ["source:hub-printer-catalog", "source:dmztracker-printer"],
    },
    unlock: {
      status: "reported",
      value: {
        kind: "extract-recipe",
      },
      sourceIds: ["source:dmztracker-printer", "source:official-fob"],
      note: "社区表记载搜刮配方；撤离要求采用官方配方通则。",
    },
    requires: {
      status: "reported",
      value: ["3d-printer"],
      sourceIds: ["source:hub-printer-catalog"],
    },
  },
  {
    id: "recipe:weak-night-vision-goggles",
    output: {
      itemId: "item:weak-night-vision-goggles",
      quantity: {
        status: "unknown",
        note: "来源未明确每次打印产量；网页数量按钮与可打印次数不作为产量证据。",
      },
    },
    cost: {
      status: "reported",
      value: {
        items: [
          {
            itemId: "item:metals",
            quantity: 25,
          },
          {
            itemId: "item:control-unit",
            quantity: 5,
          },
        ],
        cash: null,
      },
      sourceIds: ["source:hub-printer-catalog", "source:dmztracker-printer"],
    },
    unlock: {
      status: "reported",
      value: {
        kind: "extract-recipe",
      },
      sourceIds: ["source:dmztracker-printer", "source:official-fob"],
      note: "社区表记载搜刮配方；撤离要求采用官方配方通则。",
    },
    requires: {
      status: "reported",
      value: ["3d-printer"],
      sourceIds: ["source:hub-printer-catalog"],
    },
  },
] as const satisfies readonly Recipe[];
