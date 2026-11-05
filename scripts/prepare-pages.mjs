import { copyFile, mkdir, readdir, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");
const index = join(dist, "index.html");

// Pages 按目录提供入口，直接访问或刷新工具路由不依赖服务器回退。
for (const route of ["recipes", "weapon-manuals", "printer", "requirements"]) {
  const directory = join(dist, route);
  await mkdir(directory, { recursive: true });
  await copyFile(index, join(directory, "index.html"));
}
await copyFile(index, join(dist, "404.html"));
await writeFile(join(dist, ".nojekyll"), "");

// 随构建产物保留项目许可及游戏素材声明，不发布开发参考文档。
for (const name of ["LICENSE", "THIRD_PARTY_NOTICES.md"]) {
  await copyFile(join(root, name), join(dist, name));
}
await mkdir(join(dist, "third-party"), { recursive: true });
const imageSources = join(root, "src/assets/third-party/items");
for (const source of await readdir(imageSources, { withFileTypes: true })) {
  if (!source.isDirectory()) continue;
  await copyFile(
    join(imageSources, source.name, "ATTRIBUTION.md"),
    join(dist, "third-party", `${source.name}.md`),
  );
}
