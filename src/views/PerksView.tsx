import { useState } from "preact/hooks";
import { Trans, useTranslation } from "react-i18next";
import { Icon } from "../components/Icon";
import { PerkCodes } from "../components/PerkCodes";
import { PerkIcon } from "../components/PerkIcon";
import { useApp } from "../context";
import { perks, type Perk } from "../data/perks";
import { isPerkBuild } from "../perk-code";
import {
  maxBranchDepth,
  maxPrestigeSlots,
  maxTreePoints,
  perkBranches,
  type PerkBuild,
  type PerkTree,
} from "../types/perk-build";
import "../styles/perks.css";

type TextLanguage = "zh" | "en";
type Branch = PerkTree | "prestige";
const groups = ["minor", "major", "prestige"] as const;
const byId = new Map<number, Perk>(perks.map((perk) => [perk.wireId, perk]));

function textOf(perk: Perk, field: "name" | "description", language: TextLanguage): string {
  const text = perk[field][language];
  if (!text) return perk[field].en;
  const official = field === "name" ? perk.nameOfficialZh : perk.descriptionOfficialZh;
  return language === "zh" && !official ? text + "＊" : text;
}

function PerkText({
  perk,
  field,
  language,
}: {
  perk: Perk;
  field: "name" | "description";
  language: TextLanguage;
}) {
  const { t } = useTranslation();
  const [original, setOriginal] = useState(false);
  const official = field === "name" ? perk.nameOfficialZh : perk.descriptionOfficialZh;
  const translated = language === "zh" && !official && !!perk[field].zh;
  const displayed = language === "en" || (translated && original) || !perk[field].zh ? "en" : "zh";
  const action = t(original ? "perks.readTranslation" : "perks.readOriginal", {
    name: perk.name.zh || perk.name.en,
  });
  const englishEffect = field === "description" && displayed === "en";
  const content = (
    <>
      {englishEffect ? (
        <>
          <span class="perk-meta">
            <Trans t={t} i18nKey="perks.excerpt" />{" "}
          </span>
          <q lang="en">{perk.englishExcerpt}</q>
        </>
      ) : (
        <span lang={displayed}>{perk[field][displayed]}</span>
      )}
      {translated && (
        <button
          type="button"
          class="perk-mark"
          aria-label={action}
          title={action}
          aria-pressed={original}
          onClick={() => setOriginal(!original)}
        >
          {original ? <Trans t={t} i18nKey="perks.zhMark" /> : "＊"}
        </button>
      )}
    </>
  );
  if (field === "name") return content;
  return (
    <>
      <p>
        {content}
        {displayed === "zh" && !perk.descriptionEnIsExcerpt && (
          <a
            class="perk-source-short"
            href={perk.sourceUrl}
            target="_blank"
            rel="noreferrer"
            aria-label={t("perks.fullSource", { name: perk.name.zh || perk.name.en })}
            title={t("perks.fullSource", { name: perk.name.zh || perk.name.en })}
          >
            <span aria-hidden="true">↗</span>
          </a>
        )}
      </p>
      {englishEffect && !perk.descriptionEnIsExcerpt && (
        <p>
          <span class="perk-meta">
            <Trans t={t} i18nKey="perks.summary" />{" "}
          </span>
          <span lang="en">{perk.description.en}</span>
        </p>
      )}
      {englishEffect && (
        <div class="perk-reference">
          <a href={perk.sourceUrl} target="_blank" rel="noreferrer">
            <Trans t={t} i18nKey="perks.source" />
          </a>
        </div>
      )}
    </>
  );
}

function PerkCatalog({ language }: { language: TextLanguage }) {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const normalized = query.trim().toLowerCase();
  const matches = perks.filter((perk) =>
    [
      perk.name.zh,
      perk.name.en,
      perk.description.zh,
      perk.description.en,
      perk.englishExcerpt,
    ].some((value) => value.toLowerCase().includes(normalized)),
  );

  return (
    <section id="traits-catalog" aria-label={t("perks.catalog")}>
      <label class="catalog-search perk-search">
        <Icon name="search" />
        <input
          id="trait-search"
          type="search"
          value={query}
          aria-label={t("perks.search")}
          placeholder={t("perks.search")}
          onInput={(event) => setQuery(event.currentTarget.value)}
        />
      </label>
      {groups.map((kind) => {
        const entries = matches.filter((perk) => perk.kind === kind);
        if (!entries.length) return undefined;
        return (
          <details key={kind} class="perk-group" open>
            <summary>
              <Icon name="chevron-down" />
              <Trans t={t} i18nKey={"perks." + kind} />
              <span class="perk-count">{entries.length}</span>
            </summary>
            <div class="perk-catalog-grid">
              {entries.map((perk) => (
                <article class="perk-entry" key={perk.wireId}>
                  <PerkIcon name={perk.name.en} />
                  <div>
                    <h3>
                      <PerkText perk={perk} field="name" language={language} />
                    </h3>
                    {perk.kind === "major" && (
                      <span class="perk-meta">
                        <Trans
                          t={t}
                          i18nKey="perks.branchRow"
                          values={{ branch: t("perks." + perk.tree), row: perk.row }}
                        />
                      </span>
                    )}
                    <PerkText perk={perk} field="description" language={language} />
                  </div>
                </article>
              ))}
            </div>
          </details>
        );
      })}
      {!matches.length && (
        <p class="empty-state">
          <Trans t={t} i18nKey="perks.noMatches" />
        </p>
      )}
    </section>
  );
}

