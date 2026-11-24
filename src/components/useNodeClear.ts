import { useLayoutEffect, useRef } from "preact/hooks";

// Native touch clicks and contextmenu can follow the same press. Handle each gesture once.
export function useNodeClear(wireId: number | undefined, onClear?: () => void) {
  const stopHolding = useRef<(() => void) | undefined>(undefined);
  const suppressClick = useRef(false);
  const clear = useRef(onClear);
  clear.current = onClear;

  useLayoutEffect(() => () => stopHolding.current?.(), [wireId]);

  function onPointerDown(event: PointerEvent) {
    if (!event.isPrimary) return;
    stopHolding.current?.();
    suppressClick.current = false;
    if (event.button !== 0 || (event.pointerType !== "touch" && event.pointerType !== "pen"))
      return;
    const { pointerId, clientX, clientY } = event;
    const timer = window.setTimeout(() => {
      cancelPress();
      clear.current?.();
    }, 500);
    function stop() {
      window.clearTimeout(timer);
      window.removeEventListener("pointermove", moved, true);
      window.removeEventListener("pointerup", ended, true);
      window.removeEventListener("pointercancel", cancelPress, true);
      window.removeEventListener("pointerdown", interrupt, true);
      window.removeEventListener("scroll", cancelPress, true);
      window.removeEventListener("blur", cancelPress);
      stopHolding.current = undefined;
    }
    function cancelPress() {
      suppressClick.current = true;
      stop();
    }
    function moved(next: PointerEvent) {
      if (
        next.pointerId === pointerId &&
        Math.hypot(next.clientX - clientX, next.clientY - clientY) > 9
      )
        cancelPress();
    }
    function ended(next: PointerEvent) {
      if (next.pointerId === pointerId) stop();
    }
    function interrupt(next: PointerEvent) {
      if (next.pointerId !== pointerId) cancelPress();
    }
    stopHolding.current = stop;
    window.addEventListener("pointermove", moved, true);
    window.addEventListener("pointerup", ended, true);
    window.addEventListener("pointercancel", cancelPress, true);
    window.addEventListener("pointerdown", interrupt, true);
    window.addEventListener("scroll", cancelPress, true);
    window.addEventListener("blur", cancelPress);
  }

  function onContextMenu(event: MouseEvent) {
    event.preventDefault();
    if (
      suppressClick.current ||
      stopHolding.current ||
      ("pointerType" in event && (event.pointerType === "touch" || event.pointerType === "pen"))
    )
      return;
    clear.current?.();
  }

  function onKeyDown(event: KeyboardEvent) {
    suppressClick.current = false;
    if (event.key !== "Delete" && event.key !== "Backspace") return;
    event.preventDefault();
    if (!event.repeat) clear.current?.();
  }

  function consumeClick() {
    return suppressClick.current;
  }

  return { onPointerDown, onContextMenu, onKeyDown, consumeClick };
}
