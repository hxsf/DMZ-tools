import { readFile } from "node:fs/promises";
import { basename } from "node:path";
import sharp from "sharp";

/** Only fully transparent pixels may be removed; opaque borders are game artwork. */
async function visibleBounds(source, metadata) {
  const full = { left: 0, top: 0, width: metadata.width, height: metadata.height };
  if (!metadata.hasAlpha) return full;

  const alpha = await sharp(source).extractChannel("alpha").raw().toBuffer();
  let left = metadata.width;
  let top = metadata.height;
  let right = -1;
  let bottom = -1;
  for (let y = 0; y < metadata.height; y += 1) {
    for (let x = 0; x < metadata.width; x += 1) {
      if (alpha[y * metadata.width + x] === 0) continue;
      left = Math.min(left, x);
      top = Math.min(top, y);
      right = Math.max(right, x);
      bottom = Math.max(bottom, y);
    }
  }
  if (right < left) return full;
  return { left, top, width: right - left + 1, height: bottom - top + 1 };
}

/** Build derivatives only. The source buffer and repository file are never modified. */
export async function optimizeGameImage(input) {
  const source = Buffer.from(input);
  const metadata = await sharp(source).metadata();
  const original = {
    data: source,
    originalBytes: source.length,
    outputBytes: source.length,
    width: metadata.width,
    height: metadata.height,
    trimmed: false,
    resized: false,
  };
  // Do not flatten an animation or reinterpret an EXIF-oriented source.
  if (
    metadata.format !== "webp" ||
    !metadata.width ||
    !metadata.height ||
    (metadata.pages ?? 1) > 1 ||
    (metadata.orientation ?? 1) !== 1
  ) {
    return original;
  }

  const bounds = await visibleBounds(source, metadata);
  const trimmed = bounds.width !== metadata.width || bounds.height !== metadata.height;
  // 192 px covers square icons at 3x DPR; wide artwork gets 256 px without stretching.
  const maxWidth = bounds.width / bounds.height >= 1.5 ? 256 : 192;
  const pipeline = sharp(source).extract(bounds).resize({
    width: maxWidth,
    height: 192,
    fit: "inside",
    withoutEnlargement: true,
  });
  const candidates = await Promise.all([
    pipeline.clone().webp({ quality: 85, alphaQuality: 100, effort: 6 }).toBuffer({
      resolveWithObject: true,
    }),
    pipeline.clone().webp({ lossless: true, effort: 6 }).toBuffer({
      resolveWithObject: true,
    }),
  ]);
  const candidate = candidates.reduce((best, current) =>
    current.data.length < best.data.length ? current : best,
  );
  const resized = candidate.info.width !== bounds.width || candidate.info.height !== bounds.height;
  // Existing small WebP files can already be better compressed. Keep those bytes.
  // If the canvas changed, compare the two encodings of that same trimmed/resized canvas.
  if (!trimmed && !resized && source.length <= candidate.data.length) return original;

  return {
    data: candidate.data,
    originalBytes: source.length,
    outputBytes: candidate.data.length,
    width: candidate.info.width,
    height: candidate.info.height,
    trimmed,
    resized,
  };
}

export function gameImageAssets() {
  const pending = new Map();
  const statistics = new Map();
  let logger;

  return {
    name: "dmz-game-image-assets",
    apply: "build",
    enforce: "pre",
    configResolved(config) {
      logger = config.logger;
    },
    buildStart() {
      pending.clear();
      statistics.clear();
    },
    async load(id) {
      const [file, query = ""] = id.split("?", 2);
      const normalized = file.replaceAll("\\", "/");
      if (!/\/src\/assets\/third-party\/.+\.webp$/.test(normalized)) return;
      const parameters = new URLSearchParams(query);
      if ([...parameters.keys()].some((key) => key !== "url" && key !== "import")) return;

      this.addWatchFile(file);
      if (!pending.has(file)) {
        pending.set(
          file,
          (async () => {
            const optimized = await optimizeGameImage(await readFile(file));
            const referenceId = this.emitFile({
              type: "asset",
              name: basename(file),
              originalFileName: file,
              source: optimized.data,
            });
            statistics.set(file, optimized);
            return referenceId;
          })(),
        );
      }
      const referenceId = await pending.get(file);
      // Vite/Rolldown resolves this asset for the configured base, including Pages subpaths.
      // Emitting before hashing also makes encoding changes invalidate the asset URL.
      return {
        code: "export default import.meta.ROLLUP_FILE_URL_" + referenceId + ";",
        moduleType: "js",
        moduleSideEffects: false,
      };
    },
    generateBundle() {
      const images = [...statistics.values()];
      if (images.length === 0) return;
      const originalBytes = images.reduce((total, image) => total + image.originalBytes, 0);
      const outputBytes = images.reduce((total, image) => total + image.outputBytes, 0);
      logger?.info(
        "[game-images] " +
          JSON.stringify({
            images: images.length,
            originalBytes,
            outputBytes,
            savedPercent: Number(((1 - outputBytes / originalBytes) * 100).toFixed(1)),
            trimmed: images.filter((image) => image.trimmed).length,
            resized: images.filter((image) => image.resized).length,
            inlineImages: 0,
          }),
      );
    },
  };
}
