import { ArrowUpDown } from "lucide-react";
import { Dropdown } from "@/components/dropdown/Dropdown";
import type { SortDropdownProps } from "@/types/Props";
import type { DropdownOption } from "@/types/Types";

export function SortDropdown<T extends string>({
  options,
  value,
  defaultValue,
  onChange,
  label,
  Icon = ArrowUpDown,
  placeholder = "Sort by",
  disabled = false,
  size = "sm",
  placement = "bottom-start",
  "aria-label": ariaLabel,
  className = "",
}: SortDropdownProps<T>) {
  if (options.length === 0) {
    throw new Error("SortDropdown requires at least one option");
  }

  const dropdownOptions: DropdownOption[] = options.map((option) => ({
    value: option.value,
    label: option.label,
    description: option.description,
    Icon: option.Icon,
    disabled: option.disabled,
  }));

  return (
    <Dropdown
      options={dropdownOptions}
      value={value}
      defaultValue={defaultValue}
      onSelect={(selected) => onChange?.(selected as T)}
      label={label}
      Icon={Icon}
      placeholder={placeholder}
      disabled={disabled}
      size={size}
      placement={placement}
      aria-label={ariaLabel}
      className={className}
    />
  );
}