function updateSlot(build: PerkBuild, branch: Branch, index: number, wireId: number): PerkBuild {
  const selected = [...build[branch]];
  if (wireId === 0) selected.splice(index, 1);
  else selected[index] = wireId;
  return { ...build, [branch]: selected };
}

interface BranchProps {
  readonly build: PerkBuild;
  readonly branch: Branch;
  readonly editable: boolean;
  readonly language: TextLanguage;
  readonly points: number;
  readonly onChange: (build: PerkBuild) => Promise<boolean>;
}

function PerkBranch({ build, branch, editable, language, points, onChange }: BranchProps) {
  const { t } = useTranslation();
  const selected = build[branch];
  const prestige = branch === "prestige";
  const capacity = prestige ? maxPrestigeSlots : maxBranchDepth;
  const heading = t("perks." + branch);
  return (
    <details class={"perk-branch" + (prestige ? " perk-prestige" : "")} open>
      <summary>
        <Icon name="chevron-down" />
        <Trans t={t} i18nKey={"perks." + branch} />
        <span class="perk-count">
          {selected.length} / {capacity}
        </span>
      </summary>
      <ol class="perk-slots">
        {Array.from({ length: capacity }, (_, index) => {
          const row = index + 1;
          const kind = prestige ? "prestige" : row % 3 === 0 ? "major" : "minor";
          const current = byId.get(selected[index]);
          const canChoose =
            editable && index <= selected.length && (current || prestige || points < maxTreePoints);
          const removable = !!current && (prestige || row === selected.length);
          const candidates = canChoose
            ? perks.filter(
                (perk) =>
                  perk.kind === kind &&
                  (perk.kind !== "major" || (perk.tree === branch && perk.row === row)) &&
                  isPerkBuild(updateSlot(build, branch, index, perk.wireId)),
              )
            : [];
          const id = "trait-" + branch + "-" + row;
          return (
            <li
              key={row}
              class={
                "perk-slot" + (current ? " is-selected" : canChoose ? " is-next" : " is-upcoming")
              }
            >
              <span class="perk-index" aria-hidden="true">
                {row}
              </span>
              {current && <PerkIcon name={current.name.en} />}
              <div class="perk-slot-body">
                <label for={id} class="perk-meta">
                  <Trans t={t} i18nKey={"perks." + kind} />
                </label>
                <select
                  id={id}
                  aria-label={t("perks.branchRow", { branch: heading, row })}
                  value={current?.wireId ?? ""}
                  disabled={!canChoose}
                  onChange={(event) =>
                    void onChange(
                      updateSlot(build, branch, index, Number(event.currentTarget.value)),
                    )
                  }
                >
                  {(!current || removable) && (
                    <option value="">
                      {t(current ? "perks.remove" : canChoose ? "perks.choose" : "perks.unfilled")}
                    </option>
                  )}
                  {candidates.map((perk) => (
                    <option key={perk.wireId} value={perk.wireId} lang={language}>
                      {textOf(perk, "name", language)}
                    </option>
                  ))}
                  {current && !canChoose && (
                    <option value={current.wireId} lang={language}>
                      {textOf(current, "name", language)}
                    </option>
                  )}
                </select>
                {current && (
                  <PerkText
                    key={current.wireId}
                    perk={current}
                    field="description"
                    language={language}
                  />
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </details>
  );
}

export default function PerksView() {
  const { t, i18n } = useTranslation();
  const { stores, persist, loadStatus } = useApp();
  const [catalog, setCatalog] = useState(false);
  const [original, setOriginal] = useState(false);
  const build = stores.perks.state.value;
  const editable = loadStatus.value === "ready";
  const chinese = i18n.language.startsWith("zh");
  const language = chinese && !original ? "zh" : "en";
  const points = perkBranches.reduce((sum, branch) => sum + build[branch].length, 0);

  async function change(build: PerkBuild) {
    if (loadStatus.value !== "ready" || stores.perks.replace(build).isErr()) return false;
    return persist();
  }

  return (
    <div class="perks-page">
      <div class="perk-toolbar">
        <div class="status-tabs">
          <button
            type="button"
            aria-controls="traits-tree"
            aria-pressed={!catalog}
            class={!catalog ? "is-active" : ""}
            onClick={() => setCatalog(false)}
          >
            <Trans t={t} i18nKey="perks.myTree" />
          </button>
          <button
            type="button"
            aria-controls="traits-catalog"
            aria-pressed={catalog}
            class={catalog ? "is-active" : ""}
            onClick={() => setCatalog(true)}
          >
            <Trans t={t} i18nKey="perks.catalog" /> <span class="group-count">{perks.length}</span>
          </button>
        </div>
        {chinese && (
          <button
            id="trait-original"
            class="perk-language text-action"
            type="button"
            aria-pressed={original}
            onClick={() => setOriginal(!original)}
          >
            <Icon name="language" />
            <Trans t={t} i18nKey={original ? "perks.toChinese" : "perks.toEnglish"} />
          </button>
        )}
      </div>
      {catalog ? (
        <PerkCatalog language={language} />
      ) : (
        <section id="traits-tree" aria-label={t("perks.myTree")}>
          <div class="perk-progress">
            <strong>
              <Trans t={t} i18nKey="perks.points" values={{ used: points, max: maxTreePoints }} />
            </strong>
            <span class="field-hint">
              <Trans t={t} i18nKey="perks.markHint" />
            </span>
          </div>
          <PerkCodes build={build} editable={editable} onImport={change} />
          <div class="perk-tree-grid">
            {[...perkBranches, "prestige" as const].map((branch) => (
              <PerkBranch
                key={branch}
                build={build}
                branch={branch}
                editable={editable}
                language={language}
                points={points}
                onChange={change}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
