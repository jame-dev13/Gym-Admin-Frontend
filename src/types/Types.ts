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

export type Column<T> = {
  key: keyof T;
  header: string;
  align?: ColumnAlign;
  width?: string;
  emptyValue?: string;
  hideOnCards?: boolean;
  render?: (value: T[keyof T], row: T) => ReactNode;
};

export type DropdownOption = {
  value: string;
  label: string;
  description?: string;
  Icon?: LucideIcon;
  disabled?: boolean;
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
