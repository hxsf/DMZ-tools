import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile, stat, mkdir } from "node:fs/promises";
import { resolve, extname, sep } from "node:path";
import { gzipSync } from "node:zlib";
import { parseArgs } from "node:util";

const { values } = parseArgs({
  options: {
    dist: { type: "string", default: process.env.DMZ_SMOKE_DIST ?? "dist" },
    base: { type: "string", default: process.env.DMZ_SMOKE_BASE ?? "/" },
    "next-dist": { type: "string", default: process.env.DMZ_SMOKE_NEXT_DIST },
    "baseline-dist": { type: "string", default: process.env.DMZ_SMOKE_BASELINE_DIST },
  },
});
const base = "/" + values.base.replace(/^\/+|\/+$/g, "") + "/";
const scope = base === "//" ? "/" : base;
assert.ok(!scope.includes(".."), "The test base must not traverse directories.");
const playwright = await import(process.env.DMZ_PLAYWRIGHT_MODULE ?? "playwright");
const browser = await playwright.chromium.launch({
  headless: true,
  ...(process.env.DMZ_CHROMIUM_EXECUTABLE
    ? { executablePath: process.env.DMZ_CHROMIUM_EXECUTABLE }
    : {}),
});
const outputDirectory = resolve(".qa");
await mkdir(outputDirectory, { recursive: true });
const label = scope === "/" ? "root" : scope.replace(/\W+/g, "-").replace(/^-|-$/g, "");
const cardName = "员工紧急出口出入卡";
const dataKey = "dmz-tools:user";
const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webmanifest": "application/manifest+json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".webp": "image/webp",
  ".md": "text/plain; charset=utf-8",
};
const sockets = new Set();

function report(check, details = {}) {
  console.log(JSON.stringify({ check, base: scope, ...details }));
}

async function serve(directory, prefix) {
  let activeDirectory = resolve(directory);
  const server = createServer(async (request, response) => {
    try {
      const pathname = decodeURIComponent(new URL(request.url, "http://localhost").pathname);
      if (!pathname.startsWith(prefix)) {
        response.writeHead(404).end();
        return;
      }
      let relative = pathname.slice(prefix.length) || "index.html";
      let path = resolve(activeDirectory, relative);
      if (path !== activeDirectory && !path.startsWith(activeDirectory + sep)) {
        response.writeHead(403).end();
        return;
      }
      const metadata = await stat(path);
      if (metadata.isDirectory()) {
        relative += (relative.endsWith("/") ? "" : "/") + "index.html";
        path = resolve(activeDirectory, relative);
      }
      let body = await readFile(path);
      const mime = mimeTypes[extname(path)] ?? "application/octet-stream";
      const headers = {
        "Content-Type": mime,
        "Cache-Control": relative.startsWith("assets/")
          ? "public, max-age=31536000, immutable"
          : "no-cache",
      };
      if (
        /^(text\/|application\/(json|manifest))/.test(mime) &&
        (request.headers["accept-encoding"] ?? "").includes("gzip")
      ) {
        body = gzipSync(body);
        headers["Content-Encoding"] = "gzip";
      }
      headers["Content-Length"] = String(body.length);
      response.writeHead(200, headers).end(body);
    } catch (error) {
      response.writeHead(error?.code === "ENOENT" ? 404 : 500).end();
    }
  });
  server.on("connection", (socket) => {
    sockets.add(socket);
    socket.on("close", () => sockets.delete(socket));
  });
  await new Promise((accept) => server.listen(0, "127.0.0.1", accept));
  return {
    origin: "http://127.0.0.1:" + server.address().port,
    switchDirectory(next) {
      activeDirectory = resolve(next);
    },
    async close() {
      server.closeIdleConnections();
      await new Promise((accept) => server.close(accept));
    },
  };
}

async function waitForApp(page, route) {
  const selector =
    route === "printer"
      ? ".printer-page"
      : route === "requirements"
        ? ".requirements-page"
        : ".unlock-page";
  await page.locator(selector).waitFor();
}

async function cacheReady(page) {
  await page.evaluate(async () => {
    if (!("serviceWorker" in navigator)) throw new Error("Service workers are unavailable.");
    await Promise.race([
      navigator.serviceWorker.ready,
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Service worker installation timed out.")), 60_000),
      ),
    ]);
  });
  await page.waitForFunction(() => Boolean(navigator.serviceWorker.controller), undefined, {
    timeout: 60_000,
  });
}

async function dismissStatus(page) {
  const button = page.locator('[data-pwa-action="dismiss"]');
  if (await button.isVisible()) await button.click();
}

