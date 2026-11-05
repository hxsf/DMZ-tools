# 目录设计

## 源码职责

项目按技术职责组织模块，目录内先平铺文件。`src/main.tsx` 负责挂载，`src/App.tsx` 负责布局与工具导航，`src/router.tsx` 使用 preact-iso 声明路径和懒加载页面。

| 位置                          | 职责                                                           |
| ----------------------------- | -------------------------------------------------------------- |
| `src/views/`                  | 页面入口，配方、武器手册、打印计算器、需求清单各一个 View 文件 |
| `src/components/`             | 公共导航、解锁列表、物品图片与材料清单等组件                   |
| `src/types/`                  | 跨模块类型，独立于 Preact 和 Signals                           |
| `src/stores/`                 | 用 @preact/signals 管理库存、解锁和计划，提供修改操作          |
| `src/stores/app.ts`           | AppState：加载状态、保存队列和持久化结果                       |
| `src/context.tsx`             | 为界面提供同一 AppState 实例                                   |
| `src/calculations/`           | 直接材料需求、共享库存抵扣及计算问题                           |
| `src/data/`                   | 游戏资料样本、来源、资料版本和待核实信息                       |
| `src/i18n.ts`、`src/locales/` | i18next 初始化及中英文界面文案                                 |
| `src/storage.ts`              | 用户存档校验及显式异步加载、保存，存储与响应式状态分离         |
| `src/kv.ts`                   | 异步 KV 的浏览器实现，封装 localStorage 访问                   |
| `src/styles/`                 | 全局样式                                                       |

首版包含 32 种武器手册和 10 项配方的解锁跟踪、直接材料打印计算器和打印需求清单，不包含武器外观蓝图、自由搜集入口或额外材料储备工具。各页面已接入共享用户状态；搜索、筛选、折叠与输入草稿等临时状态留在组件内。

界面采用紧凑白底蓝色工作台，PC 顶部导航、手机底部导航，不重复显示页面大标题。解锁类别可折叠，搜索时匹配分组自动展开，清空搜索后恢复原折叠状态。默认中文，英文界面已实现；`i18next` 和 `react-i18next` 通过 Preact compat 接入，可见文案用 `<Trans>`，属性与其他字符串用 `t()`。

`src/calculations/` 提供不依赖 UI 的直接材料计算，不递归展开中间材料配方。来源未知单次产量由用户显式填写，保存为制作目标的 `outputPerCraft`，不改公共资料。需求页仅接收计算器加入的目标，可完成、恢复或移除；相同材料汇总后，共享库存只抵扣一次。修改或完成计划不自动扣库存，解锁与需求计算彼此独立。

游戏资料与个人记录分开保存，更新配方资料保留用户解锁、库存和计划。源码按技术职责平铺，不增加 `domain/`、`features/` 或每个工具各一套子目录，也不预建未使用的模块。路由采用 History 路径，生产静态服务器应将未命中文件的页面请求回退到 `index.html`。

## 加载与保存

`createAppState(kv)` 创建 store 与加载、保存状态，实例创建不访问存储。应用显式调用 `load()`；只有有效恢复或确认键不存在后才允许操作与保存，失败展示错误并允许重试，不覆盖原数据。用户操作显式调用 `persist()`，调用时固定快照，保存按队列串行执行。保存状态以实际写入结果为准，不通过自动订阅 store 触发写入。

`src/types/storage.ts` 定义通用 `AsyncKV`：`get` 返回 `Promise<Result<Option<string>, KVError>>`，`set` 和 `delete` 返回 `Promise<Result<void, KVError>>`。`Result` 与 `Option` 均使用已有的 `ts-results-es`，配合标准 `async/await`。读取值为 `Ok(Some(value))`，键不存在为 `Ok(None)`，访问失败为 `Err`，不能通过 Promise rejection 表达。空字符串是 `Some("")`，不等于缺失。底层 localStorage 的返回值通过 `Option.fromNullable()` 在适配器中转换。KV 不处理 JSON、用户存档类型或 Signals，存档校验与版本处理留在 `storage.ts`。

