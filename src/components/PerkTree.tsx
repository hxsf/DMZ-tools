import { useLayoutEffect, useRef, useState } from "preact/hooks";
import { Trans, useTranslation } from "react-i18next";
import { perks, type Perk } from "../data/perks";
import { getMinorPosition, isPerkBuild, withMinorPosition } from "../perk-code";
import {
  maxBranchDepth,
  maxPrestigeSlots,
  maxTreePoints,
  perkBranches,
  type PerkBuild,
  type PerkTree as Branch,
} from "../types/perk-build";
import { Icon } from "./Icon";
import { PerkIcon } from "./PerkIcon";
import { PerkText, type TextLanguage } from "./PerkText";
import "../styles/perk-tree.css";

export type TreeMode = "icon" | "name" | "description";
type Track = Branch | "prestige";
type Slot = { track: Track; row: number; position?: 0 | 1 | 2 };
type Pick = (slot: Slot, perk?: Perk) => void;

interface TreeProps {
  build: PerkBuild;
  editable: boolean;
  language: TextLanguage;
  mode: TreeMode;
  onChange: (build: PerkBuild) => Promise<boolean>;
}

const byId = new Map<number, Perk>(perks.map((perk) => [perk.wireId, perk]));
// Slot counts from the in-game FOB board, starting at the base of a branch.
const widths = [1, 3, 2, 3, 3, 2, 3, 3, 2] as const;
const rows = Array.from({ length: maxBranchDepth }, (_, index) => maxBranchDepth - index);

function nextBuild(build: PerkBuild, { track, row, position }: Slot, perk?: Perk): PerkBuild {
  const entries = [...build[track]];
  if (perk) entries[row - 1] = perk.wireId;
  else entries.splice(row - 1, 1);
  const updated = { ...build, [track]: entries };
  if (track !== "prestige" && widths[row - 1] === 3) {
    return withMinorPosition(updated, track, row, perk ? position : undefined);
  }
  return updated;
}

function nameFor(perk: Perk, language: TextLanguage) {
  return language === "zh" && perk.name.zh
    ? perk.name.zh + (perk.nameOfficialZh ? "" : "＊")
    : perk.name.en;
}

function effectFor(perk: Perk, language: TextLanguage) {
  return language === "zh" && perk.description.zh
    ? perk.description.zh + (perk.descriptionOfficialZh ? "" : "＊")
    : perk.description.en;
}

function optionsFor({ track, row }: Slot): readonly Perk[] {
  if (track === "prestige") return perks.filter((perk) => perk.kind === "prestige");
  if (row % 3 !== 0) return perks.filter((perk) => perk.kind === "minor");
  return perks.filter((perk) => perk.kind === "major" && perk.tree === track && perk.row === row);
}

function positionKey(count: number, index: number) {
  return index === 0
    ? "perks.treeLeft"
    : index === count - 1
      ? "perks.treeRight"
      : "perks.treeCenter";
}

