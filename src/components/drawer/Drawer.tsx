import { X } from "lucide-react";
import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import type { DrawerProps } from "./DrawerTypes";
import type { DrawerPosition, DrawerSize } from "@/types/SharedTypes";
import "./Drawer.css";

const sideSizeClasses: Record<DrawerSize, string> = {
  sm: "w-72 max-w-[92vw]",
  md: "w-96 max-w-[92vw]",
  lg: "w-[32rem] max-w-[92vw]",
};

const verticalSizeClasses: Record<DrawerSize, string> = {
  sm: "h-64 max-h-[85vh]",
  md: "h-96 max-h-[85vh]",
  lg: "h-[32rem] max-h-[85vh]",
};

const positionClasses: Record<DrawerPosition, string> = {
  right: "right-0 top-0 h-full rounded-l-2xl",
  left: "left-0 top-0 h-full rounded-r-2xl",
  top: "top-0 inset-x-0 w-full rounded-b-2xl",
  bottom: "bottom-0 inset-x-0 w-full rounded-t-2xl",
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
        className={`fixed z-50 flex flex-col overflow-hidden bg-surface-raised text-text-primary shadow-2xl ${positionClasses[position]} ${sizeClass} ${animationClasses[position]} ${className}`}
      >
        <div className="flex items-start justify-between gap-3 border-b border-border px-4 py-3.5 sm:gap-4 sm:px-5 sm:py-4">
          <div className="min-w-0">
            <h2 id={titleId} className="text-base font-semibold sm:text-lg">
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
        <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-4 sm:px-5">
          {children}
        </div>
        {footer ? (
          <div
            data-testid="drawer-footer"
            className="border-t border-border px-4 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-5"
          >
            {footer}
          </div>
        ) : null}
      </div>
    </div>,
    document.body,
  );
};
