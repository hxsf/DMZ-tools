import assert from "node:assert/strict";
import { resolve } from "node:path";

async function checkTraitAtlas(page) {
  await page.locator('#traits-catalog [data-perk-filter="all"]').waitFor({ state: "attached" });
  const icons = page.locator("#traits-catalog .perk-icon[data-perk-icon]");
  await icons.first().waitFor({ state: "attached" });
  const images = await icons.evaluateAll((elements) =>
    elements.map((element) => {
      const style = getComputedStyle(element);
      return { image: style.backgroundImage, position: style.backgroundPosition };
    }),
  );
  const sources = [...new Set(images.map(({ image }) => image))];
  assert.equal(sources.length, 1, "Catalog icons must share one sprite sheet.");
  const match = sources[0].match(/^url\("(.+)"\)$/);
  assert.ok(match, "The sprite must have a cacheable asset URL.");
  const atlas = match[1];
  assert.equal(new URL(atlas).origin, new URL(page.url()).origin);
  assert.match(new URL(atlas).pathname, /\/assets\/perk-atlas-[\w-]+\.webp$/);
  assert.ok(images.length >= 75, "The atlas must cover the verified illustrated traits.");
  assert.ok(new Set(images.map(({ position }) => position)).size > 1);

  const details = await page.evaluate(async (url) => {
    const cached = await caches.match(url);
    const image = new Image();
    image.src = url;
    await image.decode();
    return {
      cached: Boolean(cached),
      width: image.naturalWidth,
      height: image.naturalHeight,
    };
  }, atlas);
  assert.ok(details.cached, "The PWA must precache the atlas.");
  assert.ok(details.width > 0 && details.height > 0);
  return { icons: images.length, ...details };
}

// Measure the first actual page request without a previously installed PWA or a warm HTTP cache.
export async function checkColdTraitAtlas(browser, url) {
  const context = await browser.newContext({
    serviceWorkers: "block",
    viewport: { width: 1440, height: 900 },
  });
  try {
    const page = await context.newPage();
    const isAtlas = (url) => /\/assets\/perk-atlas-[\w-]+\.webp$/.test(new URL(url).pathname);
    const requests = [];
    page.on("request", (request) => {
      if (isAtlas(request.url())) requests.push(request.url());
    });
    const [response] = await Promise.all([
      page.waitForResponse((result) => isAtlas(result.url())),
      page.goto(url),
    ]);
    assert.equal(response.status(), 200);
    assert.equal(response.fromServiceWorker(), false);
    assert.equal(await response.finished(), null);
    const icons = page.locator("#traits-catalog .perk-icon[data-perk-icon]");
    await icons.first().waitFor({ state: "attached" });
    await page.waitForLoadState("networkidle");
    const styles = await icons.evaluateAll((nodes) =>
      nodes.map((node) => getComputedStyle(node).backgroundImage),
    );
    assert.ok(styles.length >= 75);
    assert.deepEqual([...new Set(styles)], ['url("' + response.url() + '")']);
    assert.deepEqual(requests, [response.url()]);
    console.log(
      JSON.stringify({
        check: "traits-cold-atlas",
        requests: requests.length,
        icons: styles.length,
        bytes: (await response.body()).length,
      }),
    );
  } finally {
    await context.close();
  }
}

async function assertNavFits(page) {
  const boxes = await page.locator(".app-navigation a").evaluateAll((links) =>
    links.map((link) => {
      const box = link.getBoundingClientRect();
      return { left: box.left, right: box.right, width: box.width, viewport: innerWidth };
    }),
  );
  assert.equal(boxes.length, 5);
  assert.ok(boxes.every((box) => box.width > 0 && box.left >= -1 && box.right <= box.viewport + 1));
}

const branchNames = ["warfighter", "scout", "survivalist"];

function slot(page, branch, row) {
  return page.locator("#trait-" + branch + "-" + row);
}

async function showMode(page, mode) {
  const button = page.locator('[data-tree-mode="' + mode + '"]');
  await button.click();
  assert.equal(await button.getAttribute("aria-pressed"), "true");
  assert.equal(await page.locator("#traits-tree").getAttribute("data-mode"), mode);
}

