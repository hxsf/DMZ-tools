import type { WeaponManualUnlock } from "../types/unlock";
import { weaponManualEntries } from "./weapons";

/** 获取规则仅供参考，不影响用户手动标记解锁；未逐条核实的奖励不填。 */
export const manualUnlocks = weaponManualEntries.map((entry): WeaponManualUnlock => {
  const manual = {
    manualItemId: entry.manualItemId,
    weaponItemId: entry.weaponItemId,
    purchaseRequires: ["gunsmith"],
  } as const;

  if (entry.season === 1) {
    return {
      ...manual,
      completion: {
        status: "reported",
        value: "successful-exfil",
        sourceIds: ["source:hub-weapon-manuals", "source:official-season-1-pass"],
        note: "首次携带实体手册撤离可解锁武器。首次在第1赛季战斗通行证解锁对应的免费基础武器也会直接获得手册。",
      },
    };
  }

  return {
    ...manual,
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
  };
});
