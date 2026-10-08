import type { UseQueryResult } from "@tanstack/react-query";
import type { ReactNode } from "react";
import type { TableResponsive, TableSize } from "./TableTypes";
import type {
  ApiErrorResponse,
  Column,
  Identifiable,
  Page,
  SortDirection,
} from "@/types/Types";
import type { TableAction } from "@/types/SharedTypes";

/**
 * A React Query page hook, e.g. `useGetUserPage`.
 *
 * The hook receives the fully-built Spring-style params
 * (`page` 0-based, `size`, `search`, `sort: "<field>,<asc|desc>"`)
 * and returns the matching `Page<T>`.
 */
export type PageQueryHook<T extends Identifiable> = (
  params?: Record<string, unknown>,
) => UseQueryResult<Page<T>, ApiErrorResponse>;

/** String keys of `T` that can be sent as a `sort` field. */
export type SortableField<T> = Extract<keyof T, string>;

/** Backend query-param names. Defaults follow Spring Pageable conventions. */
export interface TableQueryParamNames {
  page?: string;
  size?: string;
  search?: string;
  sort?: string;
}

export interface TableRendererSearchConfig {
  enabled: boolean;
  placeholder?: string;
  initialValue?: string;
}

export interface TableRendererSortConfig<T extends Identifiable> {
  properties: ReadonlyArray<SortableField<T>>;
  labels?: Partial<Record<SortableField<T>, string>>;
  initialSortBy?: SortableField<T>;
  initialDirection?: SortDirection;
}

export interface TableRendererTableConfig<T extends Identifiable> {
  caption?: string;
  "aria-label"?: string;
  emptyMessage?: string;
  striped?: boolean;
  size?: TableSize;
  responsive?: TableResponsive;
  cardTitleKey?: keyof T;
  stickyHeader?: boolean;
  getRowKey?: (row: T) => string | number;
  className?: string;
}

export interface TableRendererConfig<T extends Identifiable> {
  usePage: PageQueryHook<T>;
  columns: Column<T>[];
  title: string;
  description?: string;
  table?: TableRendererTableConfig<T>;
  search?: TableRendererSearchConfig;
  sort?: TableRendererSortConfig<T>;
  queryParamNames?: TableQueryParamNames;
  extraParams?: Record<string, unknown>;
  pageSize?: number;
  /**
   * Domain-specific header controls, e.g. `<UserControlTab />`.
   * A plain node is enough: controls that need table state
   * can be lifted into a render prop later (YAGNI for now).
   */
  controls?: ReactNode;
  actions?: TableAction[];
  actionsLabel?: string;
  loadingMessage?: string;
  disabled?: boolean;
}

export interface TableRendererProps<T extends Identifiable> {
  config: TableRendererConfig<T>;
}
