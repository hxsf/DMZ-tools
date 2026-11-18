import { computed, signal } from "@preact/signals";
import { None, Some, type Option } from "ts-results-es";
import { appPath } from "./paths";

type PwaStatus = "offlineReady" | "updateReady" | "updating" | "unavailable" | "updateFailed";

/** 仅管理应用资源缓存；不读取或修改用户 KV。创建实例不会注册 Service Worker。 */
export function createPwaClient() {
  const status = signal<Option<PwaStatus>>(None);
  let registration: Option<ServiceWorkerRegistration> = None;
  let updateTimeout: Option<number> = None;
  let disposed = false;
  let started = false;
  let reloadRequested = false;
  let activatedElsewhere = false;
  const cleanups: (() => void)[] = [];

  function listen(target: EventTarget, name: string, handler: EventListener) {
    target.addEventListener(name, handler);
    cleanups.push(() => target.removeEventListener(name, handler));
  }

  function clearUpdateTimeout() {
    if (updateTimeout.isSome()) window.clearTimeout(updateTimeout.value);
    updateTimeout = None;
  }

  function reportReady() {
    const build = document.querySelector<HTMLMetaElement>('meta[name="dmz-tools-build"]');
    if (build?.content) {
      navigator.serviceWorker.controller?.postMessage({
        type: "CLIENT_READY",
        buildId: build.content,
      });
    }
  }

  function start(): () => void {
    if (started || !import.meta.env.PROD || typeof window === "undefined") return () => {};
    started = true;
    disposed = false;
    if (!("serviceWorker" in navigator) || !window.isSecureContext) return () => {};

    let hadController = Boolean(navigator.serviceWorker.controller);
    const firstVisit = !hadController;
    const observed = new WeakSet<ServiceWorker>();

    function offlineReady() {
      const previous = status.value;
      if (!disposed && firstVisit && (previous.isNone() || previous.value === "unavailable")) {
        status.value = Some<PwaStatus>("offlineReady");
      }
      reportReady();
    }

    function observe(worker: ServiceWorker) {
      if (observed.has(worker)) return;
      observed.add(worker);
      let wasActive = worker.state === "activated";
      const changed = () => {
        if (disposed) return;
        if (worker.state === "installed" && registration.isSome()) {
          if (registration.value.waiting && registration.value.active) {
            status.value = Some<PwaStatus>("updateReady");
          }
        } else if (worker.state === "activated") {
          wasActive = true;
          offlineReady();
        } else if (worker.state === "redundant" && !wasActive) {
          if (
            registration.isSome() &&
            registration.value.installing &&
            registration.value.installing !== worker
          ) {
            return;
          }
          status.value = Some<PwaStatus>(hadController ? "updateFailed" : "unavailable");
        }
      };
      listen(worker, "statechange", changed);
      changed();
    }

    listen(navigator.serviceWorker, "controllerchange", () => {
      if (disposed || !navigator.serviceWorker.controller) return;
      clearUpdateTimeout();
      if (reloadRequested) {
        reloadRequested = false;
        window.location.reload();
        return;
      }
      // 另一个标签页接受了更新时，当前标签页继续保留未保存的打印草稿。
      if (hadController) {
        activatedElsewhere = true;
        status.value = Some<PwaStatus>("updateReady");
      } else {
        hadController = true;
        offlineReady();
      }
    });

    async function register() {
      try {
        const current = await navigator.serviceWorker.register(appPath("/sw.js"), {
          scope: import.meta.env.BASE_URL,
          updateViaCache: "none",
        });
        if (disposed) return;
        registration = Some(current);
        listen(current, "updatefound", () => {
          if (current.installing) observe(current.installing);
        });
        if (current.waiting && current.active) status.value = Some<PwaStatus>("updateReady");
        if (current.installing) observe(current.installing);
        if (current.active?.state === "activated") {
          if (!current.waiting && !current.installing) offlineReady();
          else reportReady();
        }

        // SPA 路由切换不会触发文档导航；重新联网或回到页面时也检查更新。
        let lastCheck = Date.now();
        const check = () => {
          if (document.visibilityState === "hidden" || Date.now() - lastCheck < 60_000) return;
          lastCheck = Date.now();
          reportReady();
          void current.update().catch(() => {
            // 离线检查更新失败不影响已经可用的缓存。
          });
        };
        listen(window, "online", check);
        listen(document, "visibilitychange", check);
      } catch {
        if (!disposed && !navigator.serviceWorker.controller) {
          status.value = Some<PwaStatus>("unavailable");
        }
      }
    }

    if (document.readyState === "complete") void register();
    else listen(window, "load", () => void register());

    return () => {
      disposed = true;
      reloadRequested = false;
      clearUpdateTimeout();
      for (const cleanup of cleanups) cleanup();
      cleanups.length = 0;
    };
  }

  async function update(): Promise<void> {
    if (disposed || registration.isNone()) return;
    const current = registration.value;
    if (activatedElsewhere && !current.waiting) {
      window.location.reload();
      return;
    }
    if (!current.waiting) {
      try {
        await current.update();
      } catch {
        if (!disposed) status.value = Some<PwaStatus>("updateFailed");
      }
      return;
    }
    try {
      reloadRequested = true;
      status.value = Some<PwaStatus>("updating");
      clearUpdateTimeout();
      updateTimeout = Some(
        window.setTimeout(() => {
          reloadRequested = false;
          status.value = Some<PwaStatus>("updateFailed");
          updateTimeout = None;
        }, 20_000),
      );
      current.waiting.postMessage({ type: "SKIP_WAITING" });
    } catch {
      clearUpdateTimeout();
      reloadRequested = false;
      status.value = Some<PwaStatus>("updateFailed");
    }
  }

  return {
    status: computed(() => status.value),
    start,
    update,
    dismiss() {
      status.value = None;
    },
  };
}
