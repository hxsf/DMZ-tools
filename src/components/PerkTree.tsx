import { useLayoutEffect, useRef, useState } from "preact/hooks";
import { Trans, useTranslation } from "react-i18next";
import { Err, Ok, type Result } from "ts-results-es";
import { perks, type Perk } from "../data/perks";
import {
  activateMinorRoll,
  getPrestigeSlot,
  setPrestigeSlot,
  getMinorRoll,
  isPerkBuild,
  recordMinorRoll,
} from "../perk-code";
import {
  maxBranchDepth,
  maxPrestigeSlots,
  maxTreePoints,
  perkBranches,
  type MinorPosition,
  type PerkBuild,
  type PerkTree as Branch,
} from "../types/perk-build";
import { clearPerkSlot } from "../perk-tree-actions";
import { useNodeClear } from "./useNodeClear";
import { Icon } from "./Icon";
import { PerkIcon } from "./PerkIcon";
import { PerkText, type TextLanguage } from "./PerkText";
import { PerkNodeTooltip } from "./PerkNodeTooltip";
import "../styles/perk-tree.css";

type Track = Branch | "prestige";
type Slot = { track: Track; row: number; position?: MinorPosition };
type Change = Result<PerkBuild, "invalid-build">;
type Edit = "recordRoll" | "activateSlot" | "clearNode";
type Apply = (change: Change, slot: Slot, edit: Edit, perk?: Perk) => void;

interface TreeProps {
  build: PerkBuild;
  editable: boolean;
  language: TextLanguage;
  onChange: (build: PerkBuild) => Promise<boolean>;
}

const byId = new Map<number, Perk>(perks.map((perk) => [perk.wireId, perk]));
// Slot counts from the in-game FOB board, starting at the base of a branch.
const widths = [1, 3, 2, 3, 3, 2, 3, 3, 2] as const;
const rows = Array.from({ length: maxBranchDepth }, (_, index) => maxBranchDepth - index);

function activateMajor(build: PerkBuild, tree: Branch, row: number, perk: Perk): Change {
  const entries = [...build[tree]];
  if (entries[row - 1] === perk.wireId) return Err("invalid-build");
  entries[row - 1] = perk.wireId;
  const next = { ...build, [tree]: entries };
  return isPerkBuild(next) ? Ok(next) : Err("invalid-build");
}

