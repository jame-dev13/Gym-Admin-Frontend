import type { LucideIcon } from "lucide-react";

export type DropdownOption = {
  value: string;
  label: string;
  description?: string;
  Icon?: LucideIcon;
  disabled?: boolean;
};

export type TableAction = {
  id: string;
  label?: string;
  Icon?: LucideIcon;
  disabled?: boolean;
  onSelect: () => void;
};

export type SelectOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

export type NavbarPosition = "static" | "sticky" | "fixed";

export type NavbarRouteLink = {
  to: string;
  href?: never;
  label: string;
  Icon?: LucideIcon;
};

export type NavbarAnchorLink = {
  href: string;
  to?: never;
  label: string;
  Icon?: LucideIcon;
};

export type NavbarLink = NavbarRouteLink | NavbarAnchorLink;

export type SidebarSection = {
  label?: string;
  links: NavbarLink[];
};

export type DrawerPosition = "top" | "left" | "right" | "bottom";

export type DrawerSize = "sm" | "md" | "lg";

export type AvatarSize = "sm" | "md" | "lg";

export type AvatarStatus = "online" | "busy" | "offline" | "none";

export type AvatarUser = {
  name: string;
  email: string;
  src?: string;
  status?: AvatarStatus;
};

export type AvatarMenuItem = {
  value: string;
  label: string;
  description?: string;
  Icon?: LucideIcon;
  destructive?: boolean;
  disabled?: boolean;
};