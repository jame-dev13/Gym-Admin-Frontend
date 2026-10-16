import { ArrowDown, ArrowUp } from "lucide-react";
import type { SortDirectionToggleProps } from "./SortTypes";
import type { SortDirection } from "@/types/Types";

const sizeClasses: Record<"sm" | "md", string> = {
  sm: "h-10 w-10 text-sm",
  md: "h-11 w-11 text-sm",
};

function nextDirection(current: SortDirection): SortDirection {
  return current === "asc" ? "desc" : "asc";
}

export function SortDirectionToggle({
  direction,
  onToggle,
  onChange,
  disabled = false,
  size = "sm",
  "aria-label": ariaLabel,
  className = "",
}: SortDirectionToggleProps) {
  const isAscending = direction === "asc";
  const Icon = isAscending ? ArrowUp : ArrowDown;
  const accessibleName =
    ariaLabel ??
    (isAscending
      ? "Sort direction: ascending, activate to sort descending"
      : "Sort direction: descending, activate to sort ascending");

  const handleClick = () => {
    if (disabled) {
      return;
    }
    onToggle?.();
    onChange?.(nextDirection(direction));
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      aria-label={accessibleName}
      title={accessibleName}
      className={`inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-surface-raised text-text-primary transition-colors duration-150 hover:border-accent hover:bg-surface-over hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 ${sizeClasses[size]} ${className}`}
    >
      <Icon size={18} aria-hidden="true" className="shrink-0" />
    </button>
  );
}
