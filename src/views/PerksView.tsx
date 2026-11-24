import { useState } from "preact/hooks";
import { Trans, useTranslation } from "react-i18next";
import { Icon } from "../components/Icon";
import { PerkActiveList } from "../components/PerkActiveList";
import { PerkCatalog } from "../components/PerkCatalog";
import { PerkCodes } from "../components/PerkCodes";
import { PerkTree } from "../components/PerkTree";
import { useApp } from "../context";
import { maxTreePoints, perkBranches, type PerkBuild } from "../types/perk-build";
import "../styles/perks.css";

const views = ["board", "details"] as const;
type View = (typeof views)[number];

export default function PerksView() {
  const { t, i18n } = useTranslation();
  const { stores, persist, loadStatus } = useApp();
  const [view, setView] = useState<View>("board");
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
      <section id="traits-tree" data-mode={view} aria-label={t("perks.myTree")}>
        <div class="perk-toolbar">
          <div class="perk-view-tabs" role="tablist" aria-label={t("perks.viewLabel")}>
            {views.map((tab) => (
              <button
                key={tab}
                id={"trait-tab-" + tab}
                type="button"
                role="tab"
                aria-controls={"trait-panel-" + tab}
                aria-selected={view === tab}
                tabIndex={view === tab ? 0 : -1}
                onClick={() => setView(tab)}
                onKeyDown={(event) => {
                  let next: View;
                  switch (event.key) {
                    case "ArrowLeft":
                    case "ArrowRight":
                      next = tab === "board" ? "details" : "board";
                      break;
                    case "Home":
                      next = "board";
                      break;
                    case "End":
                      next = "details";
                      break;
                    default:
                      return;
                  }
                  event.preventDefault();
                  setView(next);
                  document.getElementById("trait-tab-" + next)?.focus();
                }}
              >
                <Trans t={t} i18nKey={`perks.view.${tab}`} />
              </button>
            ))}
          </div>
          <strong class="perk-points">
            <Trans t={t} i18nKey="perks.points" values={{ used: points, max: maxTreePoints }} />
          </strong>
          {view === "board" && (
            <p class="perk-gesture-hint" id="trait-controls-hint">
              <span class="perk-pointer-hint">
                <Trans t={t} i18nKey="perks.pointerHint" />
              </span>
              <span class="perk-touch-hint">
                <Trans t={t} i18nKey="perks.touchHint" />
              </span>
              <span class="sr-only">
                {" "}
                <Trans t={t} i18nKey="perks.keyboardHint" />
              </span>
            </p>
          )}
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
        <div
          id="trait-panel-board"
          role="tabpanel"
          aria-labelledby="trait-tab-board"
          hidden={view !== "board"}
          tabIndex={0}
        >
          {view === "board" && (
            <PerkTree build={build} editable={editable} language={language} onChange={change} />
          )}
        </div>
        <div
          id="trait-panel-details"
          role="tabpanel"
          aria-labelledby="trait-tab-details"
          hidden={view !== "details"}
          tabIndex={0}
        >
          {view === "details" && <PerkActiveList build={build} language={language} />}
        </div>
      </section>
      <PerkCatalog language={language} />
    </div>
  );
}
