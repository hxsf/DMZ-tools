# DMZ Tools

基于 Preact、TypeScript / TSX 和 Vite 的 DMZ 工具集合。首版规划包含打印配方解锁跟踪、武器手册解锁跟踪、3D 打印需求计算器和需求跟踪器，暂不包含武器外观蓝图。当前提供路由和页面骨架、资料样本、数据类型及独立的状态和存储模块；各工具的交互功能尚未实现。

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
npm test              # 资料引用完整性与状态/存档边界检查
npm run build         # 类型检查与生产构建，产物位于 dist/
npm run preview       # 本地预览生产构建
```

Vite 使用 Rolldown 打包、Oxc 转换与压缩；Preact 提供界面。类型检查由 tsrs 单独执行。tsrs 当前为 beta 版本，新增复杂类型用法时应验证其诊断结果。

`lint` 脚本沿用当前 Linux 环境的 POSIX 环境变量写法，并使用 `tsrs-lint` 后端；Windows 环境尚未验证。

## 目录结构

```text
DMZ-tools/
├── src/
│   ├── main.tsx                 # 应用入口
│   ├── App.tsx                  # 顶层界面与工具导航
│   ├── router.tsx               # preact-iso 路由与页面懒加载
│   ├── vite-env.d.ts            # Vite 客户端与资源类型
│   ├── views/                   # 各工具的页面入口，直接放 View 文件
│   ├── components/              # 界面组件
│   ├── types/                   # 物品、配方、来源、用户记录等类型
│   ├── stores/                  # Signals 用户状态与修改操作
│   ├── data/                    # 带来源与确认状态的资料样本
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

资料样本保存在 `src/data/`，当前未接入页面。来源有记载不代表当前版本已在游戏中实测，成本冲突和未知产量均显式保留。游戏资料与个人存档分开，更新样本不会修改个人记录。

用户存档通过 `src/types/storage.ts` 的 `AsyncKV` 接口读写，使用 `ts-results-es` 的 `Result` 表达成功或错误、`Option` 表达读取值存在或缺失。当前浏览器实现沿用 localStorage 与现有存档格式；后续远端实现可通过同一接口注入 `loadSnapshot` / `saveSnapshot`。两个操作均需 `await`，存储访问失败不会被当成空存档。当前尚未接入页面或自动保存。

## 第三方内容

| 内容                         | 位置                                                          | 构建行为                                                                 |
| ---------------------------- | ------------------------------------------------------------- | ------------------------------------------------------------------------ |
| 游戏物品图片等外部资源       | [`src/assets/third-party/`](src/assets/third-party/README.md) | 通过 `import`、`import.meta.glob` 等被代码引用后，由 Vite 处理并进入产物 |
| 外部手册、数据说明、参考文档 | [`docs/external/`](docs/external/README.md)                   | 仅供开发查阅，不导入应用、不放入 `public/`，不进入生产产物               |

项目原创代码和自编文档使用根目录 [LICENSE](LICENSE)。上述两个目录中的**第三方内容版权归原权利人所有，保留各自原许可证或授权条件，不继承项目许可证**；收录、转换或打包均不改变其归属。目录内由本项目编写的说明和模板仍遵循项目许可证。

加入外部内容时，按来源附带 `ATTRIBUTION.md` 和原版权、许可文件。当前仅收集少量事实和参考链接，尚未复制第三方原文或图片；声明与登记模板不构成素材授权。具体约定见 [第三方内容声明](THIRD_PARTY_NOTICES.md)。
