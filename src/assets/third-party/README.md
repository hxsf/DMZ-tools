# 第三方资源

这里存放应用使用的第三方图片、图标等外部资源，优先按类别和来源分组。例如游戏物品图片：

```text
src/assets/third-party/
└── items/
    └── <source>/
        ├── ATTRIBUTION.md
        ├── LICENSE.txt         # 保留原文件名称与内容，如来源提供
        └── item.png
```

资源版权、商标及其他权利归原权利人所有，适用原许可证或具体授权条件，**不继承项目的 GPL v3 许可证**。复制、裁剪、格式转换或 Vite 打包不改变其归属。本项目编写的目录说明和登记模板仍遵循项目许可证。

新增资源时，从 [`ATTRIBUTION.template.md`](ATTRIBUTION.template.md) 创建来源目录的 `ATTRIBUTION.md`，记录对应文件、原权利人、来源 URL、版本或获取日期、许可与修改情况，并保留原版权和许可文件。确认原条款允许本项目所需的使用与分发；未知信息应标注“待确认”，本说明本身不构成授权。

应用通过静态 `import` 或限定图片扩展名的 `import.meta.glob` 引用资源，由 Vite 生成构建后的 URL。未被引用的文件不会自动打包；小文件可能内联。不要把应用使用的这类资源放到 `public/`，以免绕过 Vite 的资源处理。

署名登记和许可文件不应作为图片导入。Vite 不会自动将相邻声明一同发布；加入实际资源时，按原条款安排产物中的署名和许可文本。开发用外部资料放在 [`docs/external/`](../../../docs/external/README.md)。

当前尚未收录实际第三方资源。全局声明见 [`THIRD_PARTY_NOTICES.md`](../../../THIRD_PARTY_NOTICES.md)。
