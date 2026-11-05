# MW4 DMZ 3D 打印升级资料核对（2026-11-05）

升级资料暂用于开发查阅，尚未接入运行时类型与页面。完整研究数据见 [upgrades.json](../external/mw4-dmz/upgrades.json)，保留各来源声明、中文名出处和未知值；它是研究中间格式，不是当前 Catalog 的直接替代文件。

## 覆盖范围

| 来源                                                                        | 普通物品配方 |    升级条目 | 备注                                               |
| --------------------------------------------------------------------------- | -----------: | ----------: | -------------------------------------------------- |
| [DMZHub 升级目录](https://dmzhub.gg/upgrades)                               |     本页不含 | 9 组、34 档 | 当前银行已到 XIII；本次明细主来源                  |
| [Final Exfil 升级汇总](https://finalexfil.com/wiki/recipe/printer-upgrades) |     本页不含 | 9 组、31 档 | 11 月 2 日页，银行表只到 X，正文另提 XIII 玩家报告 |
| [DMZTracker 打印机](https://dmztracker.com/printer/)                        |           95 |          10 | 页面总计 105，升级只覆盖初级部分                   |
| [COD Central 配方](https://codcentral.net/blog/mw4-dmz-3d-printer-recipes/) |           95 |          14 | 11 月 3 日页总计 109；银行 I–V、MIA I/III 等       |

因此 105、109、31、34 不是同一口径，不能择一当作游戏全部配方总数。DMZHub 的现行目录最完整，但仍应描述为“已收集目录”，不宣称穷尽游戏所有未来升级。

| 升级组                       | 档数 | 效果                                      |
| ---------------------------- | ---: | ----------------------------------------- |
| Bank Upgrade                 |   13 | 银行上限从 I 档 25 万逐级到 XIII 档 20 亿 |
| Stash Item Upgrade           |    4 | 每档增加 18 个物品槽                      |
| Stash Weapon Upgrade         |    3 | 每档增加 6 个武器槽                       |
| MIA Recovery Discount        |    4 | 每档额外降低 5% 找回费用                  |
| Gunsmith Upgrade             |    2 | 每档额外降低 5% 军械改造费用              |
| Vendor Item Upgrade          |    2 | 增加补给商可购物品，具体商品未收集        |
| Dog Tag Case Upgrade         |    4 | 每档增加 20 个身份牌槽                    |
| Uncommon Ingredient Printing |    1 | 授予精制材料打印能力                      |
| Epic Ingredient Printing     |    1 | 授予史诗材料打印能力                      |

合计 34 档，引用 44 种作为升级输入的物品。记录游戏里的箱子容量升级不意味着给本站增加库存管理产品功能。

## 中文名称

[官方中文 FOB 指南](https://www.callofduty.com/cn/zh/blog/2026/10/call-of-duty-modern-warfare-4-dmz-how-to-play-forward-operating-base-guide)直接给出“银行升级”“箱子物品容量升级”“失踪找回折扣”“箱子武器容量升级”。官方另外使用“军械改造”“补给商”“身份牌箱”等设施名称，说明精制与史诗材料打印能力，但没有在正文列出全部升级卡的中文标题。

[DMZHub 中文升级页](https://dmzhub.gg/zh/upgrades)提供全部档位中文名，研究 JSON 标记为 community，不能把社区中文站当作官方命名来源。例如它写“储藏箱物品升级”“失踪人员找回折扣”“商店物品升级”。同站同条材料打印升级甚至存在组名“精制材料打印”和档位名“精制原料打印”的差异。建议用户界面优先官方已证实类别名；具体卡名无官方截图时保留社区出处，并将其他名称作为检索别名。

## 成本、前置与证据边界

- 34 档的材料数量均已保存，JSON 同时保留英文、社区中文、来源 slug、标准化 slug 建议和来源更新时间。
- 24 档明确列出现金数额；10 档未列现金，主记录保持 `unknown`。Final Exfil 对 MIA 与 Vendor 写了“none”，其 0 现金声明作为独立来源记录保留；对仓库最高档它写“none listed”，不能解释为 0。
- 当前所有升级页面的要求数组只有现金与具体物品，没有四类基础资源。资料结构仍应允许它们，不能把当前观测写成永远不允许基础资源的模型限制。
- DMZHub 与 Final Exfil 描述升级按前一档顺序完成；COD Central 银行 II–V 卡逐条明确要求前一档。DMZTracker 将 Bank II 写作一开始可用，与前述来源冲突，JSON 单独保留。
- COD Central 明确军械改造 I、补给商 I、身份牌箱 I 要求先开放对应设施；官方给出设施等级分别为 10、5、20。打印机自身为 DMZ 等级 2。
- 精制、史诗材料打印是两个一档能力升级。未找到“史诗必须先完成精制”的证据，不能凭稀有度给它们串前置。
- 官方笼统说明升级涉及多次打印，但没有给出各档所需次数；社区表也未解释材料是每次打印消耗还是该档总需求。研究数据只称其“该档页面列出的要求”。每档打印次数与成本口径均须保留未知，不能默认次数 1、把效果增量当打印产量，或擅自乘次数。
- DMZHub 元数据中的 `printer_output` 仅 Gunsmith II 为 true，其余 33 档为 false，语义未核实；它不是“能否在打印机制作”的可靠开关，保留为原始元数据，不导入业务规则。
- Final Exfil 明确是自动汇编网站，且大量引用 DMZHub。两个网页写法一致不意味着独立双源证实。银行 XI–XIII 成本目前来自 DMZHub；XIII 的效果与红色 DRC 钥匙要求在 Final Exfil 引述玩家报告中也有对应，但不据此提升整条配方置信度。

DMZHub 使用 `structural-allow` 和 `stabilized-reagents-2` 等历史或拼写异常 slug。研究 JSON 建议分别归一为 `structural-alloy` 与 `stabilized-reagents`，同时保留原始 slug，避免以后导入重复物品。

## 与现有 types 的兼容建议

当前 `Recipe` 明确产出 `itemId` 和每次打印的 `output.quantity`，用于可携带物品；升级产生永久效果，建议新增同级 `types/upgrade.ts` 与 `data/upgrades.ts`，不把升级放进 `Item.kind = equipment`，也不新建 feature/domain 层级。

建议最小结构：

```ts
type UpgradeId = `upgrade:${string}`;
type UpgradeGroupId = `upgrade-group:${string}`;

interface Upgrade {
  readonly id: UpgradeId; // 如 upgrade:bank-upgrade-3
  readonly groupId: UpgradeGroupId;
  readonly level: number;
  readonly name: ItemName; // 复用多语言名称及来源分类
  readonly cost: Fact<RecipeCost>; // 过渡期复用现有材料/现金容器
  readonly costBasis: Fact<"per-print" | "per-level">;
  readonly printsRequired: Fact<number>;
  readonly requires: Fact<readonly UpgradePrerequisite[]>;
  readonly effects: Fact<readonly UpgradeEffect[]>;
  readonly sourceIds: readonly [SourceId, ...SourceId[]];
}

type UpgradePrerequisite =
  | { readonly kind: "upgrade"; readonly upgradeId: UpgradeId }
  | { readonly kind: "capability"; readonly capabilityId: CapabilityId };
```

这里 `costBasis` 和 `printsRequired` 对本批数据均为 unknown。`RecipeCost.cash` 当前用 null 表示未知，直接复用时沿用现有约定即可；后续如果统一清理 null，建议让公共成本结构对 `cash` 使用 `Fact<number>`，而不是借助 0 充当未知值。研究 JSON 已用显式 Fact，不含为未知值引入的 null。

`UpgradeEffect` 只表达结果，例如银行容量上限、槽位增量、折扣增量、授予 Capability；不存在 `output.quantity`。将来若有游戏证据证明某档必须打印多次，`printsRequired` 才记录该档完成次数，`costBasis` 决定是否乘次数，不能让现有成品产量计算器替它解释。

可以复用当前 `Item` 作为材料引用，但本批输入含贵重物品和三把 DRC 钥匙，当前 Item 联合类型缺少这两类，建议增加 `kind: "valuable"`、`kind: "key"`（至少不要误标为可打印 ingredient）。已有门锁破坏炸药等物品继续引用既有 ID。

`Capability` 沿用现有 `uncommon-ingredient-printing` / `epic-ingredient-printing` ID。`UnlockCondition` 增加 `{ kind: "upgrade"; upgradeId }`，让这两个能力的解锁方式引用对应升级；补给商与身份牌箱如需要显示设施前置，再增加 capability ID。用户手动标记的能力状态和升级状态不应互相静默覆盖。

`Catalog` 增加 `upgrades`；`UnlockProgress` 可增加 `upgrades: Partial<Record<UpgradeId, UnlockRecord>>`。继续使用用户手动完成标记，不依据收集齐材料自动认定已打印升级。记录实际打印次数是未来有证据、有需要时的扩展，不应为未知次数先增加复杂用户输入。

`RequirementTarget` 将来可增加 `{ kind: "upgrade"; upgradeId }`。它表示某个永久升级目标，不携带任意成品数量。计算器首先展示该档明确列出的需求；成本口径或次数未知时说明无法保证最终总成本。若要汇总前置档，必须依据用户已完成状态明确选择，不能把不知道是否完成的前置默认为未完成而自动累加。
