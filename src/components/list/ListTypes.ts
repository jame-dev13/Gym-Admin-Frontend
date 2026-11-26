import type { ReactNode } from "react";
import type { RowAction, SortDirection, SortOption } from "@/types/Types";

export type ListGap = "sm" | "md" | "lg";

/**
 * Resolves the stable key of a list item. The list falls back to `id` when
 * the item has one and, as a last resort, to the item index.
 */
export type ListItemKey<T> = (item: T) => string | number;

/**
 * The list analogue of a table `Column<T>`.
 *
 * A table column describes one cell of a row; a list item describes the
 * whole row. That keeps the item free to own its layout, its metadata and
 * its actions (CRUD or otherwise) while the list only provides the scroll
 * container, spacing and keying.
 */
export type ListItem<T> = {
  render: (item: T, index: number) => ReactNode;
  className?: string | ((item: T) => string);
};

export type ListProps<T> = {
  data: T[];
  item: ListItem<T>;
  getItemKey?: ListItemKey<T>;
  emptyMessage?: string;
  "aria-label"?: string;
  gap?: ListGap;
  /**
   * When true (the default) the list owns the scroll container and scrolls
   * over both axes. Hosts such as `ListLayout` disable it because their body
   * already owns the scroll region.
   */
  scrollable?: boolean;
  className?: string;
};

export type ListOptions<T> = Omit<
  ListProps<T>,
  "data" | "item" | "scrollable"
>;

/**
 * The list analogue of `TableRowActionsProps`.
 *
 * Unlike table rows, list items do not need to be `Identifiable`: the caller
 * owns the item key through `ListProps.getItemKey`.
 */
export interface ListRowActionsProps<T> {
  row: T;
  actions: RowAction<T>[];
  "aria-label"?: string;
}

/**
 * Chrome around `List`: title, optional search/sort/refresh controls and
 * pagination. It mirrors `TableLayout` so both environments feel the same.
 */
export type ListLayoutProps<T> = {
  title: string;
  data: T[];
  item: ListItem<T>;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  onSearchSubmit?: (value: string) => void;
  searchPlaceholder?: string;
  isSearchable?: boolean;
  sortOptions?: ReadonlyArray<SortOption<string>>;
  sortBy?: string;
  sortDirection?: SortDirection;
  onSortByChange?: (value: string) => void;
  onSortDirectionChange?: (direction: SortDirection) => void;
  sortLabel?: string;
  controls?: ReactNode;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onRefetch?: () => void | Promise<void>;
  isRefetching?: boolean;
  isLoading?: boolean;
  loadingMessage?: string;
  errorMessage?: string | null;
  disabled?: boolean;
  className?: string;
  list?: ListOptions<T>;
};
