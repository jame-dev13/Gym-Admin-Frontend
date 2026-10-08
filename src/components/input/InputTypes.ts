import type { ChangeEvent, InputHTMLAttributes } from "react";
import type { LucideIcon } from "lucide-react";

type AvailableIcon = LucideIcon;
type InputHTMLProps = InputHTMLAttributes<HTMLInputElement>;

export interface InputBaseProps {
  labelText?: string;
  Icon?: AvailableIcon;
  error?: string;
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
    | "readOnly"
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

export interface SelectProps {
  options: import("@/types/SharedTypes").SelectOption[];
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