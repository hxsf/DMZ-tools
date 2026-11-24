import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import vm from "node:vm";
import sharp from "sharp";
import { preparePwa } from "../scripts/prepare-pwa.mjs";

const template = await readFile(new URL("../scripts/service-worker.js", import.meta.url), "utf8");
const routes = ["recipes", "weapon-manuals", "printer", "requirements", "traits"];
const origin = "https://example.test";

async function fixture(base) {
  const dist = await mkdtemp(join(tmpdir(), "dmz-pwa-"));
  const html = `<!doctype html><html><head><script src="${base}assets/app-12345678.js"></script>\n</head><body></body></html>`;
  await mkdir(join(dist, "assets"));
  await writeFile(join(dist, "index.html"), html);
  await writeFile(join(dist, "404.html"), html);
  for (const route of routes) {
    await mkdir(join(dist, route));
    await writeFile(join(dist, route, "index.html"), html);
  }
  await writeFile(join(dist, "assets/app-12345678.js"), "export const app = 1;");
  await writeFile(join(dist, "assets/lazy-87654321.js"), "export const lazy = 1;");
  await writeFile(join(dist, "assets/item-abcdef12.png"), "game image");
  await writeFile(join(dist, "assets/app-12345678.js.map"), "{}");
  await writeFile(join(dist, ".nojekyll"), "");
  return dist;
}

function readConfig(script) {
  const match = script.match(/^const config = (.+);$/m);
  assert.ok(match);
  return JSON.parse(match[1]);
}

for (const base of ["/", "/DMZ-tools/"]) {
  test(`PWA build is complete, deterministic and scoped to ${base}`, async (t) => {
    const dist = await fixture(base);
    t.after(() => rm(dist, { recursive: true, force: true }));
    const first = await preparePwa({ base, dist });
    const firstWorker = await readFile(join(dist, "sw.js"), "utf8");
    const second = await preparePwa({ base, dist });
    assert.equal(second.buildId, first.buildId);
    assert.equal(await readFile(join(dist, "sw.js"), "utf8"), firstWorker);
    const config = readConfig(firstWorker);
    assert.equal(config.base, base);
    assert.equal(config.cachePrefix, `dmz-tools-pwa:${encodeURIComponent(base)}:`);
    assert.equal(config.files.length, first.files);
    assert.ok(config.files.some((file) => file.url === base + "assets/lazy-87654321.js"));
    assert.ok(config.files.some((file) => file.url === base + "assets/item-abcdef12.png"));
    assert.ok(!config.files.some((file) => /sw\.js$|\.map$|\.nojekyll$/.test(file.url)));
    for (const route of routes) {
      assert.equal(config.navigation[base + route], base + route + "/index.html");
      assert.equal(config.navigation[base + route + "/"], base + route + "/index.html");
    }
    for (const file of config.files) {
      assert.ok(file.url.startsWith(base));
      const content = await readFile(join(dist, decodeURIComponent(file.url.slice(base.length))));
      assert.equal(
        file.integrity,
        "sha256-" + createHash("sha256").update(content).digest("base64"),
      );
      if (file.url.endsWith(".html")) {
        const html = content.toString("utf8");
        assert.equal((html.match(/name="dmz-tools-build"/g) ?? []).length, 1);
        assert.ok(html.includes(first.buildId));
      }
    }
    assert.equal(
      config.files.find((file) => file.url === base + "assets/app-12345678.js").immutable,
      true,
    );
    assert.equal(config.files.find((file) => file.url === base + "index.html").immutable, false);
    const manifest = JSON.parse(await readFile(join(dist, "manifest.webmanifest"), "utf8"));
    assert.equal(manifest.scope, "./");
    assert.equal(manifest.start_url, "./");
    assert.equal(manifest.id, "./");
    for (const size of [192, 512, 180]) {
      const path = join(dist, size === 180 ? "apple-touch-icon.png" : `pwa-icon-${size}.png`);
      const metadata = await sharp(path).metadata();
      assert.equal(metadata.width, size);
      assert.equal(metadata.height, size);
    }
    await writeFile(join(dist, "assets/lazy-87654321.js"), "export const lazy = 2;");
    const changed = await preparePwa({ base, dist });
    assert.notEqual(changed.buildId, first.buildId);
  });
}

test("PWA rejects a base that could escape the selected deployment path", async () => {
  for (const base of ["https://other.test/", "//other.test/", "/a/../b/", "/x?query", "/x#hash"]) {
    await assert.rejects(preparePwa({ base, dist: "/unused" }), /PWA base/);
  }
});

