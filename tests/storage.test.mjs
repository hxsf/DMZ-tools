import assert from "node:assert/strict";
import { setImmediate } from "node:timers/promises";
import { test } from "node:test";
import { Err, Ok, Option, Some } from "ts-results-es";

const { createBrowserKV, createEmptySnapshot, loadSnapshot, saveSnapshot, STORAGE_KEY } =
  await import(process.env.DMZ_TEST_RUNTIME);

function browserStorage(entries = []) {
  const values = new Map(entries);
  return {
    getItem(key) {
      return values.get(key) ?? null;
    },
    setItem(key, value) {
      values.set(key, value);
    },
    removeItem(key) {
      values.delete(key);
    },
  };
}

async function assertPending(promise) {
  const state = await Promise.race([
    promise.then(() => "settled"),
    setImmediate().then(() => "pending"),
  ]);
  assert.equal(state, "pending");
}

function assertOk(result, expected) {
  assert.equal(result.isOk(), true);
  assert.equal(result.value, expected);
}

function assertSome(result, expected) {
  assert.equal(result.isOk(), true);
  assert.equal(result.value.isSome(), true);
  assert.equal(result.value.value, expected);
}

function assertNone(result) {
  assert.equal(result.isOk(), true);
  assert.equal(result.value.isNone(), true);
}

function assertKVError(result, code, operation, key, cause) {
  assert.equal(result.isErr(), true);
  assert.equal(result.error.code, code);
  assert.equal(result.error.operation, operation);
  assert.equal(result.error.key, key);
  assert.equal(result.error.cause, cause);
}

test("读取等待异步 KV 完成才返回存档", async () => {
  const read = Promise.withResolvers();
  const snapshot = createEmptySnapshot();
  snapshot.inventory.items["item:metals"] = 6;
  const storage = {
    get(key) {
      assert.equal(key, STORAGE_KEY);
      return read.promise;
    },
  };

  const loading = loadSnapshot(storage);
  await assertPending(loading);
  read.resolve(Ok(Some(JSON.stringify(snapshot))));
  assert.deepEqual(await loading, { status: "ready", snapshot });
});

test("保存等待写入完成，并固定调用时的快照内容", async () => {
  const write = Promise.withResolvers();
  let value;
  const storage = {
    async get() {
      return Ok(Option.fromOptional(value));
    },
    async set(key, text) {
      assert.equal(key, STORAGE_KEY);
      await write.promise;
      value = text;
      return Ok(undefined);
    },
  };
  const snapshot = createEmptySnapshot();
  snapshot.inventory.items["item:metals"] = 6;
  const saving = saveSnapshot(storage, snapshot);
  snapshot.inventory.items["item:metals"] = 99;

  await assertPending(saving);
  assert.equal(value, undefined);
  write.resolve();
  assert.deepEqual(await saving, { status: "saved" });
  const loaded = await loadSnapshot(storage);
  assert.equal(loaded.status, "ready");
  assert.equal(loaded.snapshot.inventory.items["item:metals"], 6);
});

test("延迟返回的 KV Err 保留原错误和 cause，不被转换成成功", async () => {
  const read = Promise.withResolvers();
  const write = Promise.withResolvers();
  const storage = {
    get() {
      return read.promise;
    },
    set() {
      return write.promise;
    },
  };
  const loading = loadSnapshot(storage);
  await assertPending(loading);
  const readCause = new Error("network read failed");
  const readError = {
    code: "unavailable",
    operation: "get",
    key: STORAGE_KEY,
    cause: readCause,
  };
  read.resolve(Err(readError));
  const loaded = await loading;
  assert.equal(loaded.status, "unavailable");
  assert.equal(loaded.error, readError);
  assert.equal(loaded.error.cause, readCause);

  const saving = saveSnapshot(storage, createEmptySnapshot());
  await assertPending(saving);
  const writeCause = new Error("network write failed");
  const writeError = {
    code: "unavailable",
    operation: "set",
    key: STORAGE_KEY,
    cause: writeCause,
  };
  write.resolve(Err(writeError));
  const saved = await saving;
  assert.equal(saved.status, "failed");
  assert.equal(saved.error, writeError);
  assert.equal(saved.error.cause, writeCause);
});

test("无效快照不会进入 KV 写入层", async () => {
  let writes = 0;
  const storage = {
    async set() {
      writes++;
      return Ok(undefined);
    },
  };
  const snapshot = createEmptySnapshot();
  snapshot.inventory.items["item:metals"] = -1;
  for (const invalid of [snapshot, { ...createEmptySnapshot(), schemaVersion: 2 }]) {
    const saved = await saveSnapshot(storage, invalid);
    assert.equal(saved.status, "failed");
    assert.equal(saved.error.code, "invalid-snapshot");
    assert.ok(saved.error.cause instanceof Error);
  }
  assert.equal(writes, 0);
});

