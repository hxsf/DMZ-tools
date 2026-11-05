# DMZ Tools

基于 Preact、TypeScript / TSX 和 Vite 的 DMZ 工具集合，提供配方与武器手册解锁跟踪、3D 打印需求计算器和需求跟踪器。默认中文，支持英文；采用紧凑白底蓝色工作台，PC 顶部导航、手机底部导航，不重复显示页面大标题。

- 手动标记 32 种武器手册和 10 项打印配方，支持搜索、分类与状态筛选，类别可折叠。
- 按目标成品数量计算直接材料，不递归展开配方。来源产量未知时需显式填写单次产量，材料冲突不会自动采用某个说法。
- 从计算器加入打印目标，在需求页完成、恢复或移除；同种材料先汇总，再抵扣一次共享库存。不提供自由搜集或额外的材料储备工具。
- 用户记录保存到浏览器本地，后续可通过异步 KV 接口替换存储实现。首版不包含武器外观蓝图。

## 开发

建议使用 Node.js 24 和 npm 11。依赖版本由 `package-lock.json` 固定。

```bash
npm ci
npm run dev
```

```bash
npm run typecheck     # tsrs --fast 严格类型检查
npm run lint          # Oxlint 检查
npm run format:check  # Oxfmt 格式检查
npm test              # 资料引用、材料计算与状态/存档边界检查
npm run build         # 类型检查与生产构建，产物位于 dist/
npm run preview       # 本地预览生产构建
```

Vite 使用 Rolldown 打包、Oxc 转换与压缩；Preact 提供界面。类型检查由 tsrs 单独执行。tsrs 当前为 beta 版本，新增复杂类型用法时应验证其诊断结果。

`lint` 脚本沿用当前 Linux 环境的 POSIX 环境变量写法，并使用 `tsrs-lint` 后端；Windows 环境尚未验证。

## GitHub Pages 部署

[Pages 工作流](.github/workflows/pages.yml) 在推送 `main` 或从 `main` 手动运行时，检查、构建并把 `dist/` 发布到同仓库的 `pages` 分支。`pages` 是与源码没有共同历史的孤立分支；每次只保留最新构建提交，不合并回源码分支。

首次配置：

1. 将代码和工作流推送到 `main`，等 `Publish Pages branch` 完成，自动创建 `pages` 分支。
2. 在仓库 **Settings → Pages** 选择 **Deploy from a branch → pages → /(root)** 并保存。
3. 再运行一次工作流；之后推送 `main` 即可自动更新。

工作流使用内置 `GITHUB_TOKEN` 的 `contents: write` 和 `pages: write` 权限，不需要额外 PAT。它发布分支后会显式请求 Pages 构建，避免仅推送分支却未更新站点；首次尚未启用 Pages 时只生成分支并提示配置，不修改仓库设置。`pages` 是自动生成分支，不应手动维护或限制此工作流的强制推送。

默认站点地址为 <https://hxsf.github.io/DMZ-tools/>。本地验证部署产物：

```bash
npm run build:pages
npm run preview -- --base=/DMZ-tools/
```

构建使用 `/DMZ-tools/` 作为资源和路由前缀，为四个工具生成独立的静态入口，直接访问或刷新子页面也能打开。产物包含 `.nojekyll`、`404.html`、项目许可与游戏图片版权声明，不包含源码、开发文档或个人存档。普通 `npm run dev` / `npm run build` 保持根路径。

