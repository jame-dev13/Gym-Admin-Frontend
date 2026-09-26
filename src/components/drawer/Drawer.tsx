import { X } from "lucide-react";
import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import type { DrawerProps } from "@/types/Props";
import type { DrawerPosition, DrawerSize } from "@/types/Types";
import "./Drawer.css";

const sideSizeClasses: Record<DrawerSize, string> = {
  sm: "w-72",
  md: "w-96",
  lg: "w-[32rem]",
};

const verticalSizeClasses: Record<DrawerSize, string> = {
  sm: "h-64",
  md: "h-96",
  lg: "h-[32rem]",
};

const positionClasses: Record<DrawerPosition, string> = {
  right: "right-0 top-0 h-full",
  left: "left-0 top-0 h-full",
  top: "top-0 inset-x-0 w-full",
  bottom: "bottom-0 inset-x-0 w-full",
};

const animationClasses: Record<DrawerPosition, string> = {
  right: "drawer-in-right",
  left: "drawer-in-left",
  top: "drawer-in-top",
  bottom: "drawer-in-bottom",
};

function isSidePosition(position: DrawerPosition): boolean {
  return position === "left" || position === "right";
}

export const Drawer = ({
  open,
  onClose,
  title,
  children,
  position = "right",
  size = "md",
  description,
  headerActions,
  footer,
  showCloseButton = true,
  closeOnOverlayClick = true,
  "aria-label": ariaLabel,
  className = "",
}: DrawerProps) => {
  const titleId = useId();
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const previouslyFocused = document.activeElement as HTMLElement | null;
    closeButtonRef.current?.focus();

    return () => {
      previouslyFocused?.focus?.();
    };
  }, [open]);

  if (!open) {
    return null;
  }

  const sizeClass = isSidePosition(position)
    ? sideSizeClasses[size]
    : verticalSizeClasses[size];

  return createPortal(
    <div
      data-testid="drawer-overlay"
      onClick={(event) => {
        if (closeOnOverlayClick && event.target === event.currentTarget) {
          onClose();
        }
      }}
      className="fixed inset-0 z-50 bg-black/60 animate-fade-in"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-label={ariaLabel}
        className={`fixed z-50 flex flex-col overflow-hidden bg-surface-raised text-text-primary shadow-xl ${positionClasses[position]} ${sizeClass} ${animationClasses[position]} ${className}`}
      >
        <div className="flex items-start justify-between gap-4 border-b border-border px-5 py-4">
          <div className="min-w-0">
            <h2 id={titleId} className="text-lg font-semibold">
              {title}
            </h2>
            {description ? (
              <p className="mt-1 text-sm text-text-secondary">{description}</p>
            ) : null}
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {headerActions}
            {showCloseButton ? (
              <button
                ref={closeButtonRef}
                type="button"
                aria-label="Close dialog"
                onClick={onClose}
                className="rounded-full p-1.5 text-text-secondary transition-colors hover:bg-surface-over hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                <X size={18} aria-hidden="true" />
              </button>
            ) : null}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>
        {footer ? (
          <div
            data-testid="drawer-footer"
            className="border-t border-border px-5 py-4"
          >
            {footer}
          </div>
        ) : null}
      </div>
    </div>,
    document.body,
  );
};