test("浏览器适配器直接读取原 localStorage 存档，更新不影响其他键", async () => {
  const original = createEmptySnapshot();
  original.inventory.items["item:metals"] = 6;
  original.unlocks.manuals["item:manual-m4"] = {
    status: "unlocked",
    updatedAt: "2026-11-05T00:00:00.000Z",
  };
  const raw = JSON.stringify(original);
  const browser = browserStorage([
    ["dmz-tools:user", raw],
    ["another-app", "preserve me"],
  ]);
  const storage = createBrowserKV(() => browser);

  assert.deepEqual(await loadSnapshot(storage), { status: "ready", snapshot: original });
  assert.equal(browser.getItem("dmz-tools:user"), raw);
  const updated = structuredClone(original);
  updated.inventory.items["item:metals"] = 7;
  assert.equal((await saveSnapshot(storage, updated)).status, "saved");
  assert.deepEqual(JSON.parse(browser.getItem("dmz-tools:user")), updated);
  assert.equal(browser.getItem("another-app"), "preserve me");
});

test("浏览器 KV 懒访问 Storage，区分空字符串与缺失，删除仅影响指定键", async () => {
  const browser = browserStorage([["unrelated", "keep"]]);
  let accesses = 0;
  const storage = createBrowserKV(() => {
    accesses++;
    return browser;
  });
  assert.equal(accesses, 0);
  assertNone(await storage.get("missing"));
  assert.equal(accesses, 1);
  assertOk(await storage.set("empty", ""), undefined);
  assertSome(await storage.get("empty"), "");
  assertOk(await storage.set("other", "second value"), undefined);
  assertOk(await storage.delete("empty"), undefined);
  assertNone(await storage.get("empty"));
  assertOk(await storage.delete("empty"), undefined);
  assertSome(await storage.get("other"), "second value");
  assertSome(await storage.get("unrelated"), "keep");
});

test("浏览器权限异常以 Err 返回，包含操作、键和原始 cause", async () => {
  const cause = new DOMException("Storage disabled", "SecurityError");
  const denied = createBrowserKV(() => {
    throw cause;
  });
  for (const [operation, invoke] of [
    ["get", () => denied.get("key")],
    ["set", () => denied.set("key", "value")],
    ["delete", () => denied.delete("key")],
  ]) {
    let pending;
    assert.doesNotThrow(() => {
      pending = invoke();
    });
    assertKVError(await pending, "access-denied", operation, "key", cause);
  }
  const loaded = await loadSnapshot(denied);
  assert.equal(loaded.status, "unavailable");
  assert.equal(loaded.error.code, "access-denied");
  assert.equal(loaded.error.cause, cause);
  const saved = await saveSnapshot(denied, createEmptySnapshot());
  assert.equal(saved.status, "failed");
  assert.equal(saved.error.code, "access-denied");
  assert.equal(saved.error.cause, cause);
});

test("额度不足返回 quota-exceeded，原存档保持不变", async () => {
  const original = JSON.stringify(createEmptySnapshot());
  const browser = browserStorage([[STORAGE_KEY, original]]);
  const cause = new DOMException("Storage full", "QuotaExceededError");
  const full = createBrowserKV(() => ({
    ...browser,
    setItem() {
      throw cause;
    },
  }));
  assertKVError(
    await full.set(STORAGE_KEY, "replacement"),
    "quota-exceeded",
    "set",
    STORAGE_KEY,
    cause,
  );
  const saved = await saveSnapshot(full, createEmptySnapshot());
  assert.equal(saved.status, "failed");
  assert.equal(saved.error.code, "quota-exceeded");
  assert.equal(saved.error.cause, cause);
  assert.equal(browser.getItem(STORAGE_KEY), original);
});

test("浏览器各操作的未知异常返回 unavailable，保留任意原始 cause", async () => {
  for (const cause of [new Error("device failed"), "unexpected failure", null]) {
    const unavailable = createBrowserKV(() => ({
      getItem() {
        throw cause;
      },
      setItem() {
        throw cause;
      },
      removeItem() {
        throw cause;
      },
    }));
    for (const [operation, invoke] of [
      ["get", () => unavailable.get("key")],
      ["set", () => unavailable.set("key", "value")],
      ["delete", () => unavailable.delete("key")],
    ]) {
      assertKVError(await invoke(), "unavailable", operation, "key", cause);
    }
  }
});
