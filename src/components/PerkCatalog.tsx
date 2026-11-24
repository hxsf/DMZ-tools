import { useState } from "preact/hooks";
import { Trans, useTranslation } from "react-i18next";
import { perks } from "../data/perks";
import { perkBranches } from "../types/perk-build";
import { Icon } from "./Icon";
import { PerkIcon } from "./PerkIcon";
import { PerkText, type TextLanguage } from "./PerkText";
import "../styles/perk-catalog.css";

const filters = ["all", ...perkBranches, "common"] as const;
type Filter = (typeof filters)[number];

const labels = {
  all: "perks.filterAll",
  common: "perks.filterCommon",
  warfighter: "perks.warfighter",
  scout: "perks.scout",
  survivalist: "perks.survivalist",
} as const;

const entries = perks.map((perk) => ({
  perk,
  category: perk.kind === "minor" ? ("common" as const) : perk.tree,
  searchable: [
    perk.name.zh,
    perk.name.en,
    perk.description.zh,
    perk.description.en,
    perk.englishExcerpt,
  ].map((value) => value.toLowerCase()),
}));

export function PerkCatalog({ language }: { language: TextLanguage }) {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const normalized = query.trim().toLowerCase();
  const matches = entries.filter(
    ({ category, searchable }) =>
      (filter === "all" || filter === category) &&
      searchable.some((text) => text.includes(normalized)),
  );

  return (
    <section id="traits-catalog" class="perk-directory" aria-labelledby="perk-directory-title">
      <div class="perk-directory-top">
        <h2 id="perk-directory-title">
          <Trans t={t} i18nKey="perks.catalog" />
          <span class="group-count" aria-live="polite">
            {matches.length}
          </span>
        </h2>
        <label class="catalog-search">
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
      </div>
      <div class="perk-directory-filters" role="group" aria-label={t("perks.filterLabel")}>
        {filters.map((value) => (
          <button
            key={value}
            type="button"
            data-perk-filter={value}
            aria-pressed={filter === value}
            onClick={() => setFilter(value)}
          >
            <Trans t={t} i18nKey={labels[value]} />
          </button>
        ))}
      </div>
      <div class="perk-directory-grid">
        {matches.map(({ perk, category }) => (
          <article
            key={perk.wireId}
            class="perk-entry"
            data-perk-id={perk.wireId}
            data-perk-kind={perk.kind}
            data-perk-category={category}
          >
            <div class="perk-card-head">
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
              <h3>
                <PerkText perk={perk} field="name" language={language} />
              </h3>
              <span class="perk-card-category">
                <Trans t={t} i18nKey={labels[category]} />
                {perk.kind === "prestige" && (
                  <span class="perk-card-prestige">
                    <Trans t={t} i18nKey="perks.prestige" />
                  </span>
                )}
              </span>
            </div>
            <div class="perk-card-effect">
              <PerkText perk={perk} field="description" language={language} />
            </div>
          </article>
        ))}
      </div>
      {!matches.length && (
        <p class="empty-state">
          <Trans t={t} i18nKey="perks.noMatches" />
        </p>
      )}
    </section>
  );
}
