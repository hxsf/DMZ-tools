# 项目约定

本文件记录已经确认的技术与产品决策。依赖版本以 `package.json` 和锁文件为准，目录与数据设计细节见 `docs/development/`。

## 产品范围

- 项目是 DMZ 工具集合：打印配方与武器手册解锁跟踪、3D 打印需求计算器、需求跟踪器。首版不包含武器外观蓝图。
- 解锁由用户手动标记。获取条件仅作可选参考，缺少条件不妨碍收录或勾选，不按等级自动推断已解锁。
- 当前收录 32 种武器手册和 95 项打印配方（9 类），共 175 个物品记录：111 项物品 / 材料、32 把武器、32 份手册。提供搜索、分类、解锁状态筛选及可折叠分组；数量表示本次来源目录覆盖，`catalog.coverage` 仍为 `sample`，不代表全游戏或跨版本全量。
- 9 组 34 档永久升级仅保存为开发参考，尚未接入资料目录、解锁界面或需求计算，不宣称已支持升级跟踪。
- 计算器只计算直接材料，不递归展开配方。来源缺少单次产量时，用户显式填写 `outputPerCraft`，随制作目标保存，不改写公共资料。
- 需求页仅接受计算器加入的打印目标，提供完成、恢复和移除。相同材料汇总后，共享库存只抵扣一次；不扩展自由搜集、材料储备等额外工具。
- 游戏资料、用户记录和派生计算分离。更新名称或资料不改变稳定 ID，也不改写用户进度。
- 界面采用清爽紧凑的白底蓝色工作台。PC 顶部导航、手机底部导航，不重复显示页面大标题；类别可折叠，兼顾键盘与触控。

## 技术与目录

- 使用 Preact、TypeScript / TSX、Vite；`preact-iso` 管理路由和页面懒加载，`@preact/signals` 管理共享状态。
- 沿用 Vite 的 Oxc 转换与压缩、Rolldown 打包，以及 `@prefresh/vite` 配置。类型检查用 tsrs，检查与格式化用 Oxlint / Oxfmt，不另加 Babel、esbuild 或替代类型检查链路。
- 源码按技术职责组织，目录内先平铺文件：`views/` 放页面入口，`components/` 放组件，`types/` 放类型，`stores/` 放状态与操作，`data/` 放资料。
- 不增加 `domain/`、`features/` 等抽象层级，也不为每个具体工具建立一套目录。尚未使用的模块不预建空目录。
- `main.tsx` 负责挂载，`App.tsx` 负责布局，`router.tsx` 负责路由；`storage.ts` 负责存档校验和加载保存，`kv.ts` 提供存储适配器。
- `context.tsx` 提供公共 AppState；`stores/app.ts` 协调显式加载和串行保存，`calculations/` 放不依赖 UI 的直接材料计算。
- 类型独立于 Preact 与 Signals；静态资料使用 `satisfies` 检查。公共 store 由工厂创建，组件临时状态留在组件内。

## 国际化

- 已安装并初始化 `i18next` + `react-i18next`，通过 `preact/compat` 接入；入口在 `i18n.ts`，界面翻译在 `locales/`。
- JSX 中的可见文案统一使用 `<Trans>`，普通文本与富文本均适用。`placeholder`、`title`、`aria-label` 等属性及其他需要字符串的场景使用 `t()`。
- `<Trans>` 本身不订阅语言变化；组件通过 `useTranslation()` 获取翻译函数并订阅更新，必要时将 `t` 传给 `<Trans>`。
- 默认语言为 `zh-CN`，已提供 `en` 界面翻译。按完整句子翻译，插值使用参数，不拼接零散译文；数字和日期使用 `Intl`。
- 游戏名称放在资料中，界面文案放在翻译资源中。名称保留英文、中文来源和搜索别名，中文缺失时回退英文；32 把武器中文名已按用户提供的客户端截图核对，旧官方博客名保留为别名。其他物品的官方博客用名仍不等于已核对客户端。

## Result、Option 与存储

