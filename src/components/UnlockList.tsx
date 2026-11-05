import { useState } from "preact/hooks";
import { Trans, useTranslation } from "react-i18next";
import { getItemName } from "../data/display";
import type { Item } from "../types/item";
import { Icon } from "./Icon";
import { ItemImage } from "./ItemImage";

const groupOrder = [
  "assault-rifle",
  "smg",
  "shotgun",
  "lmg",
  "marksman-rifle",
  "sniper-rifle",
  "pistol",
  "launcher",
  "consumable",
  "backpack",
  "field-upgrade",
  "ingredient",
  "other",
] as const;
export type UnlockGroup = (typeof groupOrder)[number];

export interface UnlockEntry {
  readonly id: string;
  readonly item: Item;
  readonly group: UnlockGroup;
  readonly checked: boolean;
  readonly secondary?: string;
  readonly notice?: "costConflict" | "costUnknown";
  readonly searchTerms?: readonly string[];
  readonly onChange: (checked: boolean) => void;
}

interface UnlockListProps {
  readonly entries: readonly UnlockEntry[];
  readonly kind: "recipes" | "manuals";
}

function normalizeSearch(text: string): string {
  return text.normalize("NFKC").toLocaleLowerCase().replace(/\s+/g, "");
}

export function UnlockList({ entries, kind }: UnlockListProps) {
  const { t, i18n } = useTranslation();
  const language = i18n.resolvedLanguage ?? i18n.language;
  const formatNumber = new Intl.NumberFormat(language);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState<"all" | "locked" | "unlocked">("all");
  const [collapsed, setCollapsed] = useState<ReadonlySet<UnlockGroup>>(new Set());
  const [searchCollapsed, setSearchCollapsed] = useState<ReadonlySet<UnlockGroup>>(new Set());
  const search = normalizeSearch(query);
  const groups = groupOrder.filter((group) => entries.some((entry) => entry.group === group));
  const visible = entries.filter((entry) => {
    if (category !== "all" && category !== entry.group) return false;
    if (status === "locked" && entry.checked) return false;
    if (status === "unlocked" && !entry.checked) return false;
    const terms = [
      entry.item.name.en,
      entry.item.name.zhCN ?? "",
      ...(entry.item.name.aliases ?? []),
      ...(entry.searchTerms ?? []),
    ];
    return !search || terms.some((term) => normalizeSearch(term).includes(search));
  });
  const expandedState = search ? searchCollapsed : collapsed;

  function toggleGroup(group: UnlockGroup) {
    const next = new Set(expandedState);
    if (next.has(group)) next.delete(group);
    else next.add(group);
    if (search) setSearchCollapsed(next);
    else setCollapsed(next);
  }

  function resetFilters() {
    setQuery("");
    setCategory("all");
    setStatus("all");
    setSearchCollapsed(new Set());
  }

  return (
    <section class="unlock-page">
      <h1 class="sr-only">
        <Trans t={t} i18nKey={`unlock.${kind === "recipes" ? "recipesTitle" : "manualsTitle"}`} />
      </h1>
      <div class="catalog-toolbar">
        <label class="catalog-search">
          <Icon name="search" />
          <input
            type="search"
            value={query}
            aria-label={t(`unlock.${kind === "recipes" ? "searchRecipes" : "searchManuals"}`)}
            placeholder={t(`unlock.${kind === "recipes" ? "searchRecipes" : "searchManuals"}`)}
            onInput={(event) => {
              setQuery(event.currentTarget.value);
              setSearchCollapsed(new Set());
            }}
          />
        </label>
        <select
          class="catalog-filter"
          value={category}
          aria-label={t("unlock.categoryFilter")}
          onChange={(event) => setCategory(event.currentTarget.value)}
        >
          <option value="all">
            <Trans t={t} i18nKey="unlock.allCategories" />
          </option>
          {groups.map((group) => (
            <option key={group} value={group}>
              <Trans t={t} i18nKey={`unlock.groups.${group}`} />
            </option>
          ))}
        </select>
        <div class="status-tabs" role="group" aria-label={t("unlock.statusFilter")}>
          {(["all", "locked", "unlocked"] as const).map((value) => (
            <button
              key={value}
              type="button"
              class={status === value ? "is-active" : ""}
              aria-pressed={status === value}
              onClick={() => setStatus(value)}
            >
              <Trans t={t} i18nKey={`unlock.${value}`} />
            </button>
          ))}
        </div>
        <div class="catalog-progress" role="status">
          <Trans
            t={t}
            i18nKey="unlock.progress"
            values={{
              unlocked: formatNumber.format(entries.filter((entry) => entry.checked).length),
              total: formatNumber.format(entries.length),
            }}
            components={{ prefix: <span class="progress-label" />, amount: <strong /> }}
          />
        </div>
      </div>
      <div class="catalog-groups">
        {groups.map((group) => {
          const rows = visible.filter((entry) => entry.group === group);
          if (rows.length === 0) return undefined;
          const expanded = !expandedState.has(group);
          const contentId = `${kind}-${group}-items`;
          return (
            <section class="catalog-group" key={group}>
              <button
                class="group-heading"
                type="button"
                aria-expanded={expanded}
                aria-controls={contentId}
                onClick={() => toggleGroup(group)}
              >
                <Icon name={expanded ? "chevron-down" : "chevron-right"} />
                <Trans t={t} i18nKey={`unlock.groups.${group}`} />
                <span class="group-count">{formatNumber.format(rows.length)}</span>
              </button>
              <div class="item-grid" id={contentId} hidden={!expanded}>
                {rows.map((entry) => {
                  const name = getItemName(entry.item, language);
                  return (
                    <label key={entry.id} class={`item-card${entry.checked ? " is-unlocked" : ""}`}>
                      <ItemImage itemId={entry.item.id} />
                      <span class="item-body">
                        <span class="item-name">{name}</span>
                        {entry.notice ? (
                          <span class="item-notice">
                            <Trans t={t} i18nKey={`unlock.${entry.notice}`} />
                          </span>
                        ) : entry.secondary ? (
                          <span class="item-subtitle" title={entry.secondary}>
                            {entry.secondary}
                          </span>
                        ) : undefined}
                      </span>
                      <span class="unlock-state">
                        <input
                          type="checkbox"
                          checked={entry.checked}
                          aria-label={t("unlock.toggle", { name })}
                          onChange={(event) => entry.onChange(event.currentTarget.checked)}
                        />
                        <span>
                          <Trans
                            t={t}
                            i18nKey={`unlock.${entry.checked ? "unlocked" : "locked"}`}
                          />
                        </span>
                      </span>
                    </label>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
      {visible.length === 0 && (
        <div class="catalog-empty" role="status">
          <p>
            <Trans t={t} i18nKey="unlock.empty" />
          </p>
          <button type="button" onClick={resetFilters}>
            <Trans t={t} i18nKey="unlock.resetFilters" />
          </button>
        </div>
      )}
    </section>
  );
}
