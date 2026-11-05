import { useTranslation } from "react-i18next";
import { UnlockList, type UnlockEntry } from "../components/UnlockList";
import { useApp } from "../context";
import { getItemName, itemById } from "../data/display";
import { manualUnlocks } from "../data/manuals";

export default function WeaponManualsView() {
  const { i18n } = useTranslation();
  const { stores, persist } = useApp();
  const progress = stores.unlocks.state.value.manuals;
  const language = i18n.resolvedLanguage ?? i18n.language;
  const entries = manualUnlocks.flatMap((manual): UnlockEntry[] => {
    const item = itemById.get(manual.weaponItemId);
    if (!item || item.kind !== "weapon") return [];
    const manualItem = itemById.get(manual.manualItemId);
    const name = getItemName(item, language);
    return [
      {
        id: manual.manualItemId,
        item,
        group: item.category ?? "other",
        checked: progress[manual.manualItemId]?.status === "unlocked",
        secondary: name !== item.name.en ? item.name.en : undefined,
        searchTerms: manualItem
          ? [manualItem.name.en, manualItem.name.zhCN ?? "", ...(manualItem.name.aliases ?? [])]
          : [],
        onChange(checked) {
          stores.unlocks.setManual(manual.manualItemId, checked ? "unlocked" : "locked");
          void persist();
        },
      },
    ];
  });
  return <UnlockList entries={entries} kind="manuals" />;
}
