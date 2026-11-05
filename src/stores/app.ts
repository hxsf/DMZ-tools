import { batch, computed, signal } from "@preact/signals";
import { None, Some, type Option } from "ts-results-es";
import { loadSnapshot, saveSnapshot, type LoadResult, type SaveResult } from "../storage";
import type { AsyncKV } from "../types/storage";
import { createStores } from "./index";

type LoadStatus = "loading" | "ready" | "error";
type SaveStatus = "idle" | "saving" | "saved" | "error";
type LoadIssue = Exclude<LoadResult, { readonly status: "ready" | "empty" }>;
type SaveIssue = Extract<SaveResult, { readonly status: "failed" }>;

/** 显式加载与保存；实例创建不访问存储，只有加载成功后才允许写入。 */
export function createAppState(kv: AsyncKV) {
  const stores = createStores();
  const loadStatus = signal<LoadStatus>("loading");
  const saveStatus = signal<SaveStatus>("idle");
  const loadIssue = signal<Option<LoadIssue>>(None);
  const saveIssue = signal<Option<SaveIssue>>(None);
  let loading: Option<Promise<void>> = None;
  let saveQueue = Promise.resolve();
  let pendingSaves = 0;

  function load(): Promise<void> {
    if (loadStatus.value === "ready") return Promise.resolve();
    if (loading.isSome()) return loading.value;

    batch(() => {
      loadStatus.value = "loading";
      loadIssue.value = None;
    });
    const task = loadSnapshot(kv)
      .then((result) => {
        batch(() => {
          if (result.status === "ready" || result.status === "empty") {
            if (result.status === "ready") stores.restore(result.snapshot);
            loadStatus.value = "ready";
            loadIssue.value = None;
          } else {
            loadIssue.value = Some(result);
            loadStatus.value = "error";
          }
        });
      })
      .finally(() => {
        loading = None;
      });
    loading = Some(task);
    return task;
  }

  function persist(): Promise<void> {
    if (loadStatus.value !== "ready") return Promise.resolve();

    // 调用时即固定快照，等待队列期间的后续修改由下一次保存处理。
    const snapshot = stores.snapshot();
    pendingSaves++;
    saveStatus.value = "saving";
    const task = saveQueue.then(async () => {
      const result = await saveSnapshot(kv, snapshot);
      pendingSaves--;
      batch(() => {
        saveIssue.value = result.status === "failed" ? Some(result) : None;
        saveStatus.value =
          pendingSaves > 0 ? "saving" : result.status === "saved" ? "saved" : "error";
      });
    });
    saveQueue = task;
    return task;
  }

  return {
    stores,
    loadStatus: computed(() => loadStatus.value),
    saveStatus: computed(() => saveStatus.value),
    loadIssue: computed(() => loadIssue.value),
    saveIssue: computed(() => saveIssue.value),
    load,
    persist,
  };
}
