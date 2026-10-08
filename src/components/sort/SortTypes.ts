import type { LucideIcon } from "lucide-react";
import type { SortDirection, SortOption } from "@/types/Types";
import type { DropdownSize, DropdownPlacement } from "@/components/dropdown/DropdownTypes";
import type { PropsWithChildren } from "@/components/form/FormTypes";

type AvailableIcon = LucideIcon;

export interface SortDropdownProps<T extends string = string> {
  options: ReadonlyArray<SortOption<T>>;
  value?: T;
  defaultValue?: T;
  onChange?: (value: T) => void;
  label?: string;
  Icon?: AvailableIcon;
  placeholder?: string;
  disabled?: boolean;
  size?: DropdownSize;
  placement?: DropdownPlacement;
  "aria-label"?: string;
  className?: string;
}

export interface SortDirectionToggleProps {
  direction: SortDirection;
  onToggle?: () => void;
  onChange?: (next: SortDirection) => void;
  disabled?: boolean;
  size?: DropdownSize;
  "aria-label"?: string;
  className?: string;
}

export interface SortControlsProps extends PropsWithChildren {
  label?: string;
  "aria-label"?: string;
  className?: string;
}