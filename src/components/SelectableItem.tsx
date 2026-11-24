import { memo } from "react";
import type { ReactNode } from "react";

type Sizes = "xs" | "sm" | "md" | "lg";

type SelectableItemProps<T> = {
  value: T;
  size?: Sizes;
  name: string;
  defaultChecked?: boolean;
  checked?: boolean;
  onChange?: (checked: boolean, value: T) => void;
  disabled?: boolean;
  className?: string;
  children?: ReactNode;
};

const baseClassName =
  "flex items-center justify-center rounded-lg border border-border-emphasis bg-surface-over/50 text-text-primary px-1 text-[10px] font-semibold uppercase tracking-widest select-none truncate transition-all duration-200 hover:border-accent/60 hover:bg-surface-over peer-checked:border-accent peer-checked:bg-accent/15 peer-checked:text-accent peer-checked:ring-2 peer-checked:ring-accent/60 peer-checked:scale-105 peer-focus-visible:ring-2 peer-focus-visible:ring-accent peer-disabled:pointer-events-none peer-disabled:cursor-not-allowed peer-disabled:opacity-40 peer-disabled:saturate-50 peer-disabled:hover:border-border-emphasis peer-disabled:hover:bg-surface-over/50";

const sizes: Record<Sizes, string> = {
  xs: "size-6 min-size-6 max-size-6",
  sm: "size-8 min-size-8 max-size-8",
  md: "size-10 min-size-10 max-size-10",
  lg: "size-12 min-size-12 max-size-12",
};

const SelectableItem = <T,>({
  value,
  size = "md",
  name,
  defaultChecked,
  checked,
  onChange,
  disabled,
  className,
  children,
}: SelectableItemProps<T>) => {
  return (
    <label className={`cursor-pointer ${disabled ? "cursor-not-allowed" : ""}`}>
      <input
        type="radio"
        className="peer sr-only"
        name={name}
        value={String(value)}
        defaultChecked={defaultChecked}
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.checked, value)}
      />
      <span className={`${baseClassName} ${sizes[size]} ${className ?? ""}`}>
        {children ?? String(value)}
      </span>
    </label>
  );
};

export default memo(SelectableItem) as typeof SelectableItem;
