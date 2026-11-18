import { useEffect, useMemo } from "preact/hooks";
import { Trans, useTranslation } from "react-i18next";
import { createPwaClient } from "../pwa";

export function PwaStatus() {
  const { t } = useTranslation();
  const pwa = useMemo(() => createPwaClient(), []);
  useEffect(() => pwa.start(), [pwa]);
  const status = pwa.status.value;
  if (status.isNone()) return undefined;
  const updating = status.value === "updating";
  const canUpdate = status.value === "updateReady" || status.value === "updateFailed";

  return (
    <div class="notice pwa-status" role="status" aria-live="polite" data-pwa-status={status.value}>
      <span>
        <Trans t={t} i18nKey={`pwa.${status.value}`} />
      </span>
      <div class="pwa-actions">
        {canUpdate && (
          <button type="button" data-pwa-action="update" onClick={() => void pwa.update()}>
            <Trans t={t} i18nKey="pwa.update" />
          </button>
        )}
        <button
          type="button"
          data-pwa-action="dismiss"
          onClick={() => pwa.dismiss()}
          disabled={updating}
        >
          <Trans t={t} i18nKey={canUpdate ? "pwa.later" : "pwa.dismiss"} />
        </button>
      </div>
    </div>
  );
}
