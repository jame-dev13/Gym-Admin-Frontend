import type { ReactNode, Ref } from "react";
import type { LucideIcon } from "lucide-react";

type AvailableIcon = LucideIcon;

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

export interface BurgerBtnProps {
  open: boolean;
  controlsId: string;
  onToggle: () => void;
  buttonRef: Ref<HTMLButtonElement>;
}

export interface ThemeBtnProps {
  className?: string;
}