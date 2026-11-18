// 由 prepare-pwa.mjs 注入构建清单；此模板不由浏览器直接加载。
const config = __DMZ_PWA_CONFIG__;
const cacheName = config.cachePrefix + config.buildId;
const resourcePaths = new Set(config.files.map((file) => file.url));

function inScope(url) {
  return url.origin === self.location.origin && url.pathname.startsWith(config.base);
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      try {
        const cache = await caches.open(cacheName);
        await cache.addAll(
          config.files.map(
            (file) =>
              new Request(new URL(file.url, self.location.origin), {
                cache: file.immutable ? "default" : "reload",
                integrity: file.integrity,
              }),
          ),
        );
      } catch (error) {
        // 失败的候选版本不能污染或删除仍在使用的版本。
        await caches.delete(cacheName);
        throw error;
      }
    })(),
  );
});

self.addEventListener("activate", (event) => {
  // 点击更新可能接管仍运行旧脚本的其他标签页，不能在此删除旧 lazy chunks。
  event.waitUntil(self.clients.claim());
});

async function cleanUnusedCaches(event) {
  if (event.data.buildId !== config.buildId) return;
  if (self.registration.installing || self.registration.waiting) return;
  const source = event.source;
  if (!source || !("id" in source) || !inScope(new URL(source.url))) return;
  const windows = (
    await self.clients.matchAll({ type: "window", includeUncontrolled: true })
  ).filter((client) => inScope(new URL(client.url)));
  if (windows.length !== 1 || windows[0].id !== source.id) return;
  // 再次检查，避免查询 clients 期间出现新候选版本。
  if (self.registration.installing || self.registration.waiting) return;
  const names = await caches.keys();
  if (self.registration.installing || self.registration.waiting) return;
  await Promise.all(
    names
      .filter((name) => name.startsWith(config.cachePrefix) && name !== cacheName)
      .map((name) => caches.delete(name)),
  );
}

self.addEventListener("message", (event) => {
  if (!event.source || !("url" in event.source) || !inScope(new URL(event.source.url))) return;
  if (event.data?.type === "SKIP_WAITING") {
    event.waitUntil(self.skipWaiting());
  } else if (event.data?.type === "CLIENT_READY") {
    // 缓存回收是尽力操作，失败不影响已缓存页面或用户数据。
    event.waitUntil(cleanUnusedCaches(event).catch(() => {}));
  }
});

async function cachedResponse(request, url) {
  try {
    const current = await caches.open(cacheName);
    if (request.mode === "navigate") {
      const entry = config.navigation[url.pathname] ?? config.fallback;
      const page = await current.match(new URL(entry, self.location.origin).href);
      if (page) return page;
    } else {
      const key = new URL(url.pathname, self.location.origin).href;
      const response = await current.match(key);
      if (response) return response;
      // 未刷新的标签页仍可按精确 URL 取得其旧 hash 资源。
      if (url.pathname.startsWith(config.base + "assets/")) {
        for (const name of await caches.keys()) {
          if (!name.startsWith(config.cachePrefix) || name === cacheName) continue;
          const previous = await caches.open(name);
          const older = await previous.match(key);
          if (older) return older;
        }
      }
    }
  } catch {
    // 浏览器禁用或回收 Cache Storage 时，在线请求照常继续。
  }
  return fetch(request);
}

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (!inScope(url)) return;
  if (
    request.mode !== "navigate" &&
    !resourcePaths.has(url.pathname) &&
    !url.pathname.startsWith(config.base + "assets/")
  ) {
    return;
  }
  event.respondWith(cachedResponse(request, url));
});
