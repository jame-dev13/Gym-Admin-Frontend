import type { ReactNode, InputHTMLAttributes } from "react";
import { type LucideIcon } from "lucide-react";

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

export type PropsWithChildren = { children?: ReactNode };
