import type { ComponentChildren, TargetedMouseEvent } from "preact";
import { useId, useLayoutEffect, useRef } from "preact/hooks";
import { useTranslation } from "react-i18next";
import { Icon } from "./Icon";

interface DrawerProps {
  readonly open: boolean;
  readonly onClose: () => void;
  readonly title: string;
  readonly children: ComponentChildren;
}

function isBackdrop(event: TargetedMouseEvent<HTMLDialogElement>): boolean {
  if (event.target !== event.currentTarget) return false;
  const bounds = event.currentTarget.getBoundingClientRect();
  return (
    event.clientX < bounds.left ||
    event.clientX > bounds.right ||
    event.clientY < bounds.top ||
    event.clientY > bounds.bottom
  );
}

/** 原生模态对话框提供焦点约束，抽屉位置由样式控制。 */
export function Drawer({ open, onClose, title, children }: DrawerProps) {
  const { t } = useTranslation();
  const titleId = useId();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const backdropPointer = useRef(false);

  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    if (!open || !dialog) return;

    const previousFocus = document.activeElement;
    const root = document.documentElement;
    const rootOverflow = root.style.overflow;
    const bodyOverflow = document.body.style.overflow;
    dialog.showModal();
    root.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    return () => {
      dialog.close();
      root.style.overflow = rootOverflow;
      document.body.style.overflow = bodyOverflow;
      backdropPointer.current = false;
      // 跨断点卸载时触发按钮可能已隐藏，此时不把焦点送回隐藏元素。
      if (
        previousFocus instanceof HTMLElement &&
        previousFocus.isConnected &&
        previousFocus.getClientRects().length > 0
      ) {
        previousFocus.focus({ preventScroll: true });
      }
    };
  }, [open]);

  return (
    <dialog
      class="drawer"
      ref={dialogRef}
      aria-labelledby={titleId}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClose={(event) => {
        if (open && !event.currentTarget.open) onClose();
      }}
      onPointerDown={(event) => {
        backdropPointer.current = isBackdrop(event);
      }}
      onClick={(event) => {
        const shouldClose = backdropPointer.current && isBackdrop(event);
        backdropPointer.current = false;
        if (shouldClose) onClose();
      }}
    >
      <header class="drawer-heading">
        <h2 id={titleId}>{title}</h2>
        <button type="button" aria-label={t("common.close")} onClick={onClose} autoFocus>
          <Icon name="x" />
        </button>
      </header>
      <div class="drawer-body">{children}</div>
    </dialog>
  );
}
