import type { ChangeEvent, FormEvent, ReactNode, InputHTMLAttributes } from "react";
import { type LucideIcon } from "lucide-react";
import type { Column, DropdownOption, Identifiable, SelectOption } from "@/types/Types";

type AvailableIcon = LucideIcon;

type InputHTMLProps = InputHTMLAttributes<HTMLInputElement>;

export interface InputBaseProps {
  labelText?: string;
  Icon?: AvailableIcon;
}

export type InputProps = InputBaseProps & InputHTMLProps;

export type TextInputProps = InputBaseProps &
  Pick<
    InputHTMLProps,
    | "aria-label"
    | "autoComplete"
    | "disabled"
    | "name"
    | "pattern"
    | "required"
    | "value"
    | "defaultValue"
  >;

export type EmailInputProps = InputBaseProps &
  Pick<
    InputHTMLProps,
    | "aria-label"
    | "autoComplete"
    | "disabled"
    | "name"
    | "pattern"
    | "required"
    | "value"
    | "defaultValue"
  >;

export interface OtpInputProps {
  length?: number;
  name?: string;
  autoComplete?: string;
  required?: boolean;
  disabled?: boolean;
  "aria-label"?: string;
  value?: string;
  onChange?: (value: string) => void;
  onComplete?: (value: string) => void;
}

export type DateInputProps = InputBaseProps &
  Pick<
    InputHTMLProps,
    | "aria-label"
    | "disabled"
    | "min"
    | "max"
    | "name"
    | "value"
    | "defaultValue"
  >;

export type PhoneInputProps = InputBaseProps &
  Pick<
    InputHTMLProps,
    | "aria-label"
    | "autoComplete"
    | "defaultValue"
    | "disabled"
    | "maxLength"
    | "name"
    | "onChange"
    | "pattern"
    | "required"
  > & {
    separator?: string;
  };

export type NumberInputProps = InputBaseProps &
  Pick<
    InputHTMLProps,
    | "id"
    | "name"
    | "value"
    | "defaultValue"
    | "min"
    | "max"
    | "step"
    | "required"
    | "disabled"
    | "readOnly"
    | "className"
    | "aria-label"
    | "aria-describedby"
    | "autoComplete"
    | "title"
    | "onChange"
  >;

export type SearchInputProps = InputBaseProps &
  Pick<
    InputHTMLProps,
    | "id"
    | "name"
    | "placeholder"
    | "autoComplete"
    | "disabled"
    | "required"
    | "readOnly"
    | "value"
    | "defaultValue"
    | "className"
    | "aria-label"
    | "aria-describedby"
    | "onChange"
    | "onKeyDown"
    | "onFocus"
    | "onBlur"
  > & {
    onSearch?: (value: string) => void;
    onClear?: () => void;
    searchLabel?: string;
  };

export type CheckboxInputProps = Pick<
  InputHTMLProps,
  | "id"
  | "name"
  | "checked"
  | "defaultChecked"
  | "disabled"
  | "required"
  | "value"
  | "className"
  | "aria-label"
  | "aria-describedby"
  | "onChange"
  | "onFocus"
  | "onBlur"
> & {
  label: string;
  description?: string;
  error?: string;
  indeterminate?: boolean;
};

export interface LinkToBaseProps {
  to: string;
  Icon?: AvailableIcon;
  className?: string;
  label?: string;
}

export type LinkToProps = Partial<LinkToBaseProps> & {
  "aria-label"?: string;
};

export interface NavLinkProps {
  section?: string;
  className?: string;
}

export type NavLinkToProps = Partial<LinkToBaseProps>;

export interface ButtonBaseProps {
  Icon?: AvailableIcon;
  onClick?: () => void;
  "aria-label"?: string;
  children: ReactNode;
  disabled?: boolean;
  className?: string;
}

export type SubmitBtnProps = Omit<ButtonBaseProps, "type"> & {
  type?: "submit";
};

export type CommandBtnProps = ButtonBaseProps & {
  type?: "button" | "reset";
};

export interface SocialAuthButtonsProps {
  label?: string;
}

export interface AuthCardProps {
  animationClassName?: string;
  "aria-labelledby"?: string;
  children?: ReactNode;
}

export interface AuthHeaderProps {
  title: string;
  subtitle?: string;
  aside?: ReactNode;
}

export type PillBtnProps = ButtonBaseProps & {
  type?: "button" | "reset";
};

export interface SwitchBtnProps {
  checked: boolean;
  onCheckedChange?: (next: boolean) => void;
  onClick?: () => void;
  OnIcon?: AvailableIcon;
  OffIcon?: AvailableIcon;
  label?: string;
  disabled?: boolean;
  size?: "sm" | "md";
  className?: string;
  "aria-label"?: string;
}

export interface RefreshBtnProps {
  onClick?: () => void;
  Icon?: AvailableIcon;
  cooldownMs?: number;
  showCountdown?: boolean;
  label?: string;
  children?: ReactNode;
  disabled?: boolean;
  className?: string;
  "aria-label"?: string;
}

export type PropsWithChildren = { children?: ReactNode };

export interface AppFormProps {
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  children: ReactNode;
  id?: string;
  className?: string;
}

export interface FieldsetProps {
  legend?: string;
  children: ReactNode;
}

export type ModalSize = "sm" | "md" | "lg";

export interface ModalProps {
  title: string;
  children: ReactNode;
  size?: ModalSize;
}

export type TableSize = "sm" | "md";

export type TableResponsive = "cards" | "scroll";

export type TableProps<T extends Identifiable> = {
  data: T[];
  columns: Column<T>[];
  caption?: string;
  "aria-label"?: string;
  emptyMessage?: string;
  getRowKey?: (row: T) => string | number;
  stickyHeader?: boolean;
  striped?: boolean;
  size?: TableSize;
  responsive?: TableResponsive;
  cardTitleKey?: keyof T;
  className?: string;
};

export type DropdownSize = "sm" | "md";

export type DropdownPlacement = "bottom-start" | "bottom-end";

export interface DropdownProps {
  options: DropdownOption[];
  value?: string;
  defaultValue?: string;
  onSelect?: (value: string) => void;
  label?: string;
  Icon?: AvailableIcon;
  trigger?: ReactNode;
  placeholder?: string;
  disabled?: boolean;
  size?: DropdownSize;
  placement?: DropdownPlacement;
  "aria-label"?: string;
  className?: string;
}

export interface SelectProps {
  options: SelectOption[];
  label: string;
  name?: string;
  id?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (event: ChangeEvent<HTMLSelectElement>) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  description?: string;
  error?: string;
  className?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
}
