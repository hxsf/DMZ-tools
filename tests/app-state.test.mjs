import assert from "node:assert/strict";
import { setImmediate } from "node:timers/promises";
import { test } from "node:test";
import { Err, None, Ok, Some } from "ts-results-es";

const { createAppState, createEmptySnapshot, STORAGE_KEY } = await import(
  process.env.DMZ_TEST_RUNTIME
);

function memoryKV(snapshot) {
  let text = snapshot ? JSON.stringify(snapshot) : undefined;
  const calls = { reads: 0, writes: 0 };
  return {
    calls,
    async get(key) {
      assert.equal(key, STORAGE_KEY);
      calls.reads++;
      return Ok(text === undefined ? None : Some(text));
    },
    async set(key, value) {
      assert.equal(key, STORAGE_KEY);
      calls.writes++;
      text = value;
      return Ok(undefined);
    },
    async delete() {
      text = undefined;
      return Ok(undefined);
    },
  };
}

test("应用状态显式加载且不隐式保存，重复加载不覆盖已经编辑的状态", async () => {
  const original = createEmptySnapshot();
  original.inventory.items["item:metals"] = 6;
  const kv = memoryKV(original);
  const app = createAppState(kv);
  assert.deepEqual(kv.calls, { reads: 0, writes: 0 });
  await app.persist();
  assert.equal(kv.calls.writes, 0);

  await app.load();
  assert.equal(app.loadStatus.value, "ready");
  assert.equal(app.stores.inventory.state.value.items["item:metals"], 6);
  app.stores.inventory.setQuantity("item:metals", 7);
  assert.equal(kv.calls.writes, 0);
  await app.load();
  assert.equal(kv.calls.reads, 1);
  assert.equal(app.stores.inventory.state.value.items["item:metals"], 7);

  await app.persist();
  assert.equal(kv.calls.writes, 1);
  assert.equal(app.saveStatus.value, "saved");
  assert.equal(app.saveIssue.value.isNone(), true);
});

test("加载失败保留状态并阻断保存，可以重试读取有效存档", async () => {
  const inaccessible = {
    code: "access-denied",
    operation: "get",
    key: STORAGE_KEY,
    cause: new Error("blocked"),
  };
  for (const [initial, status] of [
    [Ok(Some("{")), "invalid"],
    [Ok(Some(JSON.stringify({ schemaVersion: 2 }))), "unsupported-version"],
    [Err(inaccessible), "unavailable"],
  ]) {
    let response = initial;
    let writes = 0;
    const app = createAppState({
      async get() {
        return response;
      },
      async set() {
        writes++;
        return Ok(undefined);
      },
    });
    app.stores.inventory.setQuantity("item:metals", 9);
    await app.load();
    assert.equal(app.loadStatus.value, "error");
    assert.equal(app.loadIssue.value.isSome(), true);
    assert.equal(app.loadIssue.value.value.status, status);
    assert.equal(app.stores.inventory.state.value.items["item:metals"], 9);
    await app.persist();
    assert.equal(writes, 0);

    const recovered = createEmptySnapshot();
    recovered.inventory.items["item:metals"] = 4;
    response = Ok(Some(JSON.stringify(recovered)));
    await app.load();
    assert.equal(app.loadStatus.value, "ready");
    assert.equal(app.loadIssue.value.isNone(), true);
    assert.equal(app.stores.inventory.state.value.items["item:metals"], 4);
  }
});

test("同时请求加载共用一次读取，读取完成前不会保存默认状态", async () => {
  const read = Promise.withResolvers();
  let reads = 0;
  let writes = 0;
  const app = createAppState({
    get() {
      reads++;
      return read.promise;
    },
    async set() {
      writes++;
      return Ok(undefined);
    },
  });
  const first = app.load();
  const second = app.load();
  assert.equal(first, second);
  await app.persist();
  assert.equal(reads, 1);
  assert.equal(writes, 0);
  assert.equal(app.loadStatus.value, "loading");
  read.resolve(Ok(None));
  await first;
  assert.equal(app.loadStatus.value, "ready");
});

test("连续保存按调用顺序写入，各自使用调用时快照", async () => {
  const writes = [];
  const gates = [Promise.withResolvers(), Promise.withResolvers()];
  const app = createAppState({
    async get() {
      return Ok(None);
    },
    async set(key, text) {
      assert.equal(key, STORAGE_KEY);
      const index = writes.length;
      writes.push(JSON.parse(text));
      await gates[index].promise;
      return Ok(undefined);
    },
  });
  await app.load();
  app.stores.inventory.setQuantity("item:metals", 5);
  const first = app.persist();
  app.stores.inventory.setQuantity("item:metals", 8);
  const second = app.persist();
  app.stores.inventory.setQuantity("item:metals", 12);
  await setImmediate();
  assert.equal(writes.length, 1);
  assert.equal(writes[0].inventory.items["item:metals"], 5);
  assert.equal(app.saveStatus.value, "saving");

  gates[0].resolve();
  await first;
  await setImmediate();
  assert.equal(writes.length, 2);
  assert.equal(writes[1].inventory.items["item:metals"], 8);
  assert.equal(app.saveStatus.value, "saving");
  gates[1].resolve();
  await second;
  assert.equal(app.saveStatus.value, "saved");
  assert.equal(app.stores.inventory.state.value.items["item:metals"], 12);
});

test("写入 Err 不阻断后续重试，重试保存最新状态并保留失败诊断", async () => {
  const issue = {
    code: "quota-exceeded",
    operation: "set",
    key: STORAGE_KEY,
    cause: new Error("full"),
  };
  let fail = true;
  let saved;
  const app = createAppState({
    async get() {
      return Ok(None);
    },
    async set(key, text) {
      if (fail) return Err(issue);
      saved = JSON.parse(text);
      return Ok(undefined);
    },
  });
  await app.load();
  app.stores.inventory.setQuantity("item:metals", 5);
  await app.persist();
  assert.equal(app.saveStatus.value, "error");
  assert.equal(app.saveIssue.value.isSome(), true);
  assert.equal(app.saveIssue.value.value.error, issue);
  assert.equal(app.stores.inventory.state.value.items["item:metals"], 5);

  fail = false;
  app.stores.inventory.setQuantity("item:metals", 8);
  await app.persist();
  assert.equal(saved.inventory.items["item:metals"], 8);
  assert.equal(app.saveStatus.value, "saved");
  assert.equal(app.saveIssue.value.isNone(), true);
});
