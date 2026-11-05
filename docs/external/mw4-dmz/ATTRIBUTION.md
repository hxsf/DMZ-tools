# MW4 DMZ 参考来源登记

本目录保存参考链接及项目整理的事实记录，其中 `upgrades.json` 是永久升级的结构化研究数据；没有复制网页正文、原始网页表格或图片。原文、商标和图像版权归原权利人，不继承本项目许可证。登记不授予复制或分发源站内容的权限；本项目自写的说明与代码遵循根目录项目许可证。

| 来源 | 原发布者 / 署名 | 内容与日期 |
| --- | --- | --- |
| [官方 FOB 指南](https://www.callofduty.com/cn/zh/blog/2026/10/call-of-duty-modern-warfare-4-dmz-how-to-play-forward-operating-base-guide) | Call of Duty Staff / Activision | 基础配方、中文名称、资源、枪匠和解锁机制，2026-10-09 |
| [官方英文等级进度表](https://www.callofduty.com/en/blog/2026/10/call-of-duty-modern-warfare-4-ready-for-launch-progression-prestige)与[简体中文版](https://www.callofduty.com/cn/zh/blog/2026/10/call-of-duty-modern-warfare-4-ready-for-launch-progression-prestige) | Call of Duty Staff / Activision | 等级奖励、打印能力与中英文物品名称，2026-10-19 |
| [官方简体首发武器文章](https://www.callofduty.com/cn/zh/blog/2026/10/call-of-duty-modern-warfare-4-launch-multiplayer-operators-weapons-equipment-create-a-class) | Call of Duty Staff / Activision | 武器目录、中文名称及旧译名，2026-10-19 |
| [DMZHub 打印配方](https://dmzhub.gg/3d-printer)与[简体中文目录](https://dmzhub.gg/zh/3d-printer) | DMZHub 及对应贡献者 | 本次普通物品配方目录覆盖与成本；单页日期见运行资料来源表 |
| [DMZTracker 配方表](https://dmztracker.com/printer/)与[中文版](https://dmztracker.com/zh/printer/) | DMZTracker 及其署名来源 | 社区成本和解锁条件，页面数据更新至 2026-11-02 |
| [CODMunity 配方规划器](https://codmunity.gg/dmz/crafting) | CODMunity 及对应贡献者 | 既有配方成本与分歧，2026-10-26 |
| [DMZHub 手册目录](https://dmzhub.gg/weapons/manuals)、[武器总表](https://dmzhub.gg/weapons)与[刀具详情](https://dmzhub.gg/weapons/fss-carbon-edge-1095) | DMZHub 及对应贡献者 | 32 条手册、33 件含近战刀的武器目录，及刀具未关联手册的说明 |
| [GG Ranked 手册目录](https://ggranked.com/games/call-of-duty-modern-warfare-4/modes/dmz/database/items/weapon-manuals) | GG Ranked 及对应贡献者 | 刀具手册冲突核对；目录更新于 2026-11-03，争议条目未加入应用 |
| [DMZ Codex：M4 手册](https://dmzcodex.com/items/manual-m4/)及 [Kastov 762 手册](https://dmzcodex.com/items/manual-kastov-762/) | DMZ Codex | 具名手册与武器关系，2026-10-28 |
| [武器手册与配方实测记录](https://allthings.how/how-to-get-weapon-manuals-and-3d-printer-recipes-in-call-of-duty-modern-warfare-4-dmz/) | All Things How / 原文署名作者 | Sang 9mm 手册样例，2026-10-21；来源实测不代表本项目实测 |
| [用户提供的中文客户端截图核对记录](../../development/weapon-name-verification.md) | 用户提供截图；游戏文字、商标和美术权利归 Activision 及相关权利人 | 2026-11-05 收到九张“购买新武器”截图，核对 32 项名称及分类，构建号未知；本目录不保存截图 |
| [DMZHub 永久升级](https://dmzhub.gg/upgrades)与[简体中文版](https://dmzhub.gg/zh/upgrades) | DMZHub 及对应贡献者 | 9 组 34 档，逐档来源保存在 `upgrades.json`；未接入应用 |
| [Final Exfil 升级汇编](https://finalexfil.com/wiki/recipe/printer-upgrades) | Final Exfil；页面注明自动汇编并引用 DMZHub | 9 组 31 档旧覆盖，仅交叉参考，不视为独立双源确认 |
| [COD Central 打印配方整理](https://codcentral.net/blog/mw4-dmz-3d-printer-recipes/) | COD Central / 原文署名作者 | 升级与普通配方条目范围交叉参考，未将混合目录总数当作普通配方数 |

本次运行资料覆盖 95 项普通打印配方、32 份武器手册及其关联物品，共 175 个物品记录；7 项材料成本冲突和未知产量分别保留。`catalog.coverage` 仍为 `sample`，表示有限范围来源整理，不代表全游戏数据或当前版本实测。另存的 9 组 34 档升级只供开发研究，不进入 Vite 产物，详见 [升级研究说明](../../development/upgrades-research.md)。

武器中文名称已按用户截图校正，旧官网名称继续作为检索别名；其他物品仍按各自官方文章、社区或项目来源区分。完整说明见 [`src/data/README.md`](../../../src/data/README.md)与 [武器覆盖核对](../../development/weapon-coverage.md)。

图片不保存在本目录；运行应用另引用 143 张真实游戏图片，分来源登记在 [DMZHub（119 张）](../../../src/assets/third-party/items/dmzhub/ATTRIBUTION.md)、[DMZTracker.gg（23 张）](../../../src/assets/third-party/items/dmztracker/ATTRIBUTION.md)和 [MW4Field（1 张）](../../../src/assets/third-party/items/mw4field/ATTRIBUTION.md)。`dmztracker.com` 配方资料与 `dmztracker.gg` 图片来源分别登记；图片许可状态以各自署名文件为准。

访问日期：2026-11-05。资料适用于来源注明的 MW4 DMZ 首发期范围，不能推定适用于后续版本。未确认上述站点整体资料或图片的可复用许可；本登记仅保留来源和本项目所需事实，不替代原条款。外部参考与署名文档不导入应用，也不放入 `public/`。
