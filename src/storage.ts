import { Result } from "ts-results-es";
import type {
  Inventory,
  UnlockProgress,
  UnlockRecord,
  UnlockStatus,
  UserSnapshot,
} from "./types/progress";
import type { RequirementPlan } from "./types/requirement";
import type { AsyncKV, KVError } from "./types/storage";
import type { CapabilityId } from "./types/unlock";

export const STORAGE_KEY = "dmz-tools:user";

export type ParseResult =
  | { readonly status: "ready"; readonly snapshot: UserSnapshot }
  | { readonly status: "invalid"; readonly message: string }
  | { readonly status: "unsupported-version"; readonly version: number };

export type LoadResult =
  | ParseResult
  | { readonly status: "empty" }
  | { readonly status: "unavailable"; readonly message: string; readonly error: KVError };

export type SaveResult =
  | { readonly status: "saved" }
  | {
      readonly status: "failed";
      readonly message: string;
      readonly error: KVError | { readonly code: "invalid-snapshot"; readonly cause: unknown };
    };

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function isId(value: unknown, prefix: string): value is string {
  return typeof value === "string" && value.startsWith(prefix) && value.length > prefix.length;
}

export function isCount(value: unknown): value is number {
  return typeof value === "number" && Number.isSafeInteger(value) && value >= 0;
}

export function isUnlockStatus(value: unknown): value is UnlockStatus {
  return value === "unknown" || value === "locked" || value === "unlocked";
}

function isUnlockRecord(value: unknown): value is UnlockRecord {
  return (
    isObject(value) &&
    isUnlockStatus(value.status) &&
    typeof value.updatedAt === "string" &&
    Number.isFinite(Date.parse(value.updatedAt))
  );
}

function isRecord(
  value: unknown,
  validKey: (key: string) => boolean,
  validValue: (entry: unknown) => boolean,
): boolean {
  return (
    isObject(value) &&
    Object.entries(value).every(([key, entry]) => validKey(key) && validValue(entry))
  );
}

export function isRequirementPlan(value: unknown): value is RequirementPlan {
  return (
    isObject(value) &&
    isId(value.id, "plan:") &&
    typeof value.title === "string" &&
    value.title.trim().length > 0 &&
    (value.status === "active" || value.status === "paused" || value.status === "completed") &&
    isCount(value.priority) &&
    Array.isArray(value.targets) &&
    value.targets.every(
      (target: unknown) =>
        isObject(target) &&
        isCount(target.quantity) &&
        target.quantity > 0 &&
        ((target.kind === "collect" && isId(target.itemId, "item:")) ||
          (target.kind === "craft" &&
            isId(target.recipeId, "recipe:") &&
            (target.outputPerCraft === undefined ||
              (isCount(target.outputPerCraft) && target.outputPerCraft > 0)))),
    )
  );
}

const capabilityIds = new Set([
  "3d-printer",
  "field-upgrade-printing",
  "uncommon-ingredient-printing",
  "epic-ingredient-printing",
  "gunsmith",
]);

export function isCapabilityId(value: unknown): value is CapabilityId {
  return typeof value === "string" && capabilityIds.has(value);
}

export function isInventory(value: unknown): value is Inventory {
  return (
    isObject(value) &&
    isRecord(value.items, (key) => isId(key, "item:"), isCount) &&
    (value.cash === null || isCount(value.cash))
  );
}

export function isUnlockProgress(value: unknown): value is UnlockProgress {
  return (
    isObject(value) &&
    isRecord(value.recipes, (key) => isId(key, "recipe:"), isUnlockRecord) &&
    isRecord(value.manuals, (key) => isId(key, "item:"), isUnlockRecord) &&
    isRecord(value.capabilities, isCapabilityId, isUnlockRecord) &&
    (value.dmzLevel === null || (isCount(value.dmzLevel) && value.dmzLevel > 0))
  );
}

export function isPlans(value: unknown): value is readonly RequirementPlan[] {
  return (
    Array.isArray(value) &&
    value.every(isRequirementPlan) &&
    new Set(value.map((plan) => plan.id)).size === value.length
  );
}

export function isUserSnapshot(value: unknown): value is UserSnapshot {
  return (
    isObject(value) &&
    value.schemaVersion === 1 &&
    isInventory(value.inventory) &&
    isUnlockProgress(value.unlocks) &&
    isPlans(value.plans)
  );
}

export function createEmptySnapshot(): UserSnapshot {
  return {
    schemaVersion: 1,
    inventory: { items: {}, cash: null },
    unlocks: { recipes: {}, manuals: {}, capabilities: {}, dmzLevel: null },
    plans: [],
  };
}

export function parseSnapshot(text: string): ParseResult {
  let value: unknown;
  try {
    value = JSON.parse(text);
  } catch {
    return { status: "invalid", message: "存档不是有效的 JSON。" };
  }
  if (isObject(value) && typeof value.schemaVersion === "number" && value.schemaVersion !== 1) {
    return { status: "unsupported-version", version: value.schemaVersion };
  }
  return isUserSnapshot(value)
    ? { status: "ready", snapshot: value }
    : { status: "invalid", message: "存档结构或字段值不符合版本 1。" };
}

export function serializeSnapshot(snapshot: UserSnapshot): string {
  if (!isUserSnapshot(snapshot)) throw new Error("不能导出无效存档。");
  return JSON.stringify(snapshot, null, 2);
}

/** 读取失败不会产生空存档或改写原内容，由调用方明确处理结果。 */
export async function loadSnapshot(storage: AsyncKV): Promise<LoadResult> {
  const result = await storage.get(STORAGE_KEY);
  if (result.isErr()) {
    return { status: "unavailable", message: "无法读取存储。", error: result.error };
  }
  return result.value.mapOr<LoadResult>({ status: "empty" }, parseSnapshot);
}

/** 显式保存；调用方应等待本次保存完成后再发起下一次保存。 */
export async function saveSnapshot(storage: AsyncKV, snapshot: UserSnapshot): Promise<SaveResult> {
  const serialized = Result.wrap(() => serializeSnapshot(snapshot));
  if (serialized.isErr()) {
    return {
      status: "failed",
      message: "存档无效或无法序列化。",
      error: { code: "invalid-snapshot", cause: serialized.error },
    };
  }
  const result = await storage.set(STORAGE_KEY, serialized.value);
  return result.isErr()
    ? { status: "failed", message: "存储写入失败。", error: result.error }
    : { status: "saved" };
}