function workerHarness({ base = "/DMZ-tools/", failInstall = false } = {}) {
  const prefix = `dmz-tools-pwa:${encodeURIComponent(base)}:`;
  const config = {
    base,
    cachePrefix: prefix,
    buildId: "new",
    files: [
      { url: base + "index.html", immutable: false, integrity: "" },
      { url: base + "assets/app-12345678.js", immutable: true, integrity: "" },
      ...routes.map((route) => ({
        url: base + route + "/index.html",
        immutable: false,
        integrity: "",
      })),
    ],
    navigation: {
      [base]: base + "index.html",
      ...Object.fromEntries(
        routes.flatMap((route) =>
          [route, route + "/", route + "/index.html"].map((path) => [
            base + path,
            base + route + "/index.html",
          ]),
        ),
      ),
    },
    fallback: base + "index.html",
  };
  const cachesData = new Map();
  const listeners = new Map();
  const downloads = [];
  let windows = [];
  let skipped = 0;
  let claimed = 0;
  const registration = { installing: undefined, waiting: undefined };
  const cacheApi = {
    async open(name) {
      if (!cachesData.has(name)) cachesData.set(name, new Map());
      const data = cachesData.get(name);
      return {
        async addAll(requests) {
          downloads.push(...requests);
          if (failInstall) throw new Error("download failed");
          for (const request of requests) data.set(request.url, new Response(request.url));
        },
        async match(request) {
          const key = typeof request === "string" ? request : request.url;
          return data.get(key)?.clone();
        },
      };
    },
    async keys() {
      return [...cachesData.keys()];
    },
    async delete(name) {
      return cachesData.delete(name);
    },
  };
  const self = {
    location: { origin },
    registration,
    clients: {
      async claim() {
        claimed++;
      },
      async matchAll() {
        return windows;
      },
    },
    async skipWaiting() {
      skipped++;
    },
    addEventListener(name, listener) {
      listeners.set(name, listener);
    },
  };
  vm.runInNewContext(template.replace("__DMZ_PWA_CONFIG__", JSON.stringify(config)), {
    self,
    caches: cacheApi,
    URL,
    Request,
    fetch: () => Promise.reject(new Error("offline")),
  });

  async function dispatch(name, values = {}) {
    const work = [];
    const event = { ...values, waitUntil: (promise) => work.push(promise) };
    listeners.get(name)(event);
    await Promise.all(work);
  }
  return {
    prefix,
    registration,
    downloads,
    cachesData,
    skipped: () => skipped,
    claimed: () => claimed,
    windows(value) {
      windows = value;
    },
    seed(name, path, body) {
      if (!cachesData.has(name)) cachesData.set(name, new Map());
      cachesData.get(name).set(origin + path, new Response(body));
    },
    dispatch,
    async request(path, mode = "navigate", method = "GET") {
      let response;
      listeners.get("fetch")({
        request: { url: new URL(path, origin).href, method, mode },
        respondWith(value) {
          response = value;
        },
      });
      return response ? (await response).text() : undefined;
    },
  };
}

test("first install caches all routes and never skips waiting automatically", async () => {
  const worker = workerHarness();
  await worker.dispatch("install");
  await worker.dispatch("activate");
  assert.equal(worker.skipped(), 0);
  assert.equal(worker.claimed(), 1);
  assert.equal(worker.downloads.find((request) => request.url.endsWith(".js")).cache, "default");
  assert.equal(worker.downloads.find((request) => request.url.endsWith(".html")).cache, "reload");
  for (const route of routes) {
    for (const suffix of ["", "/", "/index.html", "?search=abc"]) {
      assert.equal(
        await worker.request("/DMZ-tools/" + route + suffix),
        origin + "/DMZ-tools/" + route + "/index.html",
      );
    }
  }
  await worker.dispatch("message", {
    source: { id: "one", url: origin + "/DMZ-tools/printer" },
    data: { type: "SKIP_WAITING" },
  });
  assert.equal(worker.skipped(), 1);
});

test("failed candidate installation leaves the active and unrelated caches intact", async () => {
  const worker = workerHarness({ failInstall: true });
  worker.seed(worker.prefix + "old", "/DMZ-tools/index.html", "old app");
  worker.seed("other-project", "/other/index.html", "other app");
  await assert.rejects(worker.dispatch("install"), /download failed/);
  assert.ok(worker.cachesData.has(worker.prefix + "old"));
  assert.ok(worker.cachesData.has("other-project"));
  assert.ok(!worker.cachesData.has(worker.prefix + "new"));
});

test("multiple tabs retain old chunks; only a sole current-build tab may clean them", async () => {
  const worker = workerHarness();
  const source = { id: "one", url: origin + "/DMZ-tools/printer" };
  const oldTab = { id: "two", url: origin + "/DMZ-tools/recipes" };
  worker.seed(worker.prefix + "old", "/DMZ-tools/assets/old-12345678.js", "old lazy chunk");
  worker.seed("other-project", "/other/index.html", "unrelated");
  await worker.dispatch("install");
  worker.windows([source, oldTab]);
  await worker.dispatch("activate");
  const ready = { source, data: { type: "CLIENT_READY", buildId: "new" } };
  await worker.dispatch("message", ready);
  assert.equal(await worker.request("/DMZ-tools/assets/old-12345678.js", "cors"), "old lazy chunk");
  worker.windows([source]);
  await worker.dispatch("message", { source, data: { type: "CLIENT_READY", buildId: "old" } });
  assert.ok(worker.cachesData.has(worker.prefix + "old"));
  worker.registration.waiting = {};
  await worker.dispatch("message", ready);
  assert.ok(worker.cachesData.has(worker.prefix + "old"));
  worker.registration.waiting = undefined;
  worker.registration.installing = {};
  await worker.dispatch("message", ready);
  assert.ok(worker.cachesData.has(worker.prefix + "old"));
  worker.registration.installing = undefined;
  await worker.dispatch("message", ready);
  assert.ok(!worker.cachesData.has(worker.prefix + "old"));
  assert.ok(worker.cachesData.has(worker.prefix + "new"));
  assert.ok(worker.cachesData.has("other-project"));
});

test("requests and messages outside this base are untouched", async () => {
  const worker = workerHarness();
  assert.equal(await worker.request("/other/recipes"), undefined);
  assert.equal(await worker.request("https://external.test/DMZ-tools/recipes"), undefined);
  assert.equal(await worker.request("/DMZ-tools/api/private", "cors"), undefined);
  assert.equal(await worker.request("/DMZ-tools/index.html", "navigate", "POST"), undefined);
  await worker.dispatch("message", {
    source: { id: "other", url: origin + "/other/" },
    data: { type: "SKIP_WAITING" },
  });
  assert.equal(worker.skipped(), 0);
});
