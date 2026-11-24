import { useLocation } from "preact-iso";
import { Trans, useTranslation } from "react-i18next";
import { Icon } from "./Icon";
import { appPath } from "../paths";

const links = [
  { href: "/recipes", key: "recipes", icon: "flask" },
  { href: "/weapon-manuals", key: "manuals", icon: "book" },
  { href: "/printer", key: "printer", icon: "calculator" },
  { href: "/requirements", key: "requirements", icon: "checklist" },
  { href: "/traits", key: "perks", icon: "hierarchy" },
] as const;

export function AppNavigation() {
  const { path } = useLocation();
  const { t } = useTranslation();
  const currentPath = path.replace(/\/+$/, "") || "/";
  const rootPath = appPath("/").replace(/\/$/, "") || "/";
  return (
    <nav class="app-navigation">
      {links.map((link) => (
        <a
          key={link.href}
          href={appPath(link.href)}
          aria-current={
            currentPath === appPath(link.href) ||
            (currentPath === rootPath && link.key === "recipes")
              ? "page"
              : undefined
          }
        >
          <Icon name={link.icon} />
          <span class="nav-long">
            <Trans t={t} i18nKey={`nav.${link.key}`} />
          </span>
          <span class="nav-short">
            <Trans t={t} i18nKey={`nav.${link.key}Short`} />
          </span>
        </a>
      ))}
    </nav>
  );
}
