import { useId } from "react";
import type { SortControlsProps } from "./SortTypes";

const DEFAULT_GROUP_LABEL = "Sort controls";

export function SortControls({
  label,
  "aria-label": ariaLabel,
  className = "",
  children,
}: SortControlsProps) {
  const labelId = useId();
  const groupName = ariaLabel ?? label ?? DEFAULT_GROUP_LABEL;

  return (
    <div
      role="group"
      aria-label={label ? undefined : groupName}
      aria-labelledby={label ? labelId : undefined}
      className={`inline-flex max-w-full flex-wrap items-center gap-2 ${className}`}
    >
      {label && (
        <span
          id={labelId}
          className="shrink-0 text-sm font-medium text-text-secondary"
        >
          {label}
        </span>
      )}
      {children}
    </div>
  );
}
