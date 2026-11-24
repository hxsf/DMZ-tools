import { createPortal } from "preact/compat";
import type { RefObject } from "preact";
import { useLayoutEffect, useRef, useState } from "preact/hooks";
import type { TextLanguage } from "./PerkText";

interface Props {
  board: RefObject<HTMLDivElement | null>;
  language: TextLanguage;
  textFor: (id: number) => { name: string; description: string } | undefined;
}

const tooltipId = "trait-node-tooltip";

export function PerkNodeTooltip({ board, language, textFor }: Props) {
  const [node, setNode] = useState<HTMLElement>();
  const tooltip = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const host = board.current;
    if (!host) return;
    let hovered: HTMLElement | undefined;
    let focused: HTMLElement | undefined;
    let leaveTimer: ReturnType<typeof setTimeout>;

    function slot(target: EventTarget | null) {
      if (!(target instanceof Element) || !host?.contains(target)) return;
      return target.closest<HTMLElement>(".perk-node[data-wire-id]") ?? undefined;
    }
    function insideTooltip(target: EventTarget | null) {
      return target instanceof Element && tooltip.current?.contains(target);
    }
    function pointerOver(event: PointerEvent) {
      if (event.pointerType !== "mouse") return;
      const hit = slot(event.target);
      if (!hit && !insideTooltip(event.target)) return;
      clearTimeout(leaveTimer);
      if (hit) {
        hovered = hit;
        setNode(hit);
      }
    }
    function pointerOut(event: PointerEvent) {
      if (event.pointerType !== "mouse" || !hovered) return;
      if (slot(event.relatedTarget) || insideTooltip(event.relatedTarget)) return;
      if (!slot(event.target) && !insideTooltip(event.target)) return;
      clearTimeout(leaveTimer);
      // Leave a short bridge so the pointer can cross the gap to read or select the tooltip.
      leaveTimer = setTimeout(() => {
        hovered = undefined;
        setNode(focused);
      }, 150);
    }
    function focusIn(event: FocusEvent) {
      const hit = slot(event.target);
      if (hit?.matches(":focus-visible")) {
        focused = hit;
        setNode(hit);
      }
    }
    function focusOut(event: FocusEvent) {
      if (!focused || event.target !== focused) return;
      focused = undefined;
      setNode(hovered);
    }
    function dismiss() {
      clearTimeout(leaveTimer);
      hovered = undefined;
      focused = undefined;
      setNode(undefined);
    }
    function keyDown(event: KeyboardEvent) {
      if (event.key === "Escape") dismiss();
    }
    function pointerDown(event: PointerEvent) {
      if (!insideTooltip(event.target)) dismiss();
    }
    document.addEventListener("pointerover", pointerOver);
    document.addEventListener("pointerout", pointerOut);
    document.addEventListener("focusin", focusIn);
    document.addEventListener("focusout", focusOut);
    document.addEventListener("keydown", keyDown);
    document.addEventListener("pointerdown", pointerDown);
    return () => {
      clearTimeout(leaveTimer);
      document.removeEventListener("pointerover", pointerOver);
      document.removeEventListener("pointerout", pointerOut);
      document.removeEventListener("focusin", focusIn);
      document.removeEventListener("focusout", focusOut);
      document.removeEventListener("keydown", keyDown);
      document.removeEventListener("pointerdown", pointerDown);
    };
  }, [board]);

  const info = node?.dataset.wireId ? textFor(Number(node.dataset.wireId)) : undefined;
  useLayoutEffect(() => {
    const panel = tooltip.current;
    const mark = node?.querySelector<HTMLElement>(".perk-node-mark");
    if (!node || !panel || !mark) return;
    node.setAttribute("aria-describedby", tooltipId);
    function place() {
      if (!panel || !mark) return;
      const bounds = mark.getBoundingClientRect();
      const viewport = document.documentElement.clientWidth;
      const height = window.innerHeight;
      if (bounds.bottom < 0 || bounds.top > height || bounds.right < 0 || bounds.left > viewport) {
        setNode(undefined);
        return;
      }
      const margin = 8;
      const width = panel.offsetWidth;
      const above = bounds.top - panel.offsetHeight - margin;
      const below = bounds.bottom + margin;
      const top = above >= margin ? above : Math.min(below, height - panel.offsetHeight - margin);
      const left = Math.min(bounds.x + (bounds.width - width) / 2, viewport - width - margin);
      panel.style.top = Math.round(Math.max(margin, top)) + "px";
      panel.style.left = Math.round(Math.max(margin, left)) + "px";
    }
    place();
    const observer = new ResizeObserver(place);
    observer.observe(panel);
    observer.observe(mark);
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);
    return () => {
      node.removeAttribute("aria-describedby");
      observer.disconnect();
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place, true);
    };
  }, [node, info?.name, info?.description]);

  return (
    info &&
    createPortal(
      <div ref={tooltip} id={tooltipId} class="perk-node-tooltip" role="tooltip" lang={language}>
        <strong>{info.name}</strong>
        <p>{info.description}</p>
      </div>,
      document.body,
    )
  );
}
