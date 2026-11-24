import assert from "node:assert/strict";
import { resolve } from "node:path";

const catalogTab = '[aria-controls="traits-catalog"]';
const treeTab = '[aria-controls="traits-tree"]';

export async function checkTraitAtlas(page) {
  await page.locator(catalogTab).click();
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

  // Check the browser requested the CSS image before decoding it independently.
  await page.waitForFunction((url) => performance.getEntriesByName(url).length > 0, atlas);
  const details = await page.evaluate(async (url) => {
    const requests = performance.getEntriesByName(url).length;
    const cached = await caches.match(url);
    const image = new Image();
    image.src = url;
    await image.decode();
    return {
      requests,
      cached: Boolean(cached),
      width: image.naturalWidth,
      height: image.naturalHeight,
    };
  }, atlas);
  assert.equal(details.requests, 1, "Displaying multiple traits must request the atlas only once.");
  assert.ok(details.cached, "The PWA must precache the atlas.");
  assert.ok(details.width > 0 && details.height > 0);
  return { icons: images.length, ...details };
}

async function chooseFirst(page, branch, row) {
  const select = page.locator("#trait-" + branch + "-" + row);
  const value = await select
    .locator("option")
    .evaluateAll((options) => options.find((option) => option.value && !option.disabled)?.value);
  assert.ok(value, "Expected an available trait for " + branch + " row " + row);
  await select.selectOption(value);
  return value;
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

export async function checkTraits(page, { assertNoOverflow, outputDirectory, label, dataKey }) {
  const readSave = () => page.evaluate((key) => JSON.parse(localStorage.getItem(key)), dataKey);
  const existing = await readSave();
  const nav = page.locator('.app-navigation a[href$="/traits"]');
  await nav.click();
  await page.locator(".perks-page").waitFor();
  assert.equal(await nav.getAttribute("aria-current"), "page");
  await assertNavFits(page);
  const atlas = await checkTraitAtlas(page);
  const entries = page.locator("#traits-catalog .perk-entry");
  assert.equal(await entries.count(), 78, "Every catalog trait is available.");
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: resolve(outputDirectory, label + "-traits-catalog-1440.png") });
  const search = page.locator("#trait-search");
  await search.fill("Strong Arm");
  assert.equal(await entries.count(), 1);
  const name = entries.locator("h3");
  const effect = entries.locator("p").first();
  const translation = { name: await name.innerText(), effect: await effect.innerText() };
  assert.match(translation.name, /\p{Script=Han}/u);
  assert.match(translation.effect, /\p{Script=Han}/u);
  const nameMark = name.locator(".perk-mark");
  await nameMark.click();
  assert.ok((await name.innerText()).includes("Strong Arm"));
  assert.equal(await effect.innerText(), translation.effect);
  await nameMark.click();
  assert.equal(await name.innerText(), translation.name);
  const source = entries.getByRole("link");
  assert.equal(await source.getAttribute("href"), "https://dmzhub.gg/traits/strong-arm");
  assert.equal(await source.getAttribute("target"), "_blank");
  const effectMark = effect.locator(".perk-mark");
  await effectMark.click();
  assert.match(await effect.locator('q[lang="en"]').innerText(), /throw/i);
  assert.equal(await name.innerText(), translation.name);
  await effectMark.click();
  assert.equal(await effect.innerText(), translation.effect);
  const original = page.locator("#trait-original");
  await original.click();
  assert.equal((await name.innerText()).trim(), "Strong Arm");
  assert.notEqual(await effect.innerText(), translation.effect);
  assert.match(await effect.innerText(), /[A-Za-z]/);
  await original.click();
  assert.equal(await name.innerText(), translation.name);
  assert.equal(await effect.innerText(), translation.effect);
  await search.fill("");
  await page.locator(treeTab).click();
  const first = await chooseFirst(page, "warfighter", 1);
  await chooseFirst(page, "warfighter", 2);
  await chooseFirst(page, "warfighter", 3);
  const share = page.locator("#trait-share");
  if ((await share.getAttribute("open")) === null) await share.locator("summary").click();
  const exported = page.locator("#trait-export");
  const code = await exported.inputValue();
  assert.match(code, /^[\w-]{1,20}$/);
  await page.context().grantPermissions(["clipboard-read", "clipboard-write"], {
    origin: new URL(page.url()).origin,
  });
  await page.locator("#trait-copy").click();
  await page.waitForFunction(
    async (expected) => (await navigator.clipboard.readText()) === expected,
    code,
  );
  await chooseFirst(page, "scout", 1);
  const edited = await exported.inputValue();
  assert.notEqual(edited, code);
  await page.waitForFunction(
    (key) => JSON.parse(localStorage.getItem(key))?.perks?.scout.length === 1,
    dataKey,
  );
  const beforeImport = await readSave();
  await page.locator("#trait-import").fill("!invalid!");
  await page.locator("#trait-apply").click();
  await page.locator(".perks-page [role=alert]").waitFor();
  assert.equal(await exported.inputValue(), edited);
  assert.deepEqual(await readSave(), beforeImport);

  await page.locator("#trait-import").fill(code);
  await page.locator("#trait-apply").click();
  await page.waitForFunction(
    ({ key, value }) => {
      const tree = JSON.parse(localStorage.getItem(key))?.perks;
      return (
        tree?.scout.length === 0 &&
        tree.warfighter.length === 3 &&
        String(tree.warfighter[0]) === value
      );
    },
    { key: dataKey, value: first },
  );
  const restored = await readSave();
  assert.deepEqual(restored.unlocks, existing.unlocks);
  assert.deepEqual(restored.plans, existing.plans);
  assert.deepEqual(restored.inventory, existing.inventory);
  await page.reload();
  await page.locator(treeTab).click();
  assert.equal(await page.locator("#trait-warfighter-1").inputValue(), first);
  if ((await share.getAttribute("open")) === null) await share.locator("summary").click();
  assert.equal(await exported.inputValue(), code);
  await page.locator("#trait-share > summary").click();

  for (const width of [1440, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 900 });
    await assertNoOverflow(page);
    await assertNavFits(page);
    if (width === 1440 || width === 320) {
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.screenshot({
        path: resolve(outputDirectory, label + "-traits-" + width + ".png"),
      });
    }
  }
  await page.locator(catalogTab).click();
  await assertNoOverflow(page);
  await page.locator(".language-toggle").click();
  await search.fill("Strong Arm");
  assert.equal((await name.innerText()).trim(), "Strong Arm");
  await assertNavFits(page);
  await assertNoOverflow(page);
  await page.locator(".language-toggle").click();
  await page.setViewportSize({ width: 1440, height: 1000 });
  console.log(
    JSON.stringify({ check: "traits", catalog: 78, atlas, threePointCodeLength: code.length }),
  );
}
