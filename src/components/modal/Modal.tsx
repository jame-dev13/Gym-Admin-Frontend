import { X } from "lucide-react";
import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import { useModalContext } from "@/context/useModalContext";
import type { ModalProps, ModalSize } from "./ModalTypes";

const sizeClasses: Record<ModalSize, string> = {
  sm: "max-w-sm",
  md: "max-w-lg",
  lg: "max-w-2xl",
};

export const Modal = ({
  title,
  children,
  size = "md",
  description,
  showCloseButton = true,
  closeOnOverlayClick = true,
}: ModalProps) => {
  const {
    isOpen,
    closeModal,
    title: contextTitle,
    description: contextDescription,
    size: contextSize,
    showCloseButton: contextShowCloseButton,
    closeOnOverlayClick: contextCloseOnOverlayClick,
  } = useModalContext();
  const titleId = useId();
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeModal();
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, closeModal]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previouslyFocused = document.activeElement as HTMLElement | null;
    closeButtonRef.current?.focus();

    return () => {
      previouslyFocused?.focus?.();
    };
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const mergedSize = size ?? contextSize ?? "md";
  const mergedDescription = description ?? contextDescription;
  const mergedShowCloseButton = showCloseButton ?? contextShowCloseButton;
  const mergedCloseOnOverlayClick = closeOnOverlayClick ?? contextCloseOnOverlayClick;

  return createPortal(
    <div
      data-testid="modal-overlay"
      onClick={(event) => {
        if (mergedCloseOnOverlayClick && event.target === event.currentTarget) {
          closeModal();
        }
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 animate-fade-in sm:p-4"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={`flex max-h-[calc(100dvh-1.5rem)] w-full ${sizeClasses[mergedSize]} flex-col overflow-hidden rounded-2xl border border-border bg-surface-raised text-text-primary shadow-2xl animate-fade-in-scale sm:max-h-[calc(100dvh-2rem)]`}
      >
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-border px-4 py-3.5 sm:gap-4 sm:px-5 sm:py-4">
          <div className="min-w-0">
            <h2 id={titleId} className="text-base font-semibold sm:text-lg">
              {title ?? contextTitle}
            </h2>
            {mergedDescription ? (
              <p className="mt-1 text-sm text-text-secondary">{mergedDescription}</p>
            ) : null}
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {mergedShowCloseButton ? (
              <button
                ref={closeButtonRef}
                type="button"
                aria-label="Close dialog"
                onClick={closeModal}
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
      </div>
    </div>,
    document.body,
  );
};