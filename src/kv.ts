import { Option, Result } from "ts-results-es";
import type { AsyncKV, KVError, KVOperation } from "./types/storage";

type BrowserStorage = Pick<Storage, "getItem" | "setItem" | "removeItem">;

function storageError(operation: KVOperation, key: string, cause: unknown): KVError {
  const name = cause instanceof Error ? cause.name : undefined;
  const code =
    name === "SecurityError"
      ? "access-denied"
      : name === "QuotaExceededError"
        ? "quota-exceeded"
        : "unavailable";
  return { code, operation, key, cause };
}

/**
 * 首个 KV 实现，沿用 localStorage 中的现有数据。
 * localStorage 本身同步；此适配器统一 Promise 接口，不将它变成非阻塞 I/O。
 * 实际读写时才获取 Storage，原生 API 异常在此边界转成 Err。
 */
export function createBrowserKV(
  getStorage: () => BrowserStorage = () => globalThis.localStorage,
): AsyncKV {
  return {
    async get(key) {
      return Result.wrap(() => getStorage().getItem(key))
        .map(Option.fromNullable)
        .mapErr((cause) => storageError("get", key, cause));
    },
    async set(key, value) {
      return Result.wrap(() => getStorage().setItem(key, value)).mapErr((cause) =>
        storageError("set", key, cause),
      );
    },
    async delete(key) {
      return Result.wrap(() => getStorage().removeItem(key)).mapErr((cause) =>
        storageError("delete", key, cause),
      );
    },
  };
}