GitHub 规则参考：[分支发布与自动构建](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)、[请求 Pages 构建 API](https://docs.github.com/en/rest/pages/pages#request-a-github-pages-build)。

## 目录结构

```text
DMZ-tools/
├── src/
│   ├── main.tsx                 # 应用入口
│   ├── App.tsx                  # 顶层界面与工具导航
│   ├── router.tsx               # preact-iso 路由与页面懒加载
│   ├── context.tsx              # 公共 AppState 上下文
│   ├── i18n.ts                  # 中英文界面初始化
│   ├── vite-env.d.ts            # Vite 客户端与资源类型
│   ├── views/                   # 各工具的页面入口，直接放 View 文件
│   ├── components/              # 界面组件
│   ├── types/                   # 物品、配方、来源、用户记录等类型
│   ├── stores/                  # Signals 用户状态与修改操作
│   ├── calculations/            # 直接材料与共享库存计算
│   ├── data/                    # 带来源与确认状态的资料样本
│   ├── locales/                 # 中英文界面文案
│   ├── storage.ts               # 存档校验、异步读取与保存
│   ├── kv.ts                    # AsyncKV 的浏览器 localStorage 实现
│   ├── styles/                  # 全局样式
│   └── assets/
│       └── third-party/        # 外部图片等资源，引用后进入 Vite 构建
│           └── items/          # 游戏物品图片，继续按来源分目录
├── public/                     # 需原样复制的自有静态文件
├── docs/
│   ├── development/            # 项目自编的设计与开发文档
│   └── external/               # 外部参考资料，仅开发查阅
├── tests/                      # 数据与公共模块的行为检查
├── scripts/                    # 开发检查脚本
├── index.html
├── vite.config.ts
├── tsconfig.json
├── package.json
├── package-lock.json
├── THIRD_PARTY_NOTICES.md       # 第三方内容与项目许可的边界
└── LICENSE                     # 项目许可证：GNU GPL v3
```

按技术职责划分目录，同一目录内的文件先平铺。目录约定见 [目录设计](docs/development/architecture.md)，资料状态和类型边界见 [数据模型](docs/development/data-model.md)。`node_modules/` 与 `dist/` 为本地生成目录，不提交到版本库。

资料保存在 `src/data/`，已接入各工具。当前收录数量表示本次来源覆盖，不代表所有版本的完整物品库。来源有记载不代表当前版本游戏实测，成本冲突和未知产量均显式保留。用户填写的单次产量保存在制作目标的 `outputPerCraft` 字段；游戏资料与个人存档分开，更新资料不会修改个人记录。

用户存档通过 `src/types/storage.ts` 的 `AsyncKV` 接口读写，使用 `ts-results-es` 的 `Result` 表达成功或错误、`Option` 表达读取值存在或缺失。当前使用 localStorage，保留 `dmz-tools:user` 键与版本 1 存档。AppState 显式加载，用户操作触发串行保存；读取失败不会被当成空存档覆盖。后续远端实现可通过同一接口注入。

## 第三方内容

| 内容                         | 位置                                                          | 构建行为                                                                 |
| ---------------------------- | ------------------------------------------------------------- | ------------------------------------------------------------------------ |
| 游戏物品图片等外部资源       | [`src/assets/third-party/`](src/assets/third-party/README.md) | 通过 `import`、`import.meta.glob` 等被代码引用后，由 Vite 处理并进入产物 |
| 外部手册、数据说明、参考文档 | [`docs/external/`](docs/external/README.md)                   | 仅供开发查阅，不导入应用、不放入 `public/`，不进入生产产物               |

项目原创代码和自编文档使用根目录 [LICENSE](LICENSE)。上述两个目录中的**第三方内容版权归原权利人所有，保留各自原许可证或授权条件，不继承项目许可证**；收录、转换或打包均不改变其归属。目录内由本项目编写的说明和模板仍遵循项目许可证。

当前收录 26 张真实游戏图片（18 张资源或物品、8 张武器），通过 [`src/data/images.ts`](src/data/images.ts) 显式引用，来源逐项记录在 [图片署名登记](src/assets/third-party/items/dmzhub/ATTRIBUTION.md)。未收集到图片的物品只显示名称，不使用生成图或替代图。

加入外部内容时，按来源附带 `ATTRIBUTION.md` 和原版权、许可文件；声明与登记模板不构成素材授权。具体约定见 [第三方内容声明](THIRD_PARTY_NOTICES.md)。