- 统一使用已有的 `ts-results-es` 提供 `Result<T, E>` 与 `Option<T>`，配合标准 `async/await`。新增运行时缺失值优先表达为 Option，尽量少用 `null`。
- `AsyncKV.get` 返回 `Promise<Result<Option<string>, KVError>>`；`set` 与 `delete` 返回 `Promise<Result<void, KVError>>`。
- `Ok(Some(value))` 表示存在，`Ok(None)` 表示键不存在，`Err(error)` 表示访问失败。`Some("")` 是有效存在的空字符串，不能当成 None；删除不存在的键视为成功。
- 外部 API 的同步异常和异步失败在适配器边界转换为 Err，不用异常或 Promise rejection 表达 KV 访问失败。错误保留操作、键与原始 `cause`，界面按错误码翻译。
- 调用方使用 `map`、`mapErr`、`andThen`、`mapOr` 或显式分支组合结果，不用 `unwrap()` 将可处理错误重新变成异常。
- 当前浏览器适配器使用 localStorage，并在实际操作时才访问它。其底层仍是同步 API；后续远端实现替换 AsyncKV，业务层不直接访问浏览器或网络存储。
- 保留版本 1 存档、`dmz-tools:user` 键及现有 JSON 格式；Option、Result、Signals 和派生值不写入存档。现有 JSON 中的 `null` 不做无迁移的批量替换。
- 加载时区分有效、缺失、损坏、不支持版本和访问失败。失败不能用默认空存档覆盖；校验失败不触发写入。
- 保存显式调用并 `await` 完成，连续保存应串行执行。只有底层成功完成写入才能报告成功；读取存档、创建 store 或导入模块不触发自动保存。
- AppState 在有效恢复或确认存档不存在后才允许保存；用户操作显式调用 `persist()` 入队，调用时固定快照，界面按实际加载、保存结果显示状态。

## 资料与版权

- 游戏事实保留来源；未知和冲突显式表达，不把缺失成本当成零、缺失产量当成一，也不把来源记载当成当前版本游戏实测。
- 第三方图片等资源放在 `src/assets/third-party/`，通过显式引用交给 Vite 处理；来源目录保存署名和许可信息。
- 当前使用 143 张真实游戏图片（111 张物品 / 材料、32 张武器），由 `src/data/images.ts` 映射；DMZHub 119 张、DMZTracker 23 张、MW4Field 1 张，来源逐项登记在对应 `ATTRIBUTION.md`。手册使用对应武器图片；未收集到图片的物品只显示名称，不使用生成图或替代图。
- 外部参考文档放在 `docs/external/`，只用于开发查阅，不导入应用、不放进 `public/`、不复制到构建产物。
- 第三方资源和外部文档版权及许可归原权利人，不继承项目 GPL 许可证。项目自写代码、说明和模板遵循项目许可证；细节见 `THIRD_PARTY_NOTICES.md`。

## 部署

- GitHub Actions 在推送 `main` 或从 `main` 手动运行时直接部署 Pages。`build` 任务构建 `dist/` 并通过 `actions/upload-pages-artifact` 上传，`deploy` 任务使用 `actions/deploy-pages` 发布到 `github-pages` 环境；不使用 `pages` 分支。
- 用户在 Settings → Pages → Source 选择 `GitHub Actions`；工作流不自动修改仓库设置。使用内置 `GITHUB_TOKEN`，无需额外 PAT；构建仅需 `contents: read`，部署使用 `pages: write` 与 `id-token: write`。
- `npm run build:pages` 使用 `/DMZ-tools/` 前缀；应用路由和链接统一使用 `appPath()`。构建后生成各工具的静态入口、`404.html`、`.nojekyll` 并携带版权声明。普通本地构建仍使用根路径。

## 检查

按改动运行相关检查。类型与行为变更应验证相应边界；测试复用现有 Node / Vite 流程。

```bash
npm run typecheck
npm run lint
npm run format:check
npm test
npm run build
```

`npm run build` 已包含类型检查。格式化使用项目脚本以保留忽略规则，避免改写第三方文件和外部文档。
