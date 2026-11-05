import { batch } from "@preact/signals";
import { createEmptySnapshot, isUserSnapshot, parseSnapshot } from "../storage";
import type { UserSnapshot } from "../types/progress";
import { createInventoryStore } from "./inventory";
import { createPlansStore } from "./plans";
import { createUnlocksStore } from "./unlocks";

export { createInventoryStore, createPlansStore, createUnlocksStore };

/** 显式创建实例；无单例、隐式持久化或组件生命周期副作用。 */
export function createStores(initial: UserSnapshot = createEmptySnapshot()) {
  if (!isUserSnapshot(initial)) throw new Error("初始化存档无效。");
  const inventory = createInventoryStore(initial.inventory);
  const unlocks = createUnlocksStore(initial.unlocks);
  const plans = createPlansStore(initial.plans);

  function restore(snapshot: UserSnapshot) {
    if (!isUserSnapshot(snapshot)) throw new Error("导入存档无效。");
    batch(() => {
      inventory.replace(snapshot.inventory);
      unlocks.replace(snapshot.unlocks);
      plans.replace(snapshot.plans);
    });
  }

  return {
    inventory,
    unlocks,
    plans,
    snapshot(): UserSnapshot {
      return structuredClone({
        schemaVersion: 1,
        inventory: inventory.state.value,
        unlocks: unlocks.state.value,
        plans: plans.state.value,
      });
    },
    restore,
    importJson(text: string) {
      const result = parseSnapshot(text);
      if (result.status === "ready") restore(result.snapshot);
      return result;
    },
  };
}
