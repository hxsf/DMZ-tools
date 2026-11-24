import { useRef, useState } from "preact/hooks";
import { Trans, useTranslation } from "react-i18next";
import { decodePerkBuild, encodePerkBuild } from "../perk-code";
import type { PerkBuild } from "../types/perk-build";
import { Icon } from "./Icon";

interface PerkCodesProps {
  readonly build: PerkBuild;
  readonly editable: boolean;
  readonly onImport: (build: PerkBuild) => Promise<boolean>;
}

export function PerkCodes({ build, editable, onImport }: PerkCodesProps) {
  const { t } = useTranslation();
  const exportField = useRef<HTMLInputElement>(null);
  const [input, setInput] = useState("");
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState(false);
  const encoded = encodePerkBuild(build);
  const code = encoded.isOk() ? encoded.value : "";

  function report(key: string, failed = false) {
    setFeedback(key);
    setError(failed);
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      report("perks.copied");
    } catch {
      exportField.current?.focus();
      exportField.current?.select();
      report("perks.copyManually");
    }
  }

  async function apply() {
    const result = decodePerkBuild(input.trim());
    if (result.isErr()) {
      report(
        result.error === "unsupported-version" ? "perks.newerCode" : "perks.invalidCode",
        true,
      );
      return;
    }
    if (await onImport(result.value)) {
      setInput("");
      report("perks.imported");
    } else {
      report("perks.importFailed", true);
    }
  }

  return (
    <details id="trait-share" class="perk-share">
      <summary>
        <Icon name="chevron-down" />
        <Trans t={t} i18nKey="perks.share" />
      </summary>
      <div class="perk-code-fields">
        <div>
          <label for="trait-export">
            <Trans t={t} i18nKey="perks.exportCode" />
          </label>
          <div class="perk-code-line">
            <input
              id="trait-export"
              ref={exportField}
              value={code}
              readOnly
              dir="ltr"
              onFocus={(event) => event.currentTarget.select()}
            />
            <button
              id="trait-copy"
              type="button"
              disabled={!code || !editable}
              onClick={() => void copy()}
            >
              <Trans t={t} i18nKey="perks.copy" />
            </button>
          </div>
        </div>
        <div>
          <label for="trait-import">
            <Trans t={t} i18nKey="perks.importCode" />
          </label>
          <div class="perk-code-line">
            <input
              id="trait-import"
              value={input}
              dir="ltr"
              spellcheck={false}
              autoComplete="off"
              autoCapitalize="none"
              placeholder={t("perks.paste")}
              onInput={(event) => {
                setInput(event.currentTarget.value);
                setFeedback("");
              }}
            />
            <button
              id="trait-apply"
              type="button"
              disabled={!editable || !input.trim()}
              onClick={() => void apply()}
            >
              <Trans t={t} i18nKey="perks.apply" />
            </button>
          </div>
        </div>
      </div>
      {feedback && (
        <p class={error ? "perk-error" : "field-hint"} role={error ? "alert" : "status"}>
          <Trans t={t} i18nKey={feedback} />
        </p>
      )}
    </details>
  );
}
