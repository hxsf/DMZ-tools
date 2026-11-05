# 外部参考文档

这里存放开发过程中查阅的第三方手册、数据格式说明和其他外部文档。目录按来源组织：

```text
docs/external/
└── <source>/
    ├── ATTRIBUTION.md
    ├── LICENSE.txt             # 保留原文件名称与内容，如来源提供
    └── reference.pdf
```

文档内容的版权归原权利人所有，适用原许可证或具体授权条件，**不继承项目的 GPL v3 许可证**。本项目编写的目录说明和登记模板仍遵循项目许可证。

新增文档时，从 [`ATTRIBUTION.template.md`](ATTRIBUTION.template.md) 创建来源目录的 `ATTRIBUTION.md`，填写权利人、来源、版本或日期、许可及修改记录，并保留原始声明。若原条款不允许复制入仓库，可仅记录来源链接。授权不明时标记“待确认”，不将目录声明视为授权。

本目录仅用于开发查阅：不得从应用源码导入，不放入 `public/`，不设置复制到 `dist/` 的规则。Vite 当前不会将本目录作为构建入口。需要在运行时展示的外部图片等文件应放在 [`src/assets/third-party/`](../../src/assets/third-party/README.md) 并分别登记。

当前已登记 [MW4 DMZ 参考来源](mw4-dmz/ATTRIBUTION.md)，仅保存链接和项目说明，未复制原文。全局声明见 [`THIRD_PARTY_NOTICES.md`](../../THIRD_PARTY_NOTICES.md)。