async function choose(page, branch, row, { query, id, count, position } = {}) {
  if (branch !== "prestige" && row % 3 === 0) {
    const options = page.locator(
      '.perk-branch-diagram[data-branch="' +
        branch +
        '"] .perk-tier[data-row="' +
        row +
        '"] .perk-node[data-wire-id]',
    );
    assert.equal(await options.count(), 2);
    const choice =
      id === undefined ? options.first() : options.and(page.locator('[data-wire-id="' + id + '"]'));
    const value = Number(await choice.getAttribute("data-wire-id"));
    await choice.click();
    assert.equal(await page.locator("dialog.trait-picker[open]").count(), 0);
    assert.equal(await choice.getAttribute("data-selected"), "true");
    return value;
  }
  const target =
    position === undefined
      ? slot(page, branch, row)
      : page.locator(
          '.perk-branch-diagram[data-branch="' +
            branch +
            '"] .perk-tier[data-row="' +
            row +
            '"] .perk-node[data-position="' +
            position +
            '"]',
        );
  await target.click();
  const picker = page.locator("dialog.trait-picker[open]");
  await picker.waitFor();
  if (query) await picker.locator("#trait-picker-search").fill(query);
  const choices = picker.locator(".perk-choice[data-wire-id]:enabled");
  if (count) assert.equal(await choices.count(), count);
  const choice =
    id === undefined ? choices.first() : picker.locator('.perk-choice[data-wire-id="' + id + '"]');
  const value = Number(await choice.getAttribute("data-wire-id"));
  assert.ok(value > 0);
  await choice.click();
  await picker.waitFor({ state: "hidden" });
  assert.equal(await slot(page, branch, row).getAttribute("data-selected"), "true");
  assert.equal(Number(await slot(page, branch, row).getAttribute("data-wire-id")), value);
  return value;
}

async function shot(page, outputDirectory, label, name) {
  await page.screenshot({ path: resolve(outputDirectory, label + "-traits-" + name + ".png") });
}

async function topOfBoard(page) {
  await page.evaluate(() => {
    document.querySelector(".perk-tree-scroll")?.scrollTo(0, 0);
    window.scrollTo(0, 0);
  });
}

async function assertBoardFits(page, firstFold) {
  const geometry = await page.locator(".perk-tree-board").evaluate((board) => {
    const nodes = [...board.querySelectorAll(".perk-node")];
    const positions = nodes.map((node) => node.getBoundingClientRect());
    const panel = document.querySelector(".perk-tree-scroll");
    return {
      nodes: positions.length,
      visibleSizes: positions.every((box) => box.width > 0 && box.height > 0),
      left: Math.min(...positions.map((box) => box.left)),
      right: Math.max(...positions.map((box) => box.right)),
      top: Math.min(...positions.map((box) => box.top)),
      bottom: Math.max(...positions.map((box) => box.bottom)),
      viewportWidth: innerWidth,
      viewportHeight: innerHeight,
      horizontalScroll: panel ? panel.scrollWidth - panel.clientWidth : 0,
    };
  });
  assert.equal(
    geometry.nodes,
    69,
    "The 66 tree positions and three Prestige slots must be present.",
  );
  assert.ok(geometry.visibleSizes);
  assert.ok(
    geometry.left >= -1 && geometry.right <= geometry.viewportWidth + 1,
    JSON.stringify(geometry),
  );
  assert.ok(
    geometry.horizontalScroll <= 1,
    "Icon mode fits every branch without horizontal scrolling.",
  );
  if (firstFold) {
    assert.ok(
      geometry.top >= 0 && geometry.bottom <= geometry.viewportHeight + 1,
      JSON.stringify(geometry),
    );
  }
}