function Picker({
  slot,
  build,
  language,
  onClose,
  onPick,
}: {
  slot: Slot;
  build: PerkBuild;
  language: TextLanguage;
  onClose: () => void;
  onPick: Pick;
}) {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const dialog = useRef<HTMLDialogElement>(null);
  const currentId = build[slot.track][slot.row - 1];
  const namedSlot = t("perks.branchRow", { branch: t("perks." + slot.track), row: slot.row });
  const showPosition =
    slot.track !== "prestige" && widths[slot.row - 1] === 3 && slot.position !== undefined;
  const canRemove =
    currentId !== undefined && (slot.track === "prestige" || slot.row === build[slot.track].length);
  const needle = query.trim().toLowerCase();
  const candidates = optionsFor(slot).filter(
    (perk) =>
      isPerkBuild(nextBuild(build, slot, perk)) &&
      [
        perk.name.zh,
        perk.name.en,
        perk.description.zh,
        perk.description.en,
        perk.englishExcerpt,
      ].some((text) => text.toLowerCase().includes(needle)),
  );
  useLayoutEffect(() => {
    const el = dialog.current;
    if (!el) return;
    const previous = document.activeElement;
    const overflow = document.documentElement.style.overflow;
    el.showModal();
    document.documentElement.style.overflow = "hidden";
    return () => {
      el.close();
      document.documentElement.style.overflow = overflow;
      if (previous instanceof HTMLElement && previous.isConnected)
        previous.focus({ preventScroll: true });
    };
  }, []);
  return (
    <dialog
      ref={dialog}
      class="trait-picker"
      aria-labelledby="trait-picker-heading"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target !== event.currentTarget) return;
        const rect = event.currentTarget.getBoundingClientRect();
        if (
          event.clientX < rect.left ||
          event.clientX > rect.right ||
          event.clientY < rect.top ||
          event.clientY > rect.bottom
        )
          onClose();
      }}
    >
      <header>
        <h2 id="trait-picker-heading">
          {showPosition && slot.position !== undefined ? (
            <Trans
              t={t}
              i18nKey="perks.treeSlotPosition"
              values={{ slot: namedSlot, position: t(positionKey(3, slot.position)) }}
            />
          ) : (
            namedSlot
          )}
        </h2>
        <button type="button" aria-label={t("common.close")} onClick={onClose}>
          <Icon name="x" />
        </button>
      </header>
      <div class="trait-picker-tools">
        <label class="catalog-search">
          <Icon name="search" />
          <input
            id="trait-picker-search"
            type="search"
            value={query}
            aria-label={t("perks.search")}
            placeholder={t("perks.search")}
            onInput={(e) => setQuery(e.currentTarget.value)}
          />
        </label>
        {canRemove && (
          <button type="button" id="trait-slot-remove" onClick={() => onPick(slot)}>
            <Trans t={t} i18nKey="perks.remove" />
          </button>
        )}
      </div>
      <div class="trait-picker-list">
        {candidates.map((perk) => (
          <article
            key={perk.wireId}
            class="trait-pick-card"
            data-selected={currentId === perk.wireId}
          >
            <PerkIcon name={perk.name.en} />
            <div>
              <h3>
                <PerkText perk={perk} field="name" language={language} />
              </h3>
              <PerkText perk={perk} field="description" language={language} />
            </div>
            <button
              type="button"
              class="perk-choice"
              data-wire-id={perk.wireId}
              aria-pressed={perk.wireId === currentId}
              aria-label={t("perks.recordNamed", { name: nameFor(perk, language) })}
              onClick={() => onPick(slot, perk)}
            >
              <Trans
                t={t}
                i18nKey={perk.wireId === currentId ? "perks.treeSelected" : "perks.treeUse"}
              />
            </button>
          </article>
        ))}
        {!candidates.length && (
          <p class="empty-state">
            <Trans t={t} i18nKey="perks.noMatches" />
          </p>
        )}
      </div>
    </dialog>
  );
}

function Node({
  slot,
  candidate,
  selected,
  primary,
  available,
  mode,
  language,
  onClick,
}: {
  slot: Slot;
  candidate?: Perk;
  selected: boolean;
  primary: boolean;
  available: boolean;
  mode: TreeMode;
  language: TextLanguage;
  onClick: () => void;
}) {
  const { t } = useTranslation();
  const { track, row } = slot;
  const name = candidate
    ? nameFor(candidate, language)
    : t(track === "prestige" ? "perks.prestigeSlot" : "perks.unrevealed");
  const effect = candidate ? effectFor(candidate, language) : "";
  const state = t(
    selected ? "perks.treeSelected" : available ? "perks.treeAvailable" : "perks.treeLocked",
  );
  const label = t("perks.treeNode", { branch: t("perks." + track), row, name, state });
  const title =
    track !== "prestige" && widths[row - 1] === 3 && slot.position !== undefined
      ? t("perks.treeSlotPosition", { slot: label, position: t(positionKey(3, slot.position)) })
      : label;
  return (
    <button
      type="button"
      class="perk-node"
      id={primary ? "trait-" + track + "-" + row : undefined}
      data-wire-id={candidate?.wireId}
      data-position={slot.position}
      data-selected={selected}
      aria-label={title}
      aria-pressed={selected}
      title={effect ? title + "\n" + effect : title}
      disabled={!available}
      onClick={onClick}
    >
      <span class="perk-node-mark" aria-hidden="true">
        {candidate && <PerkIcon name={candidate.name.en} />}
        <span class="perk-node-fallback">
          {candidate
            ? candidate.name.en
                .split(/\s+/)
                .map((word) => word[0])
                .slice(0, 2)
                .join("")
            : track === "prestige"
              ? "+"
              : "?"}
        </span>
      </span>
      {mode !== "icon" && candidate && (
        <span class="perk-node-name" lang={language}>
          {name}
        </span>
      )}
      {mode === "description" && candidate && (
        <span class="perk-node-description" lang={language}>
          {effect}
        </span>
      )}
    </button>
  );
}