调用方可以使用 `map` / `andThen` 组合可选值，或用 `mapOr` 在边界明确提供缺失时的结果。加载存档时仅对 `Some` 中的字符串进行解析，`None` 对应 `empty`；解析失败仍保留为无效内容，不能转成 `None`。Option 是运行时返回值，不将它序列化进存档。

`createBrowserKV()` 延迟到实际操作时访问 localStorage，创建实例与导入模块均不访问浏览器。原生 API 的异常在适配器边界通过 `Result.wrap()` 捕获并转换：权限错误对应 `access-denied`，容量错误对应 `quota-exceeded`，其他访问错误对应 `unavailable`。`KVError` 保留操作、键和原始 `cause`，界面按错误码翻译，不直接展示底层异常。

localStorage 底层仍同步，这一包装只统一异步调用接口。以后实现远端 KV 或 IndexedDB 时替换注入的对象即可；实现者负责将底层同步异常与异步失败转换为 `Err`。所有实现必须等待写操作成功才返回 `Ok`，接口不提供事务或跨设备冲突合并。调用方使用 `isOk()` / `isErr()` 分支处理，避免用 `unwrap()` 将错误重新变成异常。

## 资源与文档边界

| 目录                      | 保存内容                       | 进入生产构建的方式                |
| ------------------------- | ------------------------------ | --------------------------------- |
| `src/assets/`             | 项目自有、需要构建处理的资源   | 从源码显式引用                    |
| `src/assets/third-party/` | 独立版权的外部资源             | 从源码显式引用，Vite 生成资源地址 |
| `public/`                 | 需保持名称、原样复制的自有文件 | Vite 原样复制到 `dist/`           |
| `docs/development/`       | 本项目的开发与设计文档         | 不进入应用依赖图                  |
| `docs/external/`          | 外部参考文档、手册、说明       | 仅开发查阅，不导入或复制到应用    |

第三方资源按 `资源类别/来源/文件` 存放，例如 `src/assets/third-party/items/<source>/`。每个来源目录保存对应的 `ATTRIBUTION.md` 与原许可证，便于追踪单个文件的出处。

当前 26 张真实游戏图片位于 `src/assets/third-party/items/dmzhub/`，包括 18 张资源或物品、8 张武器。`src/data/images.ts` 静态导入并按物品 ID 映射，`ItemImage` 统一显示。缺少图片时保留名称，不使用生成图或替代图；对应 `ATTRIBUTION.md` 逐项记录出处。

批量资源可使用带明确图片扩展名的 `import.meta.glob`，不要对整个第三方目录使用不受限制的通配符，以免将署名和许可说明当成运行时数据。小文件可能由 Vite 内联；大文件通常生成带哈希的资源文件。仅仅放入目录且未被引用的文件不会自动进入构建。

外部文档按 `docs/external/<source>/` 存放。目录位于源码之外，不作为 Vite 构建入口；应用代码不得导入这些文件，也不要将其移入 `public/` 或添加复制规则。`tsconfig` 的检查范围不决定 Vite 是否打包文件，构建边界以入口、实际依赖和复制配置为准。

## 许可边界

根目录 [`LICENSE`](../../LICENSE) 用于项目原创内容。第三方资源与外部文档保留原权利人、原许可证或授权条件，不因出现在 GPL 项目中而被重新许可。项目编写的目录说明和模板仍遵循项目许可证。

两个外部内容目录均提供登记模板；加入内容前复制为来源目录中的 `ATTRIBUTION.md` 并补全信息。发布资源时按原条款附带署名和许可文本；开发用文档不随应用发布。完整说明见 [`THIRD_PARTY_NOTICES.md`](../../THIRD_PARTY_NOTICES.md)。