async function checkCatalog(page, outputDirectory, label) {
  const catalog = page.locator("#traits-catalog");
  const entries = catalog.locator("article.perk-entry");
  const search = catalog.locator("#trait-search");
  assert.equal(await entries.count(), 78);
  assert.equal(await entries.locator("[data-perk-icon-missing]").count(), 3);
  assert.equal(
    new Set(await entries.evaluateAll((items) => items.map((item) => item.dataset.perkId))).size,
    78,
  );
  const order = await page.evaluate(
    () =>
      document
        .querySelector("#traits-tree")
        .compareDocumentPosition(document.querySelector("#traits-catalog")) &
      Node.DOCUMENT_POSITION_FOLLOWING,
  );
  assert.ok(order, "The full catalog follows the board in the same document.");

  for (const [category, expected] of [
    ["warfighter", 10],
    ["scout", 10],
    ["survivalist", 10],
    ["common", 48],
    ["all", 78],
  ]) {
    const filter = catalog.locator('[data-perk-filter="' + category + '"]');
    await filter.click();
    assert.equal(await filter.getAttribute("aria-pressed"), "true");
    assert.equal(await entries.count(), expected, category);
    if (category !== "all") {
      assert.equal(
        await entries.evaluateAll(
          (cards, value) => cards.every((c) => c.dataset.perkCategory === value),
          category,
        ),
        true,
      );
    }
  }
  await catalog.locator('[data-perk-filter="scout"]').click();
  await search.fill("Strong Arm");
  assert.equal(await entries.count(), 0, "Search respects the selected category.");
  await catalog.locator(".empty-state").waitFor();
  await catalog.locator('[data-perk-filter="common"]').click();
  assert.equal(await entries.count(), 1);
  await catalog.locator('[data-perk-filter="all"]').click();
  assert.equal(await entries.count(), 1);
  const name = entries.locator("h3");
  const effect = entries.locator("p").first();
  const translated = { name: await name.innerText(), effect: await effect.innerText() };
  assert.match(translated.name, /强力投掷/);
  assert.match(translated.effect, /投掷/);
  await name.locator(".perk-mark").click();
  assert.ok((await name.innerText()).includes("Strong Arm"));
  assert.equal(await effect.innerText(), translated.effect);
  await name.locator(".perk-mark").click();
  await effect.locator(".perk-mark").click();
  assert.match(await effect.locator('q[lang="en"]').innerText(), /throw/i);
  assert.equal(await name.innerText(), translated.name);
  const source = entries.locator('a[href="https://dmzhub.gg/traits/strong-arm"]');
  assert.equal(await source.first().getAttribute("target"), "_blank");
  await effect.locator(".perk-mark").click();
  assert.equal(await effect.innerText(), translated.effect);
  await page.locator("#trait-original").click();
  assert.equal((await name.innerText()).trim(), "Strong Arm");
  assert.match(await entries.locator('q[lang="en"]').innerText(), /throw/i);
  await page.locator("#trait-original").click();
  assert.equal(await name.innerText(), translated.name);
  await search.fill("肾上腺素飙升");
  assert.equal(await entries.count(), 1);
  assert.equal(
    await entries.locator(".perk-mark").count(),
    0,
    "Verified official text has no translation mark.",
  );
  await search.fill("");
  await catalog.evaluate((element) => {
    element.scrollIntoView({ block: "start" });
    scrollBy(0, -56);
  });
  await shot(page, outputDirectory, label, "catalog-1440");
}

export async function checkOfflineTraits(page) {
  const atlas = await checkTraitAtlas(page);
  await slot(page, "warfighter", 1).tap();
  const picker = page.locator("dialog.trait-picker[open]");
  await picker.waitFor();
  assert.ok((await picker.locator(".perk-choice[data-wire-id]").count()) > 0);
  await page.keyboard.press("Escape");
  await picker.waitFor({ state: "hidden" });
  return atlas;
}

