import { Trans, useTranslation } from "react-i18next";
import { appPath } from "../paths";

export default function NotFoundView() {
  const { t } = useTranslation();
  return (
    <section class="empty-state">
      <h1>
        <Trans t={t} i18nKey="app.notFound" />
      </h1>
      <a href={appPath("/recipes")}>
        <Trans t={t} i18nKey="app.home" />
      </a>
    </section>
  );
}