function positions(count: number) {
  if (count === 1) return [50];
  if (count === 2) return [27, 73];
  return [19, 50, 81];
}

function Links({
  upper,
  lower,
  upperSelected,
  lowerSelected,
}: {
  upper: number;
  lower: number;
  upperSelected: number;
  lowerSelected: number;
}) {
  const above = positions(upper);
  const below = positions(lower);
  const endpoints = [...above, ...below];
  const path = (a: number, b: number) => "M " + a + " 0 V 5 H " + b + " V 10";
  return (
    <svg
      class="perk-branch-links"
      viewBox="0 0 100 10"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path d={"M " + Math.min(...endpoints) + " 5 H " + Math.max(...endpoints)} />
      {above.map((x) => (
        <path key={"u" + x} d={"M " + x + " 0 V 5"} />
      ))}
      {below.map((x) => (
        <path key={"d" + x} d={"M " + x + " 5 V 10"} />
      ))}
      {upperSelected >= 0 && lowerSelected >= 0 && (
        <path class="is-lit" d={path(above[upperSelected], below[lowerSelected])} />
      )}
    </svg>
  );
}

function boardChoices(build: PerkBuild, track: Branch, row: number): readonly (Perk | undefined)[] {
  if (row % 3 === 0) return optionsFor({ track, row });
  const count = widths[row - 1];
  const position = count === 1 ? 0 : getMinorPosition(build, track, row);
  const recorded = byId.get(build[track][row - 1]);
  return Array.from({ length: count }, (_, index) => (index === position ? recorded : undefined));
}

