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
  "rounded-full",
  "text-text-secondary",
  "transition-colors",
  "duration-200",
  "hover:bg-surface-over",
  "hover:text-text-primary",
  "disabled:cursor-not-allowed",
  "disabled:opacity-40",
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
        className={stepStyles}
      >
        <Icon size={16} aria-hidden="true" />
      </button>
    );
  };

  return (
    <nav aria-label={ariaLabel} className={`inline-flex items-center ${className}`}>
      <div className="inline-flex max-w-full items-center gap-1 rounded-full border border-border bg-surface-raised p-1">
        {step("previous")}
        <span
          aria-live="polite"
          className="min-w-16 shrink-0 px-2 text-center text-sm whitespace-nowrap tabular-nums text-text-secondary"
        >
          <span aria-hidden="true">
            {currentPage} / {totalElements}
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
