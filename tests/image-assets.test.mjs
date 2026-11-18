import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { basename, join, relative } from "node:path";
import { pathToFileURL } from "node:url";
import { test } from "node:test";
import sharp from "sharp";
import { build } from "vite";
import { gameImageAssets, optimizeGameImage } from "../scripts/image-assets.mjs";

async function webp(width, height, background) {
  return sharp({ create: { width, height, channels: 4, background } })
    .webp({ lossless: true, effort: 6 })
    .toBuffer();
}

test("构建裁边只去除全透明区域，保留半透明边缘且不放大小图", async () => {
  const width = 30;
  const height = 20;
  const rgba = Buffer.alloc(width * height * 4);
  for (let y = 4; y < 16; y += 1) {
    for (let x = 5; x < 25; x += 1) {
      rgba.set([220, 180, 90, 255], (y * width + x) * 4);
    }
  }
  rgba.set([220, 180, 90, 1], (4 * width + 4) * 4);
  rgba[(15 * width + 24) * 4 + 3] = 64;
  const source = await sharp(rgba, { raw: { width, height, channels: 4 } })
    .webp({ lossless: true, exact: true })
    .toBuffer();
  const before = Buffer.from(source);
  const optimized = await optimizeGameImage(source);
  assert.deepEqual(source, before);
  assert.equal(optimized.width, 21);
  assert.equal(optimized.height, 12);
  assert.equal(optimized.trimmed, true);
  assert.equal(optimized.resized, false);
  const alpha = await sharp(optimized.data).extractChannel("alpha").raw().toBuffer();
  assert.equal(alpha[0], 1);
  assert.equal(alpha.at(-1), 64);
});

test("不裁游戏原有不透明底色；已压缩的小图不会因重新编码增大", async () => {
  const source = await webp(60, 40, { r: 240, g: 240, b: 240, alpha: 1 });
  const optimized = await optimizeGameImage(source);
  assert.equal(optimized.width, 60);
  assert.equal(optimized.height, 40);
  assert.equal(optimized.trimmed, false);
  assert.equal(optimized.resized, false);
  assert.ok(optimized.outputBytes <= source.length);
});

test("方图和横图按显示密度缩小并保持比例", async () => {
  const square = await optimizeGameImage(await webp(512, 512, { r: 80, g: 130, b: 210, alpha: 1 }));
  const wide = await optimizeGameImage(await webp(512, 128, { r: 80, g: 130, b: 210, alpha: 1 }));
  assert.deepEqual([square.width, square.height], [192, 192]);
  assert.deepEqual([wide.width, wide.height], [256, 64]);
  assert.equal(square.resized, true);
  assert.equal(wide.resized, true);
});

test("Vite 输出可独立缓存的内容哈希图片，根路径与 Pages 子路径都正确解析", async () => {
  const temporary = await mkdtemp(join(tmpdir(), "dmz-image-assets-"));
  try {
    const sourceDirectory = join(temporary, "src/assets/third-party/items");
    await mkdir(sourceDirectory, { recursive: true });
    const sourceFile = join(sourceDirectory, "item.webp");
    const entry = join(temporary, "entry.js");
    await writeFile(entry, 'export { default } from "./src/assets/third-party/items/item.webp";\n');
    const filenames = [];
    for (const [index, base] of ["/", "/DMZ-tools/"].entries()) {
      const source = await webp(400, 100, {
        r: index === 0 ? 220 : 30,
        g: 90,
        b: index === 0 ? 30 : 220,
        alpha: 1,
      });
      await writeFile(sourceFile, source);
      const outDir = join(temporary, "build-" + index);
      await build({
        configFile: false,
        root: temporary,
        base,
        logLevel: "silent",
        plugins: [gameImageAssets()],
        build: {
          outDir,
          emptyOutDir: true,
          minify: false,
          lib: { entry, formats: ["es"], fileName: () => "entry.mjs" },
          rolldownOptions: { output: { assetFileNames: "assets/[name]-[hash][extname]" } },
        },
      });
      const entryFile = join(outDir, "entry.mjs");
      const module = await import(pathToFileURL(entryFile).href);
      const url = new URL(module.default, "https://example.test");
      assert.equal(url.origin, "https://example.test");
      assert.ok(url.pathname.startsWith(base + "assets/"));
      const asset = join(outDir, decodeURIComponent(url.pathname.slice(base.length)));
      assert.ok(!relative(outDir, asset).startsWith(".."));
      assert.match(basename(asset), /^item-.+\.webp$/);
      filenames.push(basename(asset));
      const metadata = await sharp(await readFile(asset)).metadata();
      assert.deepEqual([metadata.width, metadata.height], [256, 64]);
      const code = await readFile(entryFile, "utf8");
      assert.ok(!code.includes("data:image"));
      assert.ok(!code.includes("ROLLUP_FILE_URL_"));
      assert.ok(!code.includes("ROLLDOWN_FILE_URL_"));
      assert.deepEqual(await readFile(sourceFile), source);
    }
    assert.notEqual(filenames[0], filenames[1], "图片字节改变时缓存 URL 必须改变");
  } finally {
    await rm(temporary, { recursive: true, force: true });
  }
});
