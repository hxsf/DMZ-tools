export const perkBranches = ["warfighter", "scout", "survivalist"] as const;
export type PerkTree = (typeof perkBranches)[number];

export const maxTreePoints = 18;
export const maxBranchDepth = 9;
export const maxPrestigeSlots = 3;

/** Each entry is the stable wire ID of the chosen trait, starting at the bottom row. */
export type PerkBuild = Readonly<Record<PerkTree | "prestige", readonly number[]>>;