export function PerkTree({ build, editable, language, mode, onChange }: TreeProps) {
  const { t } = useTranslation();
  const [picker, setPicker] = useState<Slot>();
  const [announcement, setAnnouncement] = useState("");
  const points = perkBranches.reduce((sum, branch) => sum + build[branch].length, 0);
  const pick: Pick = (slot, perk) => {
    const updated = nextBuild(build, slot, perk);
    if (!editable || !isPerkBuild(updated)) return;
    setPicker(undefined);
    void onChange(updated).then((saved) => {
      setAnnouncement(
        saved
          ? t(perk ? "perks.treeRecorded" : "perks.treeRemoved", {
              branch: t("perks." + slot.track),
              row: slot.row,
              name: perk ? nameFor(perk, language) : "",
            })
          : t("app.saveFailed"),
      );
    });
  };
  return (
    <>
      <div class="perk-tree-scroll" data-mode={mode}>
        <div class="perk-tree-board" data-mode={mode}>
          {perkBranches.map((track) => (
            <section
              key={track}
              class="perk-branch-diagram"
              data-branch={track}
              aria-labelledby={"trait-title-" + track}
            >
              {rows.map((row) => {
                const slot = { track, row };
                const id = build[track][row - 1];
                const candidates = boardChoices(build, track, row);
                const chosen = candidates.findIndex(
                  (candidate) => candidate !== undefined && candidate.wireId === id,
                );
                const anchor = chosen >= 0 ? chosen : Math.floor((candidates.length - 1) / 2);
                const available =
                  editable &&
                  row <= build[track].length + 1 &&
                  (id !== undefined || points < maxTreePoints);
                const lower = row > 1 ? boardChoices(build, track, row - 1) : [];
                return (
                  <div key={row} class="perk-tier" data-row={row} data-major={row % 3 === 0}>
                    <div class="perk-tier-choices" data-count={candidates.length}>
                      {candidates.map((candidate, index) => {
                        const position = index === 0 ? 0 : index === 1 ? 1 : 2;
                        const nodeSlot: Slot = { ...slot, position };
                        return (
                          <Node
                            key={index}
                            slot={nodeSlot}
                            candidate={candidate}
                            primary={index === anchor}
                            selected={chosen === index}
                            available={available}
                            mode={mode}
                            language={language}
                            onClick={() => {
                              if (candidate?.kind === "major" && candidate.wireId !== id)
                                pick(nodeSlot, candidate);
                              else setPicker(nodeSlot);
                            }}
                          />
                        );
                      })}
                    </div>
                    {mode !== "icon" && candidates.some(Boolean) && (
                      <div class="perk-tier-legend">
                        {candidates.map(
                          (candidate, index) =>
                            candidate && (
                              <div key={candidate.wireId} class="perk-tier-note">
                                {candidates.length > 1 && (
                                  <small>
                                    <Trans t={t} i18nKey={positionKey(candidates.length, index)} />
                                  </small>
                                )}
                                <strong class="perk-node-name" lang={language}>
                                  {nameFor(candidate, language)}
                                </strong>
                                {mode === "description" && (
                                  <span class="perk-node-description" lang={language}>
                                    {effectFor(candidate, language)}
                                  </span>
                                )}
                              </div>
                            ),
                        )}
                      </div>
                    )}
                    {row > 1 && (
                      <Links
                        upper={candidates.length}
                        lower={lower.length}
                        upperSelected={chosen}
                        lowerSelected={lower.findIndex(
                          (candidate) =>
                            candidate !== undefined && candidate.wireId === build[track][row - 2],
                        )}
                      />
                    )}
                  </div>
                );
              })}
              <h3 id={"trait-title-" + track} class="perk-branch-title">
                <Trans t={t} i18nKey={"perks." + track} />
                <small>
                  {build[track].length} / {maxBranchDepth}
                </small>
              </h3>
            </section>
          ))}
          <section
            class="perk-prestige-diagram"
            aria-labelledby="trait-title-prestige"
            data-branch="prestige"
          >
            <div class="perk-prestige-nodes">
              {Array.from({ length: maxPrestigeSlots }, (_, index) => {
                const slot = { track: "prestige" as const, row: index + 1 };
                const candidate = byId.get(build.prestige[index]);
                return (
                  <Node
                    key={index}
                    slot={slot}
                    candidate={candidate}
                    primary
                    selected={!!candidate}
                    available={editable && index <= build.prestige.length}
                    mode={mode}
                    language={language}
                    onClick={() => setPicker(slot)}
                  />
                );
              })}
            </div>
            <h3 id="trait-title-prestige" class="perk-branch-title">
              <Trans t={t} i18nKey="perks.prestigeShort" />
              <small>
                {build.prestige.length} / {maxPrestigeSlots}
              </small>
            </h3>
          </section>
          {mode !== "icon" && build.prestige.length > 0 && (
            <div class="perk-prestige-legend">
              {build.prestige.map((id, index) => {
                const perk = byId.get(id);
                return (
                  perk && (
                    <div key={id} class="perk-tier-note">
                      <small>
                        <Trans
                          t={t}
                          i18nKey="perks.branchRow"
                          values={{ branch: t("perks.prestigeShort"), row: index + 1 }}
                        />
                      </small>
                      <strong class="perk-node-name" lang={language}>
                        {nameFor(perk, language)}
                      </strong>
                      {mode === "description" && (
                        <span class="perk-node-description" lang={language}>
                          {effectFor(perk, language)}
                        </span>
                      )}
                    </div>
                  )
                );
              })}
            </div>
          )}
        </div>
      </div>
      <span class="sr-only" role="status">
        {announcement}
      </span>
      {picker && (
        <Picker
          slot={picker}
          build={build}
          language={language}
          onClose={() => setPicker(undefined)}
          onPick={pick}
        />
      )}
    </>
  );
}
