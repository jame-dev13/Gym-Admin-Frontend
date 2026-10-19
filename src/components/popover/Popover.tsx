import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { usePopoverPosition } from "@/hooks/usePopoverPosition";
import type { PopoverProps } from "./PopoverTypes";

export const Popover = ({
  anchor,
  children,
  onClose,
  label,
  className = "",
}: PopoverProps) => {
  const [panel, setPanel] = useState<HTMLDivElement | null>(null);
  const coordinates = usePopoverPosition(anchor, panel);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") {
        return;
      }
      event.preventDefault();
      onClose();
      if (anchor.isConnected) {
        anchor.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => document.removeEventListener("keydown", onKeyDown);
  }, [anchor, onClose]);

  useEffect(() => {
    if (!panel) {
      return;
    }

    panel.focus();

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (panel.contains(target) || anchor.contains(target)) {
        return;
      }
      onClose();
    };

    document.addEventListener("pointerdown", onPointerDown);

    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [anchor, panel, onClose]);

  return createPortal(
    <div
      ref={setPanel}
      role="dialog"
      aria-label={label}
      tabIndex={-1}
      data-placement={coordinates?.placement ?? "below"}
      style={{
        position: "fixed",
        top: coordinates?.top ?? 0,
        left: coordinates?.left ?? 0,
        visibility: coordinates ? "visible" : "hidden",
      }}
      className={`z-50 w-72 max-w-[calc(100vw-2rem)] overflow-y-auto overscroll-contain rounded-2xl border border-border bg-surface-raised p-4 text-sm text-text-primary shadow-xl animate-fade-in-scale focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${className}`}
    >
      {children}
    </div>,
    document.body,
  );
};
