import { columns, names, rows, url } from "virtual:perk-atlas";
import "./PerkIcon.css";

const cells = new Map(names.map((name, index) => [name, index]));

export function PerkIcon({ name }: { name: string }) {
  const key = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  const index = cells.get(key);
  if (index === undefined) return undefined;
  const x = ((index % columns) * 100) / Math.max(1, columns - 1);
  const y = (Math.floor(index / columns) * 100) / Math.max(1, rows - 1);
  return (
    <span
      class="perk-icon"
      data-perk-icon={name}
      aria-hidden="true"
      style={{
        backgroundImage: `url("${url}")`,
        backgroundSize: `${columns * 100}% ${rows * 100}%`,
        backgroundPosition: `${x}% ${y}%`,
      }}
    />
  );
}