async function checkImages(page) {
  const images = await page.locator(".item-image").evaluateAll(async (nodes) => {
    for (const image of nodes) image.loading = "eager";
    await Promise.all(
      nodes.map((image) =>
        Promise.race([
          image.decode().catch(() => undefined),
          new Promise((accept) => setTimeout(accept, 10_000)),
        ]),
      ),
    );
    return nodes.map((image) => ({
      source: image.currentSrc || image.src,
      loaded: image.complete && image.naturalWidth > 0,
      width: image.getBoundingClientRect().width,
      height: image.getBoundingClientRect().height,
    }));
  });
  assert.ok(images.length > 0, "The page must contain real item images.");
  assert.deepEqual(
    images.filter((image) => !image.loaded),
    [],
    "All item images must decode, including offline and lazy images.",
  );
  assert.ok(
    images.every((image) => !image.source.startsWith("data:")),
    "Build item images must be independently cacheable URLs.",
  );
  return images;
}

async function assertNoOverflow(page) {
  const size = await page.evaluate(() => ({
    actual: document.documentElement.scrollWidth,
    viewport: window.innerWidth,
  }));
  assert.ok(size.actual <= size.viewport + 1, JSON.stringify(size));
}

async function networkMeasurement(directory, prefix, name, pwa) {
  const site = await serve(directory, prefix);
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const pending = [];
  const totals = {};
  const failed = [];
  context.on("requestfailed", (request) => failed.push(request.url()));
  context.on("response", (response) => {
    pending.push(
      (async () => {
        await response.finished();
        const request = response.request();
        const initiator = request.serviceWorker() ? "service-worker" : "page";
        const kind = /\.(js|mjs)(?:\?|$)/.test(request.url())
          ? "javascript"
          : /\.(webp|png|svg)(?:\?|$)/.test(request.url())
            ? "images"
            : "other";
        const key = initiator + ":" + kind;
        const size = await request.sizes();
        const row = (totals[key] ??= { requests: 0, responseBodyBytes: 0 });
        row.requests += 1;
        row.responseBodyBytes += size.responseBodySize;
      })().catch((error) => {
        failed.push("measurement: " + error.message);
      }),
    );
  });
  try {
    const page = await context.newPage();
    await page.goto(site.origin + prefix);
    await waitForApp(page, "recipes");
    if (pwa) await cacheReady(page);
    await page.waitForLoadState("networkidle");
    await Promise.all(pending);
    report("network:" + name, {
      transport: "local HTTP with gzip for text; first visit in a fresh browser context",
      totals,
      failed,
    });
    assert.equal(failed.length, 0, "The first visit must not fail resource requests.");
  } finally {
    await context.close();
    await site.close();
  }
}

