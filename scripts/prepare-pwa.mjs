import { createHash } from "node:crypto";
import { readFile, readdir, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";
import sharp from "sharp";

const buildMeta = /<meta name="dmz-tools-build" content="[^"]*"\s*\/?>/g;

function normalizeBase(value) {
  if (!value.startsWith("/") || value.startsWith("//") || /[?#\\]/.test(value)) {
    throw new Error("PWA base must be an absolute URL path.");
  }
  const url = new URL(value, "https://dmz-tools.invalid");
  if (url.pathname !== value) throw new Error("PWA base must use a normalized URL path.");
  return value.endsWith("/") ? value : value + "/";
}

async function listFiles(directory, prefix = "") {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.name.startsWith(".")) continue;
    const relative = prefix + entry.name;
    if (entry.isDirectory()) {
      files.push(...(await listFiles(join(directory, entry.name), relative + "/")));
    } else if (entry.isFile() && relative !== "sw.js" && !relative.endsWith(".map")) {
      files.push(relative);
    }
  }
  return files.sort();
}

function resourceUrl(base, relative) {
  return base + relative.split("/").map(encodeURIComponent).join("/");
}

/** 在 Vite 和 prepare-pages 完成后调用；不打包或发布开发参考资料。 */
export async function preparePwa({ base = "/", dist = resolve("dist") } = {}) {
  base = normalizeBase(base);
  const template = await readFile(new URL("./service-worker.js", import.meta.url), "utf8");
  const svg = await readFile(new URL("../public/pwa-icon.svg", import.meta.url));
  for (const size of [192, 512, 180]) {
    const png = await sharp(svg).resize(size, size).png().toBuffer();
    await writeFile(
      join(dist, size === 180 ? "apple-touch-icon.png" : `pwa-icon-${size}.png`),
      png,
    );
    if (size === 512) await writeFile(join(dist, "pwa-icon-512-maskable.png"), png);
  }
  const manifest = {
    id: "./",
    name: "DMZ 工具箱",
    short_name: "DMZ 工具",
    description: "蓝图解锁跟踪、3D 打印计算、需求跟踪与干员特性树",
    lang: "zh-CN",
    start_url: "./",
    scope: "./",
    display: "standalone",
    background_color: "#f7f8fa",
    theme_color: "#2354de",
    icons: [
      { src: "pwa-icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "pwa-icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      {
        src: "pwa-icon-512-maskable.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
  await writeFile(
    join(dist, "manifest.webmanifest"),
    JSON.stringify(manifest, undefined, 2) + "\n",
  );

  const files = await listFiles(dist);
  if (!files.includes("index.html")) throw new Error("PWA build requires dist/index.html.");
  const contents = new Map();
  const digest = createHash("sha256").update(base).update("\0").update(template);
  for (const file of files) {
    let content = await readFile(join(dist, file));
    if (file.endsWith(".html")) {
      content = Buffer.from(content.toString("utf8").replace(buildMeta, ""));
    }
    contents.set(file, content);
    digest.update(file).update("\0").update(content).update("\0");
  }
  // build-id 不参与自己的摘要；相同构建重复执行保持一致。
  const buildId = digest.digest("hex").slice(0, 24);
  const navigation = {};
  const entries = [];
  for (const file of files) {
    let content = contents.get(file);
    if (file.endsWith(".html")) {
      const html = content.toString("utf8");
      if (!html.includes("</head>")) throw new Error(`Missing </head> in ${file}.`);
      content = Buffer.from(
        html.replace("</head>", `<meta name="dmz-tools-build" content="${buildId}"></head>`),
      );
      await writeFile(join(dist, file), content);
    }
    const url = resourceUrl(base, file);
    entries.push({
      url,
      integrity: "sha256-" + createHash("sha256").update(content).digest("base64"),
      // Vite 的内容 hash 文件可复用 HTTP 缓存；固定文件名必须重新验证版本。
      immutable: file.startsWith("assets/") && /-[A-Za-z0-9_-]{8,}\.[^/]+$/.test(file),
    });
    if (file === "index.html") {
      navigation[base] = url;
      navigation[url] = url;
    } else if (file.endsWith("/index.html")) {
      const route = resourceUrl(base, file.slice(0, -"index.html".length));
      navigation[route] = url;
      navigation[route.slice(0, -1)] = url;
      navigation[url] = url;
    }
  }
  const config = {
    base,
    buildId,
    cachePrefix: `dmz-tools-pwa:${encodeURIComponent(base)}:`,
    files: entries,
    navigation,
    fallback: resourceUrl(base, files.includes("404.html") ? "404.html" : "index.html"),
  };
  await writeFile(
    join(dist, "sw.js"),
    template.replace("__DMZ_PWA_CONFIG__", JSON.stringify(config)),
  );
  return { base, buildId, files: entries.length };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const { values } = parseArgs({
    options: { base: { type: "string", default: "/" }, dist: { type: "string" } },
  });
  const result = await preparePwa(values);
  console.log(`PWA: ${result.files} files, ${result.base}, build ${result.buildId}`);
}