export async function checkTraits(page, { assertNoOverflow, outputDirectory, label, dataKey }) {
  const readSave = () => page.evaluate((key) => JSON.parse(localStorage.getItem(key)), dataKey);
  const existing = await readSave();
  const nav = page.locator('.app-navigation a[href$="/traits"]');
  await nav.click();
  await page.locator(".perks-page").waitFor();
  assert.equal(await nav.getAttribute("aria-current"), "page");
  const tree = page.locator("#traits-tree");
  assert.equal(await tree.getAttribute("data-mode"), "icon");
  assert.equal(await tree.locator("select").count(), 0);
  for (const branch of branchNames) {
    const rows = page.locator('.perk-branch-diagram[data-branch="' + branch + '"] .perk-tier');
    const tiers = await rows.evaluateAll((elements) =>
      elements
        .map((element) => ({
          row: Number(element.dataset.row),
          nodes: element.querySelectorAll(".perk-node").length,
          y: element.getBoundingClientRect().y,
        }))
        .sort((a, b) => a.row - b.row),
    );
    assert.deepEqual(
      tiers.map((tier) => tier.row),
      [1, 2, 3, 4, 5, 6, 7, 8, 9],
    );
    assert.deepEqual(
      tiers.map((tier) => tier.nodes),
      [1, 3, 2, 3, 3, 2, 3, 3, 2],
    );
    assert.ok(
      tiers.every((tier, index) => index === 0 || tier.y < tiers[index - 1].y),
      "Trees grow upward from row 1.",
    );
  }
  assert.ok(await slot(page, "warfighter", 2).isDisabled());
  await assertNavFits(page);
  await topOfBoard(page);
  await assertBoardFits(page, true);
  await shot(page, outputDirectory, label, "empty-1440");
  const atlas = await checkTraitAtlas(page);
  await checkCatalog(page, outputDirectory, label);

  const first = await choose(page, "warfighter", 1, { query: "Adrenaline Burst", id: 1, count: 1 });
  await choose(page, "warfighter", 2, { query: "Ammo Scavenger", id: 4, count: 1 });
  await choose(page, "warfighter", 3, { id: 49 });
  const firstNode = slot(page, "warfighter", 1);
  assert.equal(await firstNode.locator(".perk-node-name:visible").count(), 0);
  await showMode(page, "name");
  assert.match(await firstNode.locator(".perk-node-name").innerText(), /肾上腺素飙升/);
  assert.equal(await firstNode.locator(".perk-node-description:visible").count(), 0);
  await showMode(page, "description");
  assert.match(await firstNode.locator(".perk-node-description").innerText(), /战术冲刺/);
  await page.locator("#trait-original").click();
  assert.match(await firstNode.locator(".perk-node-name").innerText(), /Adrenaline Burst/);
  assert.match(await firstNode.locator(".perk-node-description").innerText(), /tactical sprint/i);
  await page.locator("#trait-original").click();
  await topOfBoard(page);
  await shot(page, outputDirectory, label, "detail-1440");
  await showMode(page, "icon");

  const share = page.locator("#trait-share");
  const exported = page.locator("#trait-export");
  if (!(await share.evaluate((el) => el.open))) await share.locator("summary").click();
  const legacy = await exported.inputValue();
  assert.equal(legacy, "DQDAAA", "Centered picks retain their existing V1 code.");
  const minor = slot(page, "warfighter", 2);
  assert.equal(await minor.getAttribute("data-position"), "1");
  await share.locator("summary").click();
  await choose(page, "warfighter", 2, { id: 4, position: 2 });
  assert.equal(await minor.getAttribute("data-position"), "2");
  await share.locator("summary").click();
  const code = await exported.inputValue();
  assert.notEqual(code, legacy);
  assert.match(code, /^[\w-]{1,20}$/);
  await page.context().grantPermissions(["clipboard-read", "clipboard-write"], {
    origin: new URL(page.url()).origin,
  });
  await page.locator("#trait-copy").click();
  await page.waitForFunction(
    async (expected) => (await navigator.clipboard.readText()) === expected,
    code,
  );
  await share.locator("summary").click();
  await choose(page, "warfighter", 2, { id: 4, position: 0 });
  assert.equal(await minor.getAttribute("data-position"), "0");
  await choose(page, "scout", 1);
  await share.locator("summary").click();
  const edited = await exported.inputValue();
  assert.notEqual(edited, code);
  await page.waitForFunction(
    (key) => JSON.parse(localStorage.getItem(key))?.perks?.scout.length === 1,
    dataKey,
  );
  const beforeImport = await readSave();
  await page.locator("#trait-import").fill("!invalid!");
  await page.locator("#trait-apply").click();
  await share.locator("[role=alert]").waitFor();
  assert.equal(await exported.inputValue(), edited);
  assert.deepEqual(await readSave(), beforeImport);
  await page.locator("#trait-import").fill(code);
  await page.locator("#trait-apply").click();
  await page.waitForFunction(
    ({ key, first }) => {
      const build = JSON.parse(localStorage.getItem(key))?.perks;
      return (
        build?.scout.length === 0 && build.warfighter.length === 3 && build.warfighter[0] === first
      );
    },
    { key: dataKey, first },
  );
  assert.equal(await minor.getAttribute("data-position"), "2", "Import restores the clicked lane.");
  const restored = await readSave();
  assert.deepEqual(restored.unlocks, existing.unlocks);
  assert.deepEqual(restored.plans, existing.plans);
  assert.deepEqual(restored.inventory, existing.inventory);
  await page.reload();
  await firstNode.waitFor();
  assert.equal(Number(await firstNode.getAttribute("data-wire-id")), first);
  assert.equal(
    await minor.getAttribute("data-position"),
    "2",
    "Reload preserves the clicked lane.",
  );
  if (!(await share.evaluate((el) => el.open))) await share.locator("summary").click();
  assert.equal(await exported.inputValue(), code);
  await page.locator("#trait-import").fill(legacy);
  await page.locator("#trait-apply").click();
  await page.waitForFunction(
    () => document.querySelector("#trait-warfighter-2")?.dataset.position === "1",
  );
  assert.equal(await exported.inputValue(), legacy, "A legacy import re-exports byte for byte.");
  await page.locator("#trait-import").fill(code);
  await page.locator("#trait-apply").click();
  await page.waitForFunction(
    () => document.querySelector("#trait-warfighter-2")?.dataset.position === "2",
  );
  await share.locator("summary").click();

  // Populate a legal 9/6/3 spread and all permanent slots using the rendered board.
  for (const [branch, start, end] of [
    ["warfighter", 4, 9],
    ["scout", 1, 6],
    ["survivalist", 1, 3],
    ["prestige", 1, 3],
  ]) {
    for (let row = start; row <= end; row++) await choose(page, branch, row);
  }
  assert.ok(await slot(page, "scout", 7).isDisabled(), "Ordinary slots cap at 18 points.");
  await page.waitForFunction(
    (key) => JSON.parse(localStorage.getItem(key))?.perks?.prestige.length === 3,
    dataKey,
  );
  const full = (await readSave()).perks;
  assert.deepEqual(
    [...branchNames, "prestige"].map((branch) => full[branch].length),
    [9, 6, 3, 3],
  );
  await share.locator("summary").click();
  const fullCode = await exported.inputValue();
  assert.match(
    fullCode,
    /^[\w-]{1,19}$/,
    "A 9/6/3 build with one offset and 3 Prestige traits fits 19 characters.",
  );
  await share.locator("summary").click();

  for (const width of [1440, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 900 });
    await topOfBoard(page);
    await assertNoOverflow(page);
    await assertNavFits(page);
    await assertBoardFits(page, width === 1440);
    if (width === 1440 || width === 320) await shot(page, outputDirectory, label, String(width));
    if (width === 390 || width === 320) {
      for (const mode of ["name", "description"]) {
        await showMode(page, mode);
        await topOfBoard(page);
        await assertNoOverflow(page);
        await assertBoardFits(page, false);
        const tier = page.locator(
          '.perk-branch-diagram[data-branch="warfighter"] .perk-tier[data-row="1"]',
        );
        assert.match(await tier.locator(".perk-node-name:visible").innerText(), /肾上腺素飙升/);
        if (mode === "description") {
          const description = tier.locator(".perk-node-description:visible");
          assert.ok(await description.isVisible());
          assert.match(await description.innerText(), /战术冲刺/);
          if (width === 320) await shot(page, outputDirectory, label, "detail-320");
        }
      }
      await showMode(page, "icon");
    }
  }
  await slot(page, "prestige", 3).click();
  const picker = page.locator("dialog.trait-picker[open]");
  await picker.waitFor();
  await assertNoOverflow(page);
  await shot(page, outputDirectory, label, "picker-320");
  await picker.locator("#trait-slot-remove").click();
  await picker.waitFor({ state: "hidden" });
  assert.notEqual(await slot(page, "prestige", 3).getAttribute("data-selected"), "true");
  await share.locator("summary").click();
  await page.locator("#trait-import").fill(fullCode);
  await page.locator("#trait-apply").click();
  await page.waitForFunction(
    (key) => JSON.parse(localStorage.getItem(key))?.perks?.prestige.length === 3,
    dataKey,
  );
  assert.deepEqual((await readSave()).perks, full);
  await share.locator("summary").click();
  const catalog = page.locator("#traits-catalog");
  await catalog.evaluate((el) => el.scrollIntoView({ block: "start" }));
  await shot(page, outputDirectory, label, "catalog-320");
  await page.locator(".language-toggle").click();
  await page.locator("#trait-search").fill("Strong Arm");
  assert.equal((await catalog.locator("article h3").innerText()).trim(), "Strong Arm");
  await assertNavFits(page);
  await assertNoOverflow(page);
  await page.locator(".language-toggle").click();
  await page.setViewportSize({ width: 1440, height: 1000 });
  console.log(
    JSON.stringify({
      check: "traits",
      catalog: 78,
      atlas,
      threePointCodeLength: code.length,
      fullCodeLength: fullCode.length,
    }),
  );
}
