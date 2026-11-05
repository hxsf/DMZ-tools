# 目录设计

## 源码职责

项目按技术职责组织模块，目录内先平铺文件。`src/main.tsx` 负责挂载，`src/App.tsx` 负责布局与工具导航，`src/router.tsx` 使用 preact-iso 声明路径和懒加载页面。

| 位置              | 职责                                                           |
| ----------------- | -------------------------------------------------------------- |
| `src/views/`      | 页面入口，配方、武器手册、打印计算器、需求清单各一个 View 文件 |
| `src/components/` | 界面组件，当前包含公共导航                                     |
| `src/types/`      | 跨模块类型，独立于 Preact 和 Signals                           |
| `src/stores/`     | 用 @preact/signals 管理库存、解锁和计划，提供修改操作          |
| `src/data/`       | 游戏资料样本、来源、资料版本和待核实信息                       |
| `src/storage.ts`  | 用户存档校验及显式异步加载、保存，存储与响应式状态分离         |
| `src/kv.ts`       | 异步 KV 的浏览器实现，封装 localStorage 访问                   |
| `src/styles/`     | 全局样式                                                       |

首版只包括打印配方和武器手册的解锁跟踪，不包含武器外观蓝图。当前 View 为公共框架占位，状态与存储模块尚未接入页面。共享用户状态按数据职责区分，多个页面共用库存。弹窗、输入草稿等临时状态留在组件内。

后续材料汇总、配方展开等纯计算放在 `src/calculations/`，由 store 的 computed 或页面调用。尚未实现的模块不预建空目录。路由采用 History 路径，生产静态服务器应将未命中文件的页面请求回退到 `index.html`。

游戏资料与个人记录分开保存，更新配方资料时保留用户的解锁状态、库存和计划。需求汇总应保留每项材料对应的目标，同一份库存只抵扣一次。打印计划的修改本身不扣库存；配方解锁、打印能力和材料足够也分别判断。

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

第三方资源建议按 `资源类别/来源/文件` 存放，例如 `src/assets/third-party/items/<source>/`。每个来源目录保存对应的 `ATTRIBUTION.md` 与原许可证，便于追踪单个文件的出处。

在业务代码中引用图片时，使用静态 `import`，例如：

```tsx
// 假设文件位于 src/components/ItemIcon.tsx，且已加入获得授权的图片。
import itemIconUrl from "../assets/third-party/items/example-source/item.png";

export function ItemIcon() {
  return <img src={itemIconUrl} alt="物品名称" />;
}
```

批量资源可使用带明确图片扩展名的 `import.meta.glob`，不要对整个第三方目录使用不受限制的通配符，以免将署名和许可说明当成运行时数据。小文件可能由 Vite 内联；大文件通常生成带哈希的资源文件。仅仅放入目录且未被引用的文件不会自动进入构建。

外部文档按 `docs/external/<source>/` 存放。目录位于源码之外，不作为 Vite 构建入口；应用代码不得导入这些文件，也不要将其移入 `public/` 或添加复制规则。`tsconfig` 的检查范围不决定 Vite 是否打包文件，构建边界以入口、实际依赖和复制配置为准。

## 许可边界

根目录 [`LICENSE`](../../LICENSE) 用于项目原创内容。第三方资源与外部文档保留原权利人、原许可证或授权条件，不因出现在 GPL 项目中而被重新许可。项目编写的目录说明和模板仍遵循项目许可证。

两个外部内容目录均提供登记模板；加入内容前复制为来源目录中的 `ATTRIBUTION.md` 并补全信息。发布资源时按原条款附带署名和许可文本；开发用文档不随应用发布。完整说明见 [`THIRD_PARTY_NOTICES.md`](../../THIRD_PARTY_NOTICES.md)。
