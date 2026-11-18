# X01 客户端名称、配方与显示顺序核对

记录日期：2026-11-18。来源为用户在本次会话提供的简体中文客户端截图、随附文字说明，以及当天查阅的社区物品与配方页面。截图未显示客户端构建号，不把记录日期视为补丁版本。

## 证据范围

| 证据             | 能确认的内容                                                                                                                                  | 未据此推断的内容                                                          |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| 消耗品列表截图   | 医疗包、自救包、嗅盐、员工紧急出口出入卡、爆破炸药的客户端用名；员工卡在该列表中的位置及紫色品质标识；图标顶部色条和渐隐点阵样式              | 打印材料、单次产量、现金费用、其他玩家的解锁或库存                        |
| 战术列表截图     | 震撼弹、探测手雷、烟雾弹、电击陷阱、告警器、闪光弹、诱饵手雷、强心针、心跳探测器的客户端用名及当前可见顺序                                    | 未展示条目的位置、所有类别通用的内部排序字段                              |
| 用户随附文字     | 员工卡是 X01 新增道具，FOB 配方为 80 电子元件、6 印刷电路板、10 控制单元；简中名称使用 C4、探测手雷；先已解锁再未解锁、品质按白绿蓝紫金红排序 | C4 名称和员工卡材料并未直接出现在这两张截图中，不标记为本次逐像素截图核对 |
| 社区具名配方页面 | 员工卡的英文名、Epic 品质，以及与用户文字一致的 FOB 材料配方                                                                                  | 当前客户端实测、缺省费用为零、缺省产量为一                                |

客户端截图属于游戏相关第三方内容，版权归 Activision Publishing, Inc.、Infinity Ward 和各自权利人。本记录只保存本项目编写的核对结论，不重新分发截图，不将截图或网页正文打包到应用。

## 员工紧急出口出入卡

| 字段           | 记录                                                                                |
| -------------- | ----------------------------------------------------------------------------------- |
| 稳定物品 ID    | `item:staff-emergency-exfil-keycard`                                                |
| 稳定配方 ID    | `recipe:staff-emergency-exfil-keycard`                                              |
| 英文名         | Staff Emergency Exfil Keycard                                                       |
| 简中客户端用名 | 员工紧急出口出入卡                                                                  |
| 项目分类       | equipment / consumable，沿用用户截图中的打印列表分组                                |
| 稀有度         | Epic / 紫色                                                                         |
| FOB 打印材料   | `item:electronics` × 80；`item:printed-circuit-board` × 6；`item:control-unit` × 10 |
| 现金费用       | 未确认，保留 `null`                                                                 |
| 单次打印产量   | 未确认，保留 `Fact.status: unknown`                                                 |
| 获取条件       | 缺省；允许用户手动标记解锁                                                          |

电子元件对应基础资源 **Electronics**，不对应材料 **Electronic Sensors**（`item:electronic-sensors`）。DMZHub 与 GG Ranked 的员工卡配方均明确写出 Electronics 80、Printed Circuit Board 6、Control Unit 10。

DMZHub 的部分旧页面以及 GG Ranked 将卡片标为 Key；DMZHub 更新的俄语物品页标为 Consumable。本项目用用户当前客户端截图决定打印分组，英文名称及稳定 ID 不受分类差异影响。

物品页显示的 $100 是物品价值，不是打印现金费用。网页上的 `+1` 添加按钮、截图图标右上库存数量与锁定状态均不作为打印产量或用户存档的证据。

另有 [X01 局内打印机指南](https://dmzmap.com/x01)记载 2 CPU、4 Printed Circuit Board、8 Control Unit。该指南描述 X01 地图内的打印机；本项目本次收录的是 FOB 配方，不把两个场景的配方合并或互相覆盖。

## 名称变更与别名

| 稳定 ID                 | 本次显示名 | 保留检索别名 | 证据                                                 |
| ----------------------- | ---------- | ------------ | ---------------------------------------------------- |
| `item:c4`               | C4         | 塑胶炸弹     | 用户对简中客户端用名的文字更正                       |
| `item:snapshot-grenade` | 探测手雷   | 快照手雷     | 战术列表截图及用户文字                               |
| `item:electronics`      | 电子元件   | 电子设备     | 用户配方材料用名；两个社区配方页面确认其英文资源映射 |

医疗包、自救包、嗅盐、爆破炸药和其余截图可见战术物品的现有简中名称均已匹配，本次补充客户端来源。嗅盐与闪光弹原标为社区译名；依据截图将名称来源标记为客户端官方用名。印刷电路板、控制单元的名称依据为用户配方文字，不声称本次截图显示了材料明细。

保留所有已有物品及配方稳定 ID，不改写用户解锁、库存或需求记录。

## 截图顺序与未知规则

先按已解锁、未解锁分组，再依次按白、绿、蓝、紫、金、红排列，依据用户说明。截图可见的战术顺序如下：

| 顺序 | 名称       | 稳定 ID                 |
| ---- | ---------- | ----------------------- |
| 1    | 震撼弹     | `item:stun-grenade`     |
| 2    | 探测手雷   | `item:snapshot-grenade` |
| 3    | 烟雾弹     | `item:smoke-grenade`    |
| 4    | 电击陷阱   | `item:shock-stick`      |
| 5    | 告警器     | `item:screamer-mine`    |
| 6    | 闪光弹     | `item:flash`            |
| 7    | 诱饵手雷   | `item:decoy-grenade`    |
| 8    | 强心针     | `item:stim`             |
| 9    | 心跳探测器 | `item:heartbeat-sensor` |

同品质条目的官方内部排序字段尚未确认。震撼弹的现英文名是 Concussion Grenade，项目保留旧稳定 ID `item:stun-grenade`；不能因为旧名 Stun 看起来接近英文降序，就把英文排序当成已证实规则。仅使用截图中已知的相对顺序，其余同级条目维持稳定资料顺序。

## 社区来源与图片

访问日期均为 2026-11-18：

- [DMZHub 员工卡 FOB 配方](https://dmzhub.gg/3d-printer/staff-emergency-exfil-keycard)：页面标记更新于 2026-11-06。
- [GG Ranked 员工卡物品与配方](https://ggranked.com/games/call-of-duty-modern-warfare-4/modes/dmz/database/items/staff-emergency-exfil-keycard)：页面在本轮再次访问时标记更新于 2026-11-13。
- [DMZHub 简中物品页](https://dmzhub.gg/zh/items/staff-emergency-exfil-keycard)：用于交叉核对条目；本次图片文件从 GG Ranked 的具名页面取得。
- [DMZHub 更新的俄语物品页](https://ru.dmzhub.gg/items/staff-emergency-exfil-keycard)：页面标记更新于 2026-11-11，分类为 Consumable。
- [GG Ranked 员工卡原始 WebP](https://ggranked.com/images/games/call-of-duty-modern-warfare-4/modes/dmz/items/staff-emergency-exfil-keycard-fc592fd7.webp)：从上述具名物品页的主体图片链接取得，按来源原文件保存，具体版权与完整性登记见 [GG Ranked 图片署名表](../../src/assets/third-party/items/ggranked/ATTRIBUTION.md)。

原图映射依据是具名页面的图片链接；本记录不以此声称已逐像素核对源图片和当前客户端截图一致。资料覆盖仍为 sample，本次仅新增这张员工卡，不宣称已覆盖全部 X01 新增配方。
