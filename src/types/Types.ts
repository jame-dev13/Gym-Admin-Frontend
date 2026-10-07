type ApiError = Partial<{
  timestamp?: string;
  status?: number;
  error?: string;
  message?: string;
  path?: string;
  code?: string;
}>;

export type ApiErrorResponse = Readonly<ApiError>;

export type FetchResponse<T> = {
  data: T;
  status: number;
};

export type MutationResponse<T> = {
  payload?: T;
  status: number;
};

export type Page<T> = Readonly<{
  content: T[],
  page: PageProperty
}>;

type PageProperty = Readonly<{
  size: number;
  number: number;
  totalElements: number;
  totalPages: number;
}>;

import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

export type Identifiable = { id: string | number | null };

export type ColumnAlign = "left" | "center" | "right";

export type DataColumn<T> = {
  kind?: "data";
  key: keyof T;
  header: string;
  align?: ColumnAlign;
  width?: string;
  emptyValue?: string;
  hideOnCards?: boolean;
  render?: (value: T[keyof T], row: T) => ReactNode;
};

export type RowAction<T> = {
  id: string;
  label: string;
  Icon?: LucideIcon;
  destructive?: boolean;
  disabled?: boolean | ((row: T) => boolean);
  hidden?: (row: T) => boolean;
  onSelect: (row: T) => void;
};

export type ActionColumn<T> = {
  kind: "action";
  key: string;
  header: string;
  align?: ColumnAlign;
  width?: string;
  hideOnCards?: boolean;
  renderActions: (row: T) => ReactNode;
};

export type Column<T> = DataColumn<T> | ActionColumn<T>;

export type DropdownOption = {
  value: string;
  label: string;
  description?: string;
  Icon?: LucideIcon;
  disabled?: boolean;
};

export type SortDirection = "asc" | "desc";

export type SortOption<T extends string = string> = {
  value: T;
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

export type DrawerPosition = "top" | "left" | "right" | "bottom";

export type DrawerSize = "sm" | "md" | "lg";

export type SidebarSection = {
  label?: string;
  links: NavbarLink[];
};

export type ChartDatum = Record<string, string | number>;

export type ChartSeries = {
  dataKey: string;
  name?: string;
  color?: string;
};

export type ChartTooltipVariant = "default" | "money" | "rate";

export type ChartLegendItem = {
  name: string;
  color: string;
};

export type ToastType = "success" | "error" | "warning" | "info" | "default";

export type ThemeMode = "dark" | "light";

export type ToastShowFn = (message: string) => void;

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

export interface ToastFactory {
  showSuccess: ToastShowFn;
  showError: ToastShowFn;
  showWarning: ToastShowFn;
  showInfo: ToastShowFn;
  showDefault: ToastShowFn;
}
