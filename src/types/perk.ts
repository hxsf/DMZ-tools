import type { PerkTree } from "./perk-build";

interface PerkText {
  /** Stable share-code identifier. A number must never be reassigned. */
  readonly wireId: number;
  readonly name: { readonly en: string; readonly zh: string };
  readonly description: { readonly en: string; readonly zh: string };
  /** Official Simplified Chinese publications, distinct from client verification. */
  readonly nameOfficialZh: boolean;
  readonly descriptionOfficialZh: boolean;
  /** True for short English source text shown verbatim, false for an editorial summary. */
  readonly descriptionEnIsExcerpt: boolean;
  /** Short source wording, available offline for the English view. */
  readonly englishExcerpt: string;
  /** Attested Simplified Chinese text. Community wording can still carry a translation marker. */
  readonly nameZhSource?: string;
  readonly descriptionZhSource?: string;
  /** Documented alternate labels included in searches. */
  readonly nameAliasesZh?: readonly string[];
  /** Additional evidence for an effect when the directory excerpt alone is incomplete. */
  readonly effectReference?: string;
  readonly sourceUrl: string;
}

export type Perk = PerkText &
  (
    | { readonly kind: "minor" }
    | { readonly kind: "major"; readonly tree: PerkTree; readonly row: 3 | 6 | 9 }
    | { readonly kind: "prestige"; readonly tree: PerkTree }
  );
