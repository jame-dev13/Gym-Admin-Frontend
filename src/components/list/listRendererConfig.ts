import type { UseQueryResult } from "@tanstack/react-query";
import type { ReactNode } from "react";
import type { ListGap, ListItem } from "./ListTypes";
import type { ApiErrorResponse, Page, SortDirection } from "@/types/Types";

/**
 * A React Query page hook, e.g. `useGetCommentPage`.
 *
 * The hook receives the fully-built Spring-style params
 * (`page` 0-based, `size`, `search`, `sort: "<field>,<asc|desc>"`)
 * and returns the matching `Page<T>`.
 */
export type ListPageQueryHook<T> = (
  params?: Record<string, unknown>,
) => UseQueryResult<Page<T>, ApiErrorResponse>;

/** String keys of `T` that can be sent as a `sort` field. */
export type ListSortableField<T> = Extract<keyof T, string> | string;

/** Backend query-param names. Defaults follow Spring Pageable conventions. */
export interface ListQueryParamNames {
  page?: string;
  size?: string;
  search?: string;
  sort?: string;
}

export interface ListRendererSearchConfig {
  enabled: boolean;
  placeholder?: string;
  initialValue?: string;
}

export interface ListRendererSortConfig<T> {
  properties: ReadonlyArray<ListSortableField<T>>;
  labels?: Partial<Record<ListSortableField<T>, string>>;
  initialSortBy?: ListSortableField<T>;
  initialDirection?: SortDirection;
}

/**
 * Options forwarded to the underlying `List`. The renderer intentionally
 * does not expose a `renderItem` here: the item definition is a top-level
 * config field so the concrete item keeps ownership of its actions.
 */
export interface ListRendererListConfig<T> {
  "aria-label"?: string;
  emptyMessage?: string;
  gap?: ListGap;
  getItemKey?: (item: T) => string | number;
  className?: string;
}

export interface ListRendererConfig<T> {
  usePage: ListPageQueryHook<T>;
  item: ListItem<T>;
  title: string;
  listOptions?: ListRendererListConfig<T>;
  search?: ListRendererSearchConfig;
  sort?: ListRendererSortConfig<T>;
  queryParamNames?: ListQueryParamNames;
  extraParams?: Record<string, unknown>;
  pageSize?: number;
  /**
   * Domain-specific header controls, e.g. `<UserControlTab />`.
   */
  controls?: ReactNode;
  loadingMessage?: string;
  disabled?: boolean;
}

export interface ListRendererProps<T> {
  config: ListRendererConfig<T>;
}
