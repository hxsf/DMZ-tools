export const perkBranches = ["warfighter", "scout", "survivalist"] as const;
export type PerkTree = (typeof perkBranches)[number];

export const maxTreePoints = 18;
export const maxBranchDepth = 9;
export const maxPrestigeSlots = 3;

export type MinorPosition = 0 | 1 | 2;
type OffCenterPositions = Readonly<Partial<Record<number, 0 | 2>>>;

/** Each entry is the stable wire ID of the chosen trait, starting at the bottom row. */
export type PerkBuild = Readonly<Record<PerkTree | "prestige", readonly number[]>> & {
  /** One-based rows. Older builds omit this field and display their random picks in the center. */
  readonly minorPositions?: Readonly<Partial<Record<PerkTree, OffCenterPositions>>>;
};
