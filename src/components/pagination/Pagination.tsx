import { ChevronLeft, ChevronRight } from "lucide-react";
import type { PaginationProps } from "./PaginationTypes";

const focusRing = [
  "focus-visible:outline-none",
  "focus-visible:ring-2",
  "focus-visible:ring-accent",
  "focus-visible:ring-offset-2",
  "focus-visible:ring-offset-surface",
].join(" ");

const stepStyles = [
  "inline-flex",
  "size-9",
  "shrink-0",
  "items-center",
  "justify-center",
  "rounded-lg",
  "border",
  "border-transparent",
  "text-text-secondary",
  "transition-all",
  "duration-200",
  "enabled:hover:border-border-emphasis",
  "enabled:hover:bg-surface-over",
  "enabled:hover:text-accent",
  "enabled:active:scale-95",
  "disabled:cursor-not-allowed",
  "disabled:opacity-35",
  focusRing,
].join(" ");

export const Pagination = ({
  totalElements,
  currentPage,
  onPageChange,
  disabled = false,
  "aria-label": ariaLabel = "Pagination",
  className = "",
}: PaginationProps) => {
  if (!Number.isInteger(totalElements) || totalElements < 1) {
    throw new Error("Pagination requires totalElements of at least 1");
  }
  if (
    !Number.isInteger(currentPage) ||
    currentPage < 1 ||
    currentPage > totalElements
  ) {
    throw new Error(
      "Pagination requires currentPage to be within 1 and totalElements",
    );
  }

  const goTo = (next: number) => {
    if (disabled || next === currentPage) {
      return;
    }
    onPageChange(next);
  };

  const step = (target: "previous" | "next") => {
    const atBound =
      target === "previous" ? currentPage === 1 : currentPage === totalElements;
    const Icon = target === "previous" ? ChevronLeft : ChevronRight;

    return (
      <button
        key={target}
        type="button"
        onClick={() => goTo(currentPage + (target === "previous" ? -1 : 1))}
        disabled={disabled || atBound}
        aria-label={`Go to ${target} page`}
        title={target === "previous" ? "Previous page" : "Next page"}
        className={stepStyles}
      >
        <Icon size={16} aria-hidden="true" />
      </button>
    );
  };

  return (
    <nav
      aria-label={ariaLabel}
      className={`inline-flex max-w-full items-center ${className}`}
    >
      <div className="inline-flex max-w-full items-center gap-1 rounded-xl border border-border bg-surface-over/40 p-1 shadow-sm">
        {step("previous")}
        <span
          aria-live="polite"
          className="mx-0.5 inline-flex min-w-28 shrink-0 items-baseline justify-center gap-1.5 whitespace-nowrap rounded-lg bg-surface-raised/70 px-2.5 py-1.5 tabular-nums"
        >
          <span
            aria-hidden="true"
            className="inline-flex items-baseline gap-1.5"
          >
            <span className="text-xs font-medium text-text-tertiary">Page</span>
            <span className="text-sm font-semibold text-text-primary">
              {currentPage}
            </span>
            <span className="text-xs text-text-tertiary">of</span>
            <span className="text-sm font-semibold text-text-secondary">
              {totalElements}
            </span>
          </span>
          <span className="sr-only">
            Page {currentPage} of {totalElements}
          </span>
        </span>
        {step("next")}
      </div>
    </nav>
  );
};
