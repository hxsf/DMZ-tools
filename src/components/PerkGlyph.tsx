import { PerkIcon } from "./PerkIcon";
import "./PerkGlyph.css";

interface PerkGlyphProps {
  name?: string;
  selected?: boolean;
  placeholder?: "?" | "+";
}

/** Uses the enclosing branch theme to frame the original game icon. */
export function PerkGlyph({ name, selected = false, placeholder = "?" }: PerkGlyphProps) {
  return (
    <span class="perk-node-mark" data-lit={selected} aria-hidden="true">
      {name ? (
        <PerkIcon
          name={name}
          fallback={
            <span class="perk-node-fallback" data-perk-icon-missing={name}>
              {name
                .split(/\s+/)
                .slice(0, 2)
                .map((word) => word[0])
                .join("")}
            </span>
          }
        />
      ) : (
        <span class="perk-node-fallback">{placeholder}</span>
      )}
    </span>
  );
}
