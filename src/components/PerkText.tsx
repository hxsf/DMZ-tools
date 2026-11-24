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
  const zhSource = field === "name" ? perk.nameZhSource : perk.descriptionZhSource;
  const effectSource =
    perk.effectReference ?? (perk.descriptionEnIsExcerpt ? undefined : perk.sourceUrl);
  const reference = zhSource ?? (field === "description" ? effectSource : undefined);
  const communityName = field === "name" && !official;
  const zhReferenceKey = communityName
    ? "perks.communityNameSource"
    : field === "name"
      ? "perks.zhNameSource"
      : "perks.zhEffectSource";
  const referenceLabel = zhSource
    ? t(zhReferenceKey, { name: perk.name.zh })
    : t(perk.effectReference ? "perks.effectReference" : "perks.fullSource", {
        name: perk.name.zh,
      });
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
      {displayed === "zh" && reference && (
        <a
          class="perk-source-short"
          href={reference}
          target="_blank"
          rel="noreferrer"
          aria-label={referenceLabel}
          title={referenceLabel}
        >
          <span aria-hidden="true">↗</span>
        </a>
      )}
      {displayed === "zh" && field === "description" && zhSource && perk.effectReference && (
        <a
          class="perk-source-short"
          href={perk.effectReference}
          target="_blank"
          rel="noreferrer"
          aria-label={t("perks.effectReference", { name: perk.name.zh })}
        >
          <Trans t={t} i18nKey="perks.effectSupplement" />
        </a>
      )}
    </>
  );
  if (field === "name") return content;
  return (
    <>
      <p>{content}</p>
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
          {perk.effectReference && (
            <>
              {" "}
              ·{" "}
              <a href={perk.effectReference} target="_blank" rel="noreferrer">
                <Trans t={t} i18nKey="perks.effectDetails" />
              </a>
            </>
          )}
        </div>
      )}
    </>
  );
}
