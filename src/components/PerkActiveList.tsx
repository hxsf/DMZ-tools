import { Trans, useTranslation } from "react-i18next";
import { perks, type Perk } from "../data/perks";
import { getPrestigeSlot } from "../perk-code";
import { maxBranchDepth, perkBranches, type PerkBuild } from "../types/perk-build";
import { PerkIcon } from "./PerkIcon";
import { PerkText, type TextLanguage } from "./PerkText";
import "../styles/perk-active-list.css";

const byId = new Map(perks.map((perk) => [perk.wireId, perk] as const));

function ActiveTrait({ perk, language }: { perk: Perk; language: TextLanguage }) {
  const { t } = useTranslation();
  return (
    <>
      <div class="perk-active-identity">
        <PerkIcon
          name={perk.name.en}
          fallback={
            <span
              class="perk-art-missing"
              data-perk-icon-missing={perk.name.en}
              title={t("perks.iconMissingLabel")}
            >
              <Trans t={t} i18nKey="perks.iconMissing" />
            </span>
          }
        />
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
      {perkBranches.map((branch, index) => {
        const slot = index + 1;
        const id = getPrestigeSlot(build, slot);
        const prestige = id === undefined ? undefined : byId.get(id);
        return (
          <section
            key={branch}
            class="perk-active-column"
            data-branch={branch}
            aria-labelledby={"trait-list-" + branch}
          >
            <div
              class="perk-active-prestige"
              data-prestige-slot={slot}
              data-wire-id={prestige?.wireId}
              data-perk-category={prestige?.kind === "prestige" ? prestige.tree : undefined}
            >
              <span class="perk-active-slot-label">
                <Trans
                  t={t}
                  i18nKey={prestige ? "perks.activePrestigeSlot" : "perks.emptyPrestigeSlot"}
                  values={{ slot }}
                />
              </span>
              {prestige && <ActiveTrait perk={prestige} language={language} />}
            </div>
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
        );
      })}
    </div>
  );
}
