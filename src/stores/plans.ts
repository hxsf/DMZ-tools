import { computed, signal } from "@preact/signals";
import { isPlans, isRequirementPlan } from "../storage";
import type { PlanId, RequirementPlan } from "../types/requirement";

export function createPlansStore(initial: readonly RequirementPlan[]) {
  if (!isPlans(initial)) throw new Error("初始化计划无效。");
  const value = signal<readonly RequirementPlan[]>(structuredClone(initial));
  return {
    state: computed(() => value.value),
    upsert(plan: RequirementPlan) {
      if (!isRequirementPlan(plan)) throw new Error("需求计划字段无效。");
      const copy = structuredClone(plan);
      const existing = value.value.some((entry) => entry.id === copy.id);
      value.value = existing
        ? value.value.map((entry) => (entry.id === copy.id ? copy : entry))
        : [...value.value, copy];
    },
    remove(planId: PlanId) {
      value.value = value.value.filter((entry) => entry.id !== planId);
    },
    replace(plans: readonly RequirementPlan[]) {
      if (!isPlans(plans)) throw new Error("替换计划无效。");
      value.value = structuredClone(plans);
    },
  };
}
