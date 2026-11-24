import { useState } from "preact/hooks";
import { Trans, useTranslation } from "react-i18next";
import type { Perk } from "../types/perk";

export type TextLanguage = "zh" | "en";

export function PerkText({
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