const site = await serve(values.dist, scope);
const url = (route) => site.origin + scope + route;
const contexts = [];
const pageErrors = [];
try {
  if (values["baseline-dist"]) {
    await networkMeasurement(values["baseline-dist"], "/", "baseline", false);
  }
  await networkMeasurement(values.dist, scope, "optimized-with-precache", true);

  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  contexts.push(context);
  const page = await context.newPage();
  page.on("pageerror", (error) => pageErrors.push(error.message));
  await page.goto(url("recipes"));
  await waitForApp(page, "recipes");
  await cacheReady(page);
  await dismissStatus(page);
  const imageRows = await checkImages(page);
  assert.equal(imageRows.length, 96, "All 96 collected printer outputs must have images.");
  assert.ok(
    imageRows.every((image) => image.width === image.height),
    "Items use square frames.",
  );

  for (const [width, columns] of [
    [1440, 3],
    [1024, 2],
    [390, 1],
    [320, 1],
  ]) {
    await page.setViewportSize({ width, height: 1000 });
    const actual = await page
      .locator(".item-grid:visible")
      .first()
      .evaluate((element) => getComputedStyle(element).gridTemplateColumns.split(" ").length);
    assert.equal(actual, columns, "Recipe columns at viewport " + width);
    await assertNoOverflow(page);
    const frame = await page.locator(".item-image").first().boundingBox();
    assert.equal(frame.width, frame.height);
    report("layout", { width, columns: actual, itemFrame: [frame.width, frame.height] });
    if (width === 1440 || width === 320) {
      await page.screenshot({
        path: resolve(outputDirectory, label + "-recipes-" + width + ".png"),
      });
    }
  }

  const epicStyle = await page
    .locator('.item-image[data-rarity="epic"]')
    .first()
    .evaluate((image) => ({
      top: Number.parseFloat(getComputedStyle(image).borderTopWidth),
      pattern: getComputedStyle(image).backgroundImage,
      card: getComputedStyle(image.closest(".item-card")).backgroundColor,
    }));
  assert.ok(epicStyle.top >= 2, "Rarity uses a top stripe.");
  assert.ok(epicStyle.pattern.includes("radial-gradient"), "Rarity uses the game dot pattern.");
  assert.equal(epicStyle.card, "rgb(255, 255, 255)", "Rarity should not color the whole card.");

  await page.setViewportSize({ width: 1440, height: 1000 });
  const tactical = page.locator("#recipes-tactical-items");
  const screenshotOrder = [
    "震撼弹",
    "探测手雷",
    "烟雾弹",
    "电击陷阱",
    "告警器",
    "闪光弹",
    "诱饵手雷",
  ];
  const orderedNames = await tactical.locator(".item-name").allTextContents();
  assert.deepEqual(
    orderedNames.filter((name) => screenshotOrder.includes(name)),
    screenshotOrder,
  );
  const rarityRank = ["common", "uncommon", "rare", "epic", "legendary", "ultra"];
  for (const group of await page.locator(".item-grid").all()) {
    const ranks = await group
      .locator(".item-image")
      .evaluateAll(
        (images, rank) => images.map((image) => rank.indexOf(image.dataset.rarity)),
        rarityRank,
      );
    assert.ok(ranks.every((rank, index) => index === 0 || rank >= ranks[index - 1]));
  }
  const heartbeat = page.getByRole("checkbox", { name: "切换 心跳探测器 的解锁状态", exact: true });
  await heartbeat.check();
  await page.waitForFunction(
    () =>
      document.querySelector("#recipes-tactical-items .item-name")?.textContent === "心跳探测器",
  );
  await page.waitForFunction((key) => localStorage.getItem(key) !== null, dataKey);
  const orderBeforeLanguage = await tactical
    .locator(".item-image")
    .evaluateAll((images) => images.map((image) => image.src));
  await page.locator(".language-toggle").click();
  const orderAfterLanguage = await tactical
    .locator(".item-image")
    .evaluateAll((images) => images.map((image) => image.src));
  assert.deepEqual(
    orderAfterLanguage,
    orderBeforeLanguage,
    "Changing language preserves tie order.",
  );
  await page.locator(".language-toggle").click();
  await page.reload();
  await waitForApp(page, "recipes");
  assert.equal(await heartbeat.isChecked(), true, "Unlock changes survive reload.");
  assert.equal(await tactical.locator(".item-name").first().textContent(), "心跳探测器");

  const search = page.getByRole("searchbox", { name: "搜索物品或配方" });
  for (const [query, expected] of [
    ["C4", "C4"],
    ["塑胶炸弹", "C4"],
    ["快照手雷", "探测手雷"],
  ]) {
    await search.fill(query);
    assert.ok((await page.locator(".item-name").allTextContents()).includes(expected));
  }
  await search.fill(cardName);
  assert.equal(await page.locator(".item-name").textContent(), cardName);
  const card = page.locator(".item-card");
  assert.equal(await card.locator(".item-image").getAttribute("data-rarity"), "epic");
  assert.match(await card.textContent(), /电子元件 80/);
  assert.match(await card.textContent(), /印刷电路板 6/);
  assert.match(await card.textContent(), /控制单元 10/);
  report("catalog", { count: imageRows.length, screenshotOrder, unlockReload: true, names: true });

  await page.goto(url("weapon-manuals"));
  await waitForApp(page, "weapon-manuals");
  const weapons = await checkImages(page);
  assert.equal(weapons.length, 32);
  assert.ok(
    weapons.every((image) => image.width > image.height),
    "Weapons use horizontal frames.",
  );
  await page.setViewportSize({ width: 320, height: 900 });
  const weaponFrame = await page.locator(".item-image").first().boundingBox();
  assert.ok(weaponFrame.width > weaponFrame.height);
  await assertNoOverflow(page);
  report("weapon-frames", {
    count: weapons.length,
    mobile: [weaponFrame.width, weaponFrame.height],
  });

  await page.goto(url("printer"));
  await waitForApp(page, "printer");
  await page.getByRole("searchbox", { name: "搜索配方名称" }).fill(cardName);
  const catalogQuantity = page.locator(".printer-catalog").getByRole("textbox", {
    name: cardName + "的目标成品数",
    exact: true,
  });
  await catalogQuantity.fill("1");
  await page.locator(".printer-selection-bar button").click();
  const dialog = page.getByRole("dialog");
  await dialog.waitFor();
  const output = dialog.getByRole("textbox", { name: cardName + "的单次产量", exact: true });
  assert.equal(await output.inputValue(), "", "Unknown source output is not fabricated.");
  await output.fill("1");
  for (const [name, quantity] of [
    ["电子元件", "80"],
    ["印刷电路板", "6"],
    ["控制单元", "10"],
  ]) {
    const row = dialog.locator(".material-row").filter({
      has: page.locator(".material-name", { hasText: name }),
    });
    assert.equal(await row.locator(".material-required").textContent(), quantity);
  }
  await assertNoOverflow(page);
  await page.screenshot({ path: resolve(outputDirectory, label + "-printer-drawer-320.png") });
  await page.keyboard.press("Escape");
  await dialog.waitFor({ state: "hidden" });
  assert.equal(await catalogQuantity.inputValue(), "1");
  await page.locator(".printer-selection-bar button").click();
  assert.equal(await output.inputValue(), "1", "Closing the drawer preserves output drafts.");
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.locator(".printer-review").waitFor();
  const desktopOutput = page.locator(".printer-review").getByRole("textbox", {
    name: cardName + "的单次产量",
    exact: true,
  });
  assert.equal(await desktopOutput.inputValue(), "1", "Crossing the breakpoint preserves drafts.");
  const catalogBox = await page.locator(".printer-catalog").boundingBox();
  const summaryBox = await page.locator(".printer-review").boundingBox();
  assert.ok(catalogBox.x + catalogBox.width <= summaryBox.x);
  await page.getByRole("button", { name: "加入需求清单", exact: true }).click();
  await page.waitForFunction(
    (key) => localStorage.getItem(key)?.includes("staff-emergency-exfil-keycard"),
    dataKey,
  );
  await page.goto(url("requirements"));
  await waitForApp(page, "requirements");
  assert.ok((await page.locator(".plan-target").textContent()).includes(cardName));
  report("printer", {
    materials: [80, 6, 10],
    drawerDrafts: true,
    breakpointDrafts: true,
    saved: true,
  });

  // A fresh context visits only one page online: lazy routes and weapon images must come from precache.
  const offlineContext = await browser.newContext({ viewport: { width: 390, height: 900 } });
  contexts.push(offlineContext);
  const offlinePage = await offlineContext.newPage();
  const offlineFailures = [];
  const offlineUpdateProbes = [];
  const navigationAborts = [];
  const requestStarts = new WeakMap();
  let offlinePhase = "online-setup";
  let navigationSerial = 0;
  offlinePage.on("pageerror", (error) => pageErrors.push(error.message));
  offlineContext.on("request", (request) => {
    requestStarts.set(request, { phase: offlinePhase, navigationSerial });
  });
  offlineContext.on("requestfailed", (request) => {
    const started = requestStarts.get(request);
    const failure = {
      url: request.url(),
      errorText: request.failure()?.errorText ?? "Unknown request failure",
      startedIn: started?.phase ?? "unknown",
      failedIn: offlinePhase,
    };
    if (new URL(request.url()).pathname === scope + "sw.js") {
      offlineUpdateProbes.push(failure);
    } else if (
      failure.errorText === "net::ERR_ABORTED" &&
      !request.serviceWorker() &&
      started !== undefined &&
      started.navigationSerial < navigationSerial
    ) {
      // Chromium can cancel the preceding document's lazy requests during navigation.
      // Only cancellation from an older document is excluded; real network errors still fail.
      navigationAborts.push(failure);
    } else {
      offlineFailures.push(failure);
    }
  });
  await offlinePage.goto(url("recipes"));
  await waitForApp(offlinePage, "recipes");
  await cacheReady(offlinePage);
  await dismissStatus(offlinePage);
  await offlinePage
    .getByRole("checkbox", {
      name: "切换 心跳探测器 的解锁状态",
      exact: true,
    })
    .check();
  await offlinePage.waitForFunction((key) => localStorage.getItem(key) !== null, dataKey);
  // Clicking a lower category scrolls the page and starts nearby lazy image requests.
  // Finish that online setup before simulating loss of the network.
  offlinePhase = "online-settle";
  await offlinePage.waitForLoadState("networkidle");
  const storedBefore = await offlinePage.evaluate((key) => localStorage.getItem(key), dataKey);
  offlinePhase = "offline-idle";
  await offlineContext.setOffline(true);
  for (const [path, route] of [
    ["printer?offline=1", "printer"],
    ["weapon-manuals/", "weapon-manuals"],
    ["requirements", "requirements"],
    ["recipes/", "recipes"],
  ]) {
    navigationSerial += 1;
    offlinePhase = "offline-navigation:" + route;
    await offlinePage.goto(url(path));
    await waitForApp(offlinePage, route);
    offlinePhase = "offline-check:" + route;
    if (route !== "requirements") await checkImages(offlinePage);
    await offlinePage.waitForLoadState("networkidle");
  }
  assert.equal(
    await offlinePage
      .getByRole("checkbox", {
        name: "切换 心跳探测器 的解锁状态",
        exact: true,
      })
      .isChecked(),
    true,
  );
  assert.equal(
    await offlinePage.evaluate((key) => localStorage.getItem(key), dataKey),
    storedBefore,
  );
  report("offline", {
    routes: 4,
    failedResourceRequests: offlineFailures.length,
    unavailableUpdateProbes: offlineUpdateProbes.length,
    navigationAborts,
    failures: offlineFailures,
    preservedSave: true,
  });
  assert.deepEqual(offlineFailures, [], "Offline direct navigation must not fail resources.");
  await offlineContext.close();
  contexts.splice(contexts.indexOf(offlineContext), 1);

  if (values["next-dist"]) {
    await page.goto(url("printer"));
    await waitForApp(page, "printer");
    await page.getByRole("searchbox", { name: "搜索配方名称" }).fill(cardName);
    await page
      .locator(".printer-catalog")
      .getByRole("textbox", {
        name: cardName + "的目标成品数",
        exact: true,
      })
      .fill("2");
    await page
      .locator(".printer-review")
      .getByRole("textbox", {
        name: cardName + "的单次产量",
        exact: true,
      })
      .fill("1");
    const oldBuild = await page.locator('meta[name="dmz-tools-build"]').getAttribute("content");
    const oldDocument = await page.evaluate(() => {
      globalThis.__dmzSmokeDocument = crypto.randomUUID();
      return globalThis.__dmzSmokeDocument;
    });
    const updatePage = await context.newPage();
    updatePage.on("pageerror", (error) => pageErrors.push(error.message));
    await updatePage.goto(url("recipes"));
    await waitForApp(updatePage, "recipes");
    await cacheReady(updatePage);
    site.switchDirectory(values["next-dist"]);
    await updatePage.evaluate(async () => {
      const registration = await navigator.serviceWorker.ready;
      await registration.update();
    });
    const updateButton = updatePage.locator('[data-pwa-action="update"]');
    await updateButton.waitFor({ timeout: 60_000 });
    assert.equal(await page.evaluate(() => globalThis.__dmzSmokeDocument), oldDocument);
    const beforeUpdateSave = await page.evaluate((key) => localStorage.getItem(key), dataKey);
    await updateButton.click();
    await updatePage.waitForFunction(
      (old) => {
        const current = document.querySelector('meta[name="dmz-tools-build"]')?.content;
        return Boolean(current && current !== old);
      },
      oldBuild,
      { timeout: 60_000 },
    );
    await waitForApp(updatePage, "recipes");
    assert.equal(await page.evaluate(() => globalThis.__dmzSmokeDocument), oldDocument);
    assert.equal(
      await page
        .locator(".printer-catalog")
        .getByRole("textbox", {
          name: cardName + "的目标成品数",
          exact: true,
        })
        .inputValue(),
      "2",
    );
    assert.equal(
      await page.evaluate((key) => localStorage.getItem(key), dataKey),
      beforeUpdateSave,
    );
    const cacheCount = await page.evaluate(
      async (prefix) => {
        return (await caches.keys()).filter((key) => key.startsWith(prefix)).length;
      },
      "dmz-tools-pwa:" + encodeURIComponent(scope) + ":",
    );
    assert.ok(cacheCount >= 2, "Old tabs retain old version resources.");
    await context.setOffline(true);
    await page.locator('.app-navigation a[href$="/weapon-manuals"]').click();
    await waitForApp(page, "weapon-manuals");
    await checkImages(page);
    report("update", {
      explicitRefresh: true,
      otherTabDraftPreserved: true,
      userSavePreserved: true,
      retainedCaches: cacheCount,
      oldTabLazyNavigationOffline: true,
    });
  } else {
    report("update", { skipped: "Set DMZ_SMOKE_NEXT_DIST to test two-version updates." });
  }

  assert.deepEqual(pageErrors, [], "The browser must not throw uncaught application errors.");
  report("passed", { screenshots: outputDirectory });
} finally {
  for (const context of contexts) await context.close();
  await browser.close();
  for (const socket of sockets) socket.destroy();
  await site.close();
}
