import type { WeaponManualUnlock } from "../types/unlock";
import { weaponManualEntries } from "./weapons";

/** 获取规则仅供参考，不影响用户手动标记解锁；未逐条核实的奖励不填。 */
export const manualUnlocks = weaponManualEntries.map(
  (entry) =>
    ({
      manualItemId: entry.manualItemId,
      weaponItemId: entry.weaponItemId,
      completion: {
        status: "reported",
        value: "successful-exfil",
        sourceIds: ["source:official-fob", ...entry.sourceIds],
        note: "官方手册通则；此处仅作参考，用户可直接确认解锁。",
      },
      consumedOnCompletion: {
        status: "reported",
        value: true,
        sourceIds: ["source:official-fob"],
      },
      purchaseRequires: ["gunsmith"],
    }) satisfies WeaponManualUnlock,
);
