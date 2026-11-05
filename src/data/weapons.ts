import type { ItemName, WeaponCategory } from "../types/item";
import type { SourceId } from "../types/source";

/** DMZHub 的 32 条手册目录：[项目键、武器名、手册条目名、武器类别]。 */
const definitions = [
  ["50-gs", ".50 GS", "Manual: .50 GS", "pistol"],
  ["apoc-338", "APOC-338", "Manual: APOC-338", "lmg"],
  ["astaroth-57", "Astaroth .57", "Manual: Astaroth .57", "sniper-rifle"],
  ["axion", "Axion", "Manual: Axion", "assault-rifle"],
  ["cronen-squall", "Cronen Squall", "Manual: Cronen Squall", "assault-rifle"],
  ["finn-lmg", "FiNN LMG", "Manual: Finn LMG", "lmg"],
  ["han-86", "Han 86", "Manual: HAN 86", "assault-rifle"],
  ["hyeon-burst", "Hyeon Burst", "Manual: Hyeon Burst", "assault-rifle"],
  ["iso-nightshade", "ISO Nightshade", "Manual: ISO Nightshade", "smg"],
  ["jokr", "JOKR", "Manual: Jokr", "launcher"],
  ["kg-7-vulcan", "KG-7 Vulcan", "Manual: KG-7 Vulcan", "sniper-rifle"],
  ["kastov-762", "Kastov 762", "Manual: Kastov 762", "assault-rifle"],
  ["krait-p68", "Krait P68", "Manual: Krait P68", "pistol"],
  ["m4", "M4", "Manual: M4", "assault-rifle"],
  ["mar-9", "MAR-9", "Manual: MAR-9", "marksman-rifle"],
  ["mojave-357", "Mojave .357", "Manual: Mojave .357", "pistol"],
  ["mosin-nagant", "Mosin-Nagant", "Manual: Mosin-Nagant", "marksman-rifle"],
  ["oden", "Oden", "Manual: ODEN", "assault-rifle"],
  ["oris-86", "Oris 8.6", "Manual: Oris 8.6", "marksman-rifle"],
  ["pm-40-anvil", "PM-40 Anvil", "Manual: PM-40 Anvil", "launcher"],
  ["ppsh-41", "PPSh-41", "Manual: PPSH-41", "smg"],
  ["patriot-xmr", "Patriot XMR", "Manual: Patriot XMR", "assault-rifle"],
  ["pila", "PILA", "Manual: Pila", "launcher"],
  ["rpg-8", "RPG-8", "Manual: RPG-8", "launcher"],
  ["rezi-12", "Rezi 12", "Manual: Rezi 12", "shotgun"],
  ["signal-50", "Signal 50", "Manual: Signal 50", "sniper-rifle"],
  ["type-73", "Type 73", "Manual: Type 73", "lmg"],
  ["vel-46", "VEL 46", "Manual: VEL 46", "smg"],
  ["wz-55-striga", "Wz.55 Striga", "Manual: WZ.55 Striga", "smg"],
  ["warlord", "Warlord", "Manual: Warlord", "shotgun"],
  ["x-58-nyx", "X-58 Nyx", "Manual: X-58 Nyx", "smg"],
  ["sang-9mm", "Sang 9mm", "SANG 9mm", "pistol"],
] as const satisfies readonly (readonly [string, string, string, WeaponCategory])[];

type WeaponSlug = (typeof definitions)[number][0];

/** 官方简体博客的武器标题；尚未与客户端 UI 核对。 */
const officialChineseNames: Partial<Record<WeaponSlug, string>> = {
  "50-gs": "点50GS",
  "apoc-338": "APOC 338",
  "astaroth-57": "点57阿塔罗斯",
  axion: "阿克西恩",
  "cronen-squall": "克洛南烈风",
  "finn-lmg": "菲恩轻机枪",
  "han-86": "汉86",
  "hyeon-burst": "玄铁（点射型）",
  "iso-nightshade": "ISO夜影",
  jokr: "JOKR",
  "kg-7-vulcan": "KG-7火神",
  "kastov-762": "卡斯托夫762",
  "krait-p68": "环蛇P68",
  m4: "M4",
  "mar-9": "MAR-9",
  "mojave-357": "莫哈韦点357",
  "mosin-nagant": "莫辛-纳甘",
  oden: "奥登",
  "oris-86": "奥里斯8.6",
  "pm-40-anvil": "PM-40铁砧",
  "ppsh-41": "PPSh-41",
  "patriot-xmr": "爱国者XMR",
  pila: "针式导弹",
  "rpg-8": "RPG-8",
  "rezi-12": "雷兹12",
  "signal-50": "西格诺50",
  "type-73": "73式",
  "vel-46": "威尔46",
  "wz-55-striga": "Wz55斯崔加",
  warlord: "战将",
  "x-58-nyx": "X-58夜神",
};

/** 同篇官方文章的其他用名；SANG 的异常译名仅作为检索别名保留。 */
const officialNameAliases: Partial<Record<WeaponSlug, readonly string[]>> = {
  "iso-nightshade": ["ISO幽夜"],
  jokr: ["标枪导弹"],
  oden: ["欧登"],
  "signal-50": ["信号50"],
  "sang-9mm": ["尚武9毫米机匣"],
};

function additionalSources(slug: string): readonly SourceId[] {
  switch (slug) {
    case "m4":
      return ["source:codex-manual-m4", "source:official-fob"];
    case "kastov-762":
      return ["source:codex-manual-kastov-762", "source:official-fob"];
    case "sang-9mm":
      return ["source:allthingshow-manuals", "source:hub-manual-sang-9mm"];
    default:
      return [];
  }
}

export const weaponManualEntries = definitions.map(([slug, en, manualEn, category]) => {
  const sourceIds: readonly [SourceId, ...SourceId[]] = [
    "source:hub-weapon-manuals",
    "source:official-weapons-zh",
    ...additionalSources(slug),
  ];
  const zhCN = officialChineseNames[slug];
  const aliases = officialNameAliases[slug];
  const weaponName: ItemName = {
    en,
    ...(zhCN ? { zhCN, zhCNOrigin: "official" as const } : {}),
    ...(aliases ? { aliases } : {}),
  };
  const manualName: ItemName = {
    en: manualEn,
    zhCN: `${weaponName.zhCN ?? en} 武器手册`,
    zhCNOrigin: "project",
    ...(slug === "sang-9mm" ? { aliases: ["Manual: Sang 9mm"] } : {}),
  };

  return {
    weaponItemId: `item:${slug}` as const,
    manualItemId: `item:manual-${slug}` as const,
    weaponName,
    manualName,
    category,
    sourceIds,
  };
});