function isRouteAvailable(build: PerkBuild, track: Branch, row: number, points: number) {
  return row <= build[track].length || (row === build[track].length + 1 && points < maxTreePoints);
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

const positionKeys = ["perks.treeLeft", "perks.treeCenter", "perks.treeRight"] as const;

function Picker({
  slot,
  build,
  language,
  routeAvailable,
  onClose,
  onApply,
}: {
  slot: Slot;
  build: PerkBuild;
  language: TextLanguage;
  routeAvailable: boolean;
  onClose: () => void;
  onApply: Apply;
}) {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const dialog = useRef<HTMLDialogElement>(null);
  const { track, row } = slot;
  const roll = track === "prestige" ? undefined : { tree: track, position: slot.position ?? 0 };
  const canChooseMode = !!roll && routeAvailable;
  const [alsoActivate, setAlsoActivate] = useState(canChooseMode);
  const namedSlot = t("perks.branchRow", { branch: t("perks." + track), row });
  const showPosition = roll && widths[row - 1] === 3 && slot.position !== undefined;
  const needle = query.trim().toLowerCase();
  const candidates = optionsFor(slot).filter((perk) =>
    [
      perk.name.zh,
      ...(perk.nameAliasesZh ?? []),
      perk.name.en,
      perk.description.zh,
      perk.description.en,
      perk.englishExcerpt,
    ].some((text) => text.toLowerCase().includes(needle)),
  );
  function choice(perk: Perk): Change {
    if (!roll) return setPrestigeSlot(build, row, perk.wireId);
    const recorded = recordMinorRoll(build, roll.tree, row, roll.position, perk.wireId);
    return canChooseMode && alsoActivate
      ? recorded.andThen((next) => activateMinorRoll(next, roll.tree, row, roll.position))
      : recorded;
  }
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
              values={{ slot: namedSlot, position: t(positionKeys[slot.position]) }}
            />
          ) : (
            namedSlot
          )}
        </h2>
        <button type="button" aria-label={t("common.close")} onClick={onClose}>
          <Icon name="x" />
        </button>
      </header>
      {canChooseMode && (
        <div class="trait-picker-actions">
          <div class="trait-pick-modes" role="group" aria-label={t("perks.rollAction")}>
            {(["record", "activate"] as const).map((value) => (
              <button
                key={value}
                type="button"
                data-pick-mode={value}
                aria-pressed={(value === "activate") === alsoActivate}
                onClick={() => setAlsoActivate(value === "activate")}
              >
                <Trans
                  t={t}
                  i18nKey={value === "record" ? "perks.recordOnly" : "perks.recordAndActivate"}
                />
              </button>
            ))}
          </div>
        </div>
      )}
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
      </div>
      <div class="trait-picker-list">
        {candidates.map((perk) => {
          const change = choice(perk);
          const label = change.isErr()
            ? "perks.usedElsewhere"
            : !roll || alsoActivate
              ? "perks.treeUse"
              : "perks.recordOffer";
          return (
            <article key={perk.wireId} class="trait-pick-card">
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
                aria-label={t("perks.chooseAction", {
                  name: nameFor(perk, language),
                  action: t(label),
                })}
                disabled={change.isErr()}
                onClick={() =>
                  onApply(
                    change,
                    slot,
                    !roll || (canChooseMode && alsoActivate) ? "activateSlot" : "recordRoll",
                    perk,
                  )
                }
              >
                <Trans t={t} i18nKey={label} />
              </button>
            </article>
          );
        })}
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
  language,
  onClick,
  onClear,
}: {
  slot: Slot;
  candidate?: Perk;
  selected: boolean;
  primary: boolean;
  available: boolean;
  language: TextLanguage;
  onClick: () => void;
  onClear?: () => void;
}) {
  const { t } = useTranslation();
  const gesture = useNodeClear(candidate?.wireId, onClear);
  const { track, row } = slot;
  const name = candidate
    ? nameFor(candidate, language)
    : t(track === "prestige" ? "perks.prestigeSlot" : "perks.unrevealed");
  const recorded = candidate?.kind === "minor";
  const state = t(
    selected
      ? "perks.treeSelected"
      : recorded
        ? "perks.offRoute"
        : available
          ? track !== "prestige" && row % 3 !== 0
            ? "perks.canRecord"
            : "perks.treeAvailable"
          : "perks.treeLocked",
  );
  const label = t("perks.treeNode", { branch: t("perks." + track), row, name, state });
  const title =
    track !== "prestige" && widths[row - 1] === 3 && slot.position !== undefined
      ? t("perks.treeSlotPosition", { slot: label, position: t(positionKeys[slot.position]) })
      : label;
  return (
    <button
      type="button"
      class="perk-node"
      id={primary ? "trait-" + track + "-" + row : undefined}
      data-wire-id={candidate?.wireId}
      data-position={slot.position}
      data-recorded={recorded}
      data-selected={selected}
      aria-label={title}
      aria-pressed={selected}
      aria-disabled={!available && !onClear}
      aria-keyshortcuts={onClear ? "Delete Backspace" : undefined}
      data-clearable={!!onClear}
      disabled={!available && !candidate}
      onPointerDown={gesture.onPointerDown}
      onContextMenu={gesture.onContextMenu}
      onKeyDown={gesture.onKeyDown}
      onClick={() => {
        if (!gesture.consumeClick() && available) onClick();
      }}
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
      {candidate && (
        <span class="perk-node-name" lang={language}>
          {name}
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
  const positions: readonly MinorPosition[] = widths[row - 1] === 1 ? [0] : [0, 1, 2];
  return positions.map((position) => {
    const id = getMinorRoll(build, track, row, position);
    return id === undefined ? undefined : byId.get(id);
  });
}

export function PerkTree({ build, editable, language, onChange }: TreeProps) {
  const { t } = useTranslation();
  const board = useRef<HTMLDivElement>(null);
  const [picker, setPicker] = useState<Slot>();
  const [announcement, setAnnouncement] = useState("");
  const points = perkBranches.reduce((sum, branch) => sum + build[branch].length, 0);
  const apply: Apply = (change, slot, edit, perk) => {
    if (!editable || change.isErr()) return;
    setPicker(undefined);
    void onChange(change.value).then((saved) => {
      setAnnouncement(
        saved
          ? t("perks." + edit, {
              branch: t("perks." + slot.track),
              row: slot.row,
              name: perk ? nameFor(perk, language) : "",
            })
          : t("app.saveFailed"),
      );
    });
  };
  function clear(slot: Slot) {
    apply(clearPerkSlot(build, slot.track, slot.row, slot.position), slot, "clearNode");
  }
  return (
    <>
      <div class="perk-tree-scroll">
        <div
          ref={board}
          class="perk-tree-board"
          role="group"
          aria-label={t("perks.myTree")}
          aria-describedby="trait-controls-hint"
        >
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
                const reached = isRouteAvailable(build, track, row, points);
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
                            available={editable && (candidate ? reached : row % 3 !== 0)}
                            language={language}
                            onClear={
                              editable && (index === chosen || candidate?.kind === "minor")
                                ? () => clear(nodeSlot)
                                : undefined
                            }
                            onClick={() => {
                              if (!candidate) setPicker(nodeSlot);
                              else if (index !== chosen) {
                                const change =
                                  candidate.kind === "major"
                                    ? activateMajor(build, track, row, candidate)
                                    : activateMinorRoll(build, track, row, position);
                                apply(change, nodeSlot, "activateSlot", candidate);
                              }
                            }}
                          />
                        );
                      })}
                    </div>
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
                const id = getPrestigeSlot(build, index + 1);
                const candidate = id === undefined ? undefined : byId.get(id);
                return (
                  <Node
                    key={index}
                    slot={slot}
                    candidate={candidate}
                    primary
                    selected={!!candidate}
                    available={editable}
                    language={language}
                    onClear={editable && candidate ? () => clear(slot) : undefined}
                    onClick={() => {
                      if (!candidate) setPicker(slot);
                    }}
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
        </div>
      </div>
      {!picker && (
        <PerkNodeTooltip
          board={board}
          language={language}
          textFor={(id) => {
            const perk = byId.get(id);
            return (
              perk && { name: nameFor(perk, language), description: effectFor(perk, language) }
            );
          }}
        />
      )}
      <span class="sr-only" role="status">
        {announcement}
      </span>
      {picker && (
        <Picker
          slot={picker}
          build={build}
          language={language}
          routeAvailable={
            picker.track === "prestige" || isRouteAvailable(build, picker.track, picker.row, points)
          }
          onClose={() => setPicker(undefined)}
          onApply={apply}
        />
      )}
    </>
  );
}
