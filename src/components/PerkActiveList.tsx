import { Trans, useTranslation } from "react-i18next";
import { perks, type Perk } from "../data/perks";
import { getPrestigeSlot } from "../perk-code";
import {
  maxBranchDepth,
  maxPrestigeSlots,
  perkBranches,
  type PerkBuild,
} from "../types/perk-build";
import { PerkGlyph } from "./PerkGlyph";
import { PerkText, type TextLanguage } from "./PerkText";
import "../styles/perk-active-list.css";

const byId = new Map(perks.map((perk) => [perk.wireId, perk] as const));

function ActiveTrait({ perk, language }: { perk: Perk; language: TextLanguage }) {
  const { t } = useTranslation();
  return (
    <>
      <div class="perk-active-identity">
        <PerkGlyph name={perk.name.en} selected />
        <div class="perk-active-name">
          <strong>
            <PerkText perk={perk} field="name" language={language} />
          </strong>
          {perk.kind === "prestige" && (
            <span class="perk-active-category">
              <Trans t={t} i18nKey={`perks.${perk.tree}`} />
            </span>
          )}
        </div>
      </div>
      <div class="perk-active-effect">
        <PerkText perk={perk} field="description" language={language} />
      </div>
    </>
  );
}

export function PerkActiveList({ build, language }: { build: PerkBuild; language: TextLanguage }) {
  const { t } = useTranslation();
  return (
    <div class="perk-active-build">
      <ol
        class="perk-active-prestige-band"
        data-perk-theme="prestige"
        aria-label={t("perks.prestige")}
      >
        {Array.from({ length: maxPrestigeSlots }, (_, index) => {
          const slot = index + 1;
          const id = getPrestigeSlot(build, slot);
          const prestige = id === undefined ? undefined : byId.get(id);
          return (
            <li
              key={slot}
              class="perk-active-prestige"
              data-prestige-slot={slot}
              data-wire-id={prestige?.wireId}
              data-perk-category={prestige?.kind === "prestige" ? prestige.tree : undefined}
            >
              {prestige ? (
                <>
                  <span class="perk-active-slot-label">
                    <Trans t={t} i18nKey="perks.activePrestigeSlot" values={{ slot }} />
                  </span>
                  <ActiveTrait perk={prestige} language={language} />
                </>
              ) : (
                <div class="perk-active-slot-empty">
                  <PerkGlyph placeholder="+" />
                  <span>
                    <Trans t={t} i18nKey="perks.emptyPrestigeSlot" values={{ slot }} />
                  </span>
                </div>
              )}
            </li>
          );
        })}
      </ol>
      <div class="perk-active-lanes">
        {perkBranches.map((branch) => (
          <section
            key={branch}
            class="perk-active-column"
            data-branch={branch}
            data-perk-theme={branch}
            aria-labelledby={"trait-list-" + branch}
          >
            <h2 id={"trait-list-" + branch} class="perk-active-heading">
              <Trans t={t} i18nKey={`perks.${branch}`} />
              <small>
                {build[branch].length} / {maxBranchDepth}
              </small>
            </h2>
            {build[branch].length === 0 ? (
              <p class="perk-active-empty">
                <Trans t={t} i18nKey="perks.emptyActiveBranch" />
              </p>
            ) : (
              <ol class="perk-active-rows">
                {build[branch].map((wireId, rowIndex) => {
                  const perk = byId.get(wireId);
                  return (
                    perk && (
                      <li
                        key={wireId}
                        class="perk-active-row"
                        data-wire-id={wireId}
                        data-row={rowIndex + 1}
                        data-kind={perk.kind}
                      >
                        <ActiveTrait perk={perk} language={language} />
                      </li>
                    )
                  );
                })}
              </ol>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
