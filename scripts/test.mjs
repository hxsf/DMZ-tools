import { spawn } from "node:child_process";
import { mkdtemp, readdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { build } from "vite";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const temporary = await mkdtemp(join(tmpdir(), "dmz-tools-tests-"));
try {
  const entry = join(temporary, "entry.ts");
  await writeFile(
    entry,
    [
      "src/kv.ts",
      "src/storage.ts",
      "src/stores/index.ts",
      "src/stores/app.ts",
      "src/calculations/materials.ts",
      "src/data/catalog.ts",
    ]
      .map((path) => `export * from ${JSON.stringify(resolve(root, path))};`)
      .join("\n"),
  );
  await build({
    root,
    configFile: false,
    logLevel: "warn",
    ssr: { noExternal: true },
    build: {
      ssr: entry,
      target: "node24",
      outDir: join(temporary, "bundle"),
      emptyOutDir: true,
      rolldownOptions: { output: { entryFileNames: "runtime.mjs", codeSplitting: false } },
    },
  });
  const files = (await readdir(join(root, "tests")))
    .filter((file) => file.endsWith(".test.mjs"))
    .map((file) => join(root, "tests", file));
  const child = spawn(process.execPath, ["--test", ...files], {
    cwd: root,
    stdio: "inherit",
    env: {
      ...process.env,
      DMZ_TEST_RUNTIME: pathToFileURL(join(temporary, "bundle/runtime.mjs")).href,
    },
  });
  process.exitCode = await new Promise((accept, reject) => {
    child.on("error", reject);
    child.on("exit", (code) => accept(code ?? 1));
  });
} finally {
  await rm(temporary, { recursive: true, force: true });
}
