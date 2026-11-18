import { parseArgs } from "node:util";
import { build } from "vite";
import { preparePwa } from "./prepare-pwa.mjs";

const { values } = parseArgs({
  options: { base: { type: "string", default: "/" } },
});
const base = values.base;
if (
  !base.startsWith("/") ||
  !base.endsWith("/") ||
  base.includes("..") ||
  base.includes("?") ||
  base.includes("#")
) {
  throw new Error("Build base must be an absolute directory path ending in /.");
}
await build({ base });
await import("./prepare-pages.mjs");
const result = await preparePwa({ base });
console.log(`PWA: ${result.files} cached files for ${result.base} (${result.buildId})`);
