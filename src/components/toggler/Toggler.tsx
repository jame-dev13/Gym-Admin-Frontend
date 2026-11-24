import { memo, type ReactNode } from "react";

type ToggleRowProps = {
  label: string;
  hint?: string;
  checked?: boolean;
  onToggle?: () => void;
  control?: ReactNode;
  disabled?: boolean;
  className?: string;
};

export const Toggler = memo(({
  label,
  hint,
  checked,
  onToggle,
  control,
  disabled,
  className,
}: ToggleRowProps) => (
  <div
    className={`flex items-center justify-between gap-4 border-b border-border-emphasis/50 py-3 last:border-0 ${className ?? ""}`}
  >
    <div className="flex flex-col gap-0.5">
      <span className="text-sm font-medium text-text-primary">{label}</span>
      {hint && <span className="text-xs text-text-tertiary">{hint}</span>}
    </div>
    {control ?? (
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={onToggle}
        disabled={disabled}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none ${
          checked ? "bg-accent" : "bg-surface-over"
        } ${disabled ? "cursor-not-allowed opacity-40" : ""}`}
        aria-label={label}
      >
        <span
          className={`absolute top-0.5 left-0.5 size-5 rounded-full bg-white shadow transition-transform duration-200 ${
            checked ? "translate-x-5" : ""
          }`}
        />
      </button>
    )}
  </div>
));