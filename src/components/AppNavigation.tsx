import { useLocation } from "preact-iso";

const links = [
  { href: "/recipes", label: "打印配方" },
  { href: "/weapon-manuals", label: "武器手册" },
  { href: "/printer", label: "打印计算器" },
  { href: "/requirements", label: "需求清单" },
];

export function AppNavigation() {
  const { path } = useLocation();
  const activePath = path === "/" ? "/recipes" : path.replace(/\/$/, "");

  return (
    <nav class="app-navigation" aria-label="工具导航">
      {links.map(({ href, label }) => (
        <a key={href} href={href} aria-current={activePath === href ? "page" : undefined}>
          {label}
        </a>
      ))}
    </nav>
  );
}
