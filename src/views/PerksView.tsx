import { useState } from "preact/hooks";
import { Trans, useTranslation } from "react-i18next";
import { Icon } from "../components/Icon";
import { PerkCatalog } from "../components/PerkCatalog";
import { PerkCodes } from "../components/PerkCodes";
import { PerkTree } from "../components/PerkTree";
import { useApp } from "../context";
import { maxTreePoints, perkBranches, type PerkBuild } from "../types/perk-build";
import "../styles/perks.css";

const displayModes = ["icon", "name", "description"] as const;

export default function PerksView() {
  const { t, i18n } = useTranslation();
  const { stores, persist, loadStatus } = useApp();
  const [mode, setMode] = useState<(typeof displayModes)[number]>("icon");
  const [original, setOriginal] = useState(false);
  const build = stores.perks.state.value;
  const editable = loadStatus.value === "ready";
  const chinese = i18n.language.startsWith("zh");
  const language = chinese && !original ? "zh" : "en";
  const points = perkBranches.reduce((sum, branch) => sum + build[branch].length, 0);

  async function change(next: PerkBuild) {
    if (loadStatus.value !== "ready" || stores.perks.replace(next).isErr()) return false;
    return persist();
  }

  return (
    <div class="perks-page">
      <section id="traits-tree" data-mode={mode} aria-label={t("perks.myTree")}>
        <div class="perk-toolbar">
          <strong class="perk-points">
            <Trans t={t} i18nKey="perks.points" values={{ used: points, max: maxTreePoints }} />
          </strong>
          <div class="tree-display-modes" role="group" aria-label={t("perks.displayMode")}>
            {displayModes.map((value) => (
              <button
                key={value}
                type="button"
                data-tree-mode={value}
                aria-pressed={value === mode}
                onClick={() => setMode(value)}
              >
                <Trans t={t} i18nKey={`perks.display.${value}`} />
              </button>
            ))}
          </div>
          <div class="perk-board-actions">
            {chinese && (
              <button
                id="trait-original"
                class="perk-language"
                type="button"
                aria-pressed={original}
                onClick={() => setOriginal(!original)}
              >
                <Icon name="language" />
                <Trans t={t} i18nKey={original ? "perks.toChinese" : "perks.toEnglish"} />
              </button>
            )}
            <PerkCodes build={build} editable={editable} onImport={change} />
          </div>
        </div>
        <PerkTree
          build={build}
          editable={editable}
          language={language}
          mode={mode}
          onChange={change}
        />
      </section>
      <PerkCatalog language={language} />
    </div>
  );
}
