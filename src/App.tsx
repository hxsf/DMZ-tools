import { useEffect } from "preact/hooks";
import { ErrorBoundary, LocationProvider } from "preact-iso";
import { Trans, useTranslation } from "react-i18next";
import { AppNavigation } from "./components/AppNavigation";
import { Icon } from "./components/Icon";
import { useApp } from "./context";
import { AppRouter } from "./router";
import { appPath } from "./paths";

export function App() {
  const app = useApp();
  const { t, i18n } = useTranslation();
  useEffect(() => {
    void app.load();
  }, [app]);
  useEffect(() => {
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);
  const issue = app.loadIssue.value;

  return (
    <LocationProvider scope={import.meta.env.BASE_URL}>
      <a class="skip-link" href="#main-content">
        <Trans t={t} i18nKey="app.skip" />
      </a>
      <header class="app-header">
        <a class="app-name" href={appPath("/recipes")}>
          <Trans t={t} i18nKey="app.name" />
        </a>
        <AppNavigation />
        <div class="app-tools">
          <span class="save-status" role="status">
            {app.saveStatus.value === "saving" ? (
              <Trans t={t} i18nKey="app.saving" />
            ) : app.saveStatus.value === "saved" ? (
              <Trans t={t} i18nKey="app.saved" />
            ) : undefined}
          </span>
          <button
            class="language-toggle"
            title={t("app.language")}
            aria-label={t("app.language")}
            onClick={() => {
              void i18n.changeLanguage(i18n.language.startsWith("zh") ? "en" : "zh-CN");
            }}
          >
            <Icon name="language" />
          </button>
        </div>
      </header>
      <main id="main-content" class="app-content" tabIndex={-1}>
        {app.saveStatus.value === "error" && (
          <div class="notice error" role="alert">
            <Trans t={t} i18nKey="app.saveFailed" />
            <button
              onClick={() => {
                void app.persist();
              }}
            >
              <Trans t={t} i18nKey="app.retry" />
            </button>
          </div>
        )}
        {app.loadStatus.value === "loading" ? (
          <p class="empty-state" role="status">
            <Trans t={t} i18nKey="app.loading" />
          </p>
        ) : app.loadStatus.value === "error" ? (
          <section class="empty-state" role="alert">
            <h1>
              <Trans t={t} i18nKey="app.loadFailed" />
            </h1>
            <p>
              {issue.isSome() && <Trans t={t} i18nKey={`app.loadErrors.${issue.value.status}`} />}
            </p>
            <button
              onClick={() => {
                void app.load();
              }}
            >
              <Trans t={t} i18nKey="app.retry" />
            </button>
          </section>
        ) : (
          <ErrorBoundary>
            <AppRouter />
          </ErrorBoundary>
        )}
      </main>
    </LocationProvider>
  );
}
