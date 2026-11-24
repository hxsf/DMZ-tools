import { createHash } from "node:crypto";
import { readdir } from "node:fs/promises";
import { basename, extname, join, resolve, sep } from "node:path";
import sharp from "sharp";

const virtualId = "virtual:perk-atlas";
const moduleId = "\0" + virtualId;
const cell = 96;
const clear = { r: 0, g: 0, b: 0, alpha: 0 };
const iconFile = /\.(png|webp)$/i;

async function assemble(directory) {
  const entries = await readdir(directory, { withFileTypes: true, recursive: true });
  const files = entries
    .filter((entry) => entry.isFile() && iconFile.test(entry.name))
    .map((entry) => join(entry.parentPath, entry.name))
    .sort();
  const names = files.map((path) => basename(path, extname(path)));
  if (!names.length) throw new Error("The perk atlas has no source images.");
  if (new Set(names).size !== names.length) throw new Error("Duplicate perk icon names.");

  const columns = Math.ceil(Math.sqrt(files.length));
  const rows = Math.ceil(files.length / columns);
  // Keep two transparent pixels between adjacent images when the browser downsamples a tile.
  const tiles = await Promise.all(
    files.map(async (file, index) => ({
      input: await sharp(file)
        .resize(cell - 2, cell - 2, { fit: "contain", background: clear })
        .png()
        .toBuffer(),
      left: (index % columns) * cell + 1,
      top: Math.floor(index / columns) * cell + 1,
    })),
  );
  const bytes = await sharp({
    create: { width: columns * cell, height: rows * cell, channels: 4, background: clear },
  })
    .composite(tiles)
    .webp({ lossless: true, effort: 6 })
    .toBuffer();
  return { names, columns, rows, bytes, files };
}

export function perkAtlas() {
  let directory;
  let devPath;
  let snapshot;
  const current = () => (snapshot ??= assemble(directory));
  return {
    name: "dmz-perk-atlas",
    configResolved(config) {
      directory = resolve(config.root, "src/assets/third-party/perks");
      devPath = config.command === "serve" ? config.base + "@dmz/perk-atlas.webp" : undefined;
    },
    buildStart() {
      snapshot = undefined;
    },
    resolveId(id) {
      if (id === virtualId) return moduleId;
    },
    async load(id) {
      if (id !== moduleId) return;
      const { names, columns, rows, bytes, files } = await current();
      this.addWatchFile(directory);
      for (const file of files) this.addWatchFile(file);
      const url = devPath
        ? JSON.stringify(
            devPath + "?v=" + createHash("sha256").update(bytes).digest("hex").slice(0, 12),
          )
        : "import.meta.ROLLUP_FILE_URL_" +
          this.emitFile({ type: "asset", name: "perk-atlas.webp", source: bytes });
      return {
        code: `export const names = ${JSON.stringify(names)};
               export const columns = ${columns}, rows = ${rows}, url = ${url};`,
        moduleType: "js",
      };
    },
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url?.split("?", 1)[0] !== devPath) return next();
        current().then(({ bytes }) => {
          res.setHeader("Content-Type", "image/webp");
          res.end(bytes);
        }, next);
      });
      server.watcher.on("all", (event, path) => {
        if (!["add", "change", "unlink"].includes(event)) return;
        if (!resolve(path).startsWith(directory + sep) || !iconFile.test(path)) return;
        snapshot = undefined;
        const mod = server.moduleGraph.getModuleById(moduleId);
        if (mod) server.moduleGraph.invalidateModule(mod);
        server.ws.send({ type: "full-reload" });
      });
    },
  };
}
