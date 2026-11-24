import assert from "node:assert/strict";
import { mkdir, mkdtemp, readdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { pathToFileURL } from "node:url";
import sharp from "sharp";
import { build } from "vite";
import { perkAtlas } from "../scripts/perk-atlas.mjs";

test("特性图集在多个来源间对应正确的图块，保留透明间距，图像改变会更新缓存地址", async () => {
  const root = await mkdtemp(join(tmpdir(), "dmz-perk-atlas-"));
  try {
    const sources = join(root, "src/assets/third-party/perks");
    for (const dir of ["first", "second"]) await mkdir(join(sources, dir), { recursive: true });
    const entry = join(root, "entry.js");
    await writeFile(entry, 'export * from "virtual:perk-atlas";');
    const writeIcon = (name, color) =>
      sharp({ create: { width: 20, height: 20, channels: 4, background: color } })
        .png()
        .toFile(join(sources, name));
    await writeIcon("first/red.png", "#ff0000");
    const urls = [];
    for (const [i, color] of ["#0000ff", "#00ff00"].entries()) {
      await writeIcon("second/other.png", color);
      const outDir = join(root, "build-" + i);
      await build({
        configFile: false,
        root,
        base: "/DMZ-tools/",
        logLevel: "silent",
        plugins: [perkAtlas()],
        build: {
          outDir,
          lib: { entry, formats: ["es"], fileName: () => "entry.mjs" },
          rolldownOptions: { output: { assetFileNames: "assets/[name]-[hash][extname]" } },
        },
      });
      const { names, columns, rows, url } = await import(
        pathToFileURL(join(outDir, "entry.mjs")).href
      );
      const images = await readdir(join(outDir, "assets"));
      assert.equal(images.length, 1);
      assert.equal(url, "/DMZ-tools/assets/" + images[0]);
      assert.match(images[0], /^perk-atlas-.+\.webp$/);
      urls.push(url);
      assert.deepEqual([columns, rows], [2, 1]);
      assert.deepEqual([...names].sort(), ["other", "red"]);
      const { data, info } = await sharp(join(outDir, "assets", images[0]))
        .ensureAlpha()
        .raw()
        .toBuffer({ resolveWithObject: true });
      const cell = info.width / columns;
      assert.equal(info.height, cell);
      const pixel = (x, y) => [
        ...data.subarray((y * info.width + x) * 4, (y * info.width + x + 1) * 4),
      ];
      for (const [index, name] of names.entries()) {
        const center = cell / 2;
        const expected = name === "red" ? [255, 0, 0] : i === 0 ? [0, 0, 255] : [0, 255, 0];
        assert.deepEqual(pixel(index * cell + center, center), [...expected, 255]);
        assert.equal(pixel(index * cell, center)[3], 0);
      }
    }
    assert.notEqual(urls[0], urls[1]);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
