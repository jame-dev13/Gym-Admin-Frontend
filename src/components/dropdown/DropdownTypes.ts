import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import type { DropdownOption } from "@/types/SharedTypes";

export type DropdownSize = "sm" | "md";

export type DropdownPlacement = "bottom-start" | "bottom-end";

export type AvatarMenuPlacement = DropdownPlacement | "auto";

export interface DropdownProps {
  options: DropdownOption[];
  value?: string;
  defaultValue?: string;
  onSelect?: (value: string) => void;
  label?: string;
  Icon?: LucideIcon;
  trigger?: ReactNode;
  placeholder?: string;
  disabled?: boolean;
  size?: DropdownSize;
  placement?: DropdownPlacement;
  "aria-label"?: string;
  className?: string;
}