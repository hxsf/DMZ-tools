import { Trans, useTranslation } from "react-i18next";
import { useApp } from "../context";
import { getItemName, itemById } from "../data/display";
import type { MaterialSummary } from "../types/calculation";
import { ItemImage } from "./ItemImage";
import { Icon } from "./Icon";

export function MaterialList({
  summary,
  deduct = true,
}: {
  summary: MaterialSummary;
  deduct?: boolean;
}) {
  const { stores, persist } = useApp();
  const { t, i18n } = useTranslation();
  const format = new Intl.NumberFormat(i18n.language);
  const groups = ["resources", "ingredients", "items"] as const;
  return (
    <div class="material-list">
      <div class="material-columns">
        <span>
          <Trans t={t} i18nKey="common.material" />
        </span>
        <span>
          <Trans t={t} i18nKey="common.total" />
        </span>
        <span>
          <Trans t={t} i18nKey="common.owned" />
        </span>
        <span>
          <Trans t={t} i18nKey="common.missing" />
        </span>
      </div>
      {groups.map((group) => {
        const rows = summary.rows.filter((row) => {
          const kind = itemById.get(row.itemId)?.kind;
          return (
            (kind === "resource"
              ? "resources"
              : kind === "ingredient"
                ? "ingredients"
                : "items") === group
          );
        });
        if (rows.length === 0) return undefined;
        return (
          <details class="material-group" key={group} open>
            <summary class="group-heading">
              <Icon name="chevron-down" />
              <Trans t={t} i18nKey={`common.${group}`} />
              <span class="group-count">{format.format(rows.length)}</span>
            </summary>
            {rows.map((row) => {
              const item = itemById.get(row.itemId);
              const name = item ? getItemName(item, i18n.language) : row.itemId;
              return (
                <div class="material-row" key={row.itemId}>
                  <div class="material-name">
                    <ItemImage itemId={row.itemId} />
                    <span>
                      {name}
                      <small class="mobile-required">
                        <Trans
                          t={t}
                          i18nKey="common.requiredValue"
                          values={{ count: row.required }}
                        />
                      </small>
                    </span>
                  </div>
                  <span class="material-required">{format.format(row.required)}</span>
                  <input
                    class="inventory-input"
                    type="number"
                    min="0"
                    step="1"
                    inputMode="numeric"
                    value={row.owned.mapOr("", (count) => String(count))}
                    placeholder={t("common.unknown")}
                    aria-label={t("common.editOwned", { name })}
                    onChange={(event) => {
                      if (event.currentTarget.validity.badInput) {
                        event.currentTarget.value = row.owned.mapOr("", String);
                        return;
                      }
                      const raw = event.currentTarget.value;
                      const value = Number(raw);
                      if (raw === "") stores.inventory.forgetQuantity(row.itemId);
                      else if (Number.isSafeInteger(value) && value >= 0)
                        stores.inventory.setQuantity(row.itemId, value);
                      else {
                        event.currentTarget.value = row.owned.mapOr("", String);
                        return;
                      }
                      void persist();
                    }}
                  />
                  <strong class="material-missing">
                    {!deduct
                      ? format.format(row.required)
                      : row.missing.mapOr(t("common.unknown"), (count) => format.format(count))}
                  </strong>
                </div>
              );
            })}
          </details>
        );
      })}
      {summary.rows.length === 0 && (
        <p class="empty-state">
          <Trans t={t} i18nKey="common.empty" />
        </p>
      )}
    </div>
  );
}
