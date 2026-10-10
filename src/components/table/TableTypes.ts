import type { Identifiable } from "@/types/Types";
import type { Column } from "@/types/Types";

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

export type TableOptions<T extends Identifiable> = Omit<
  TableProps<T>,
  "data" | "columns"
>;

export interface TableRowActionsProps<T> {
  row: T;
  actions: import("@/types/Types").RowAction<T>[];
  "aria-label"?: string;
}

export type TableLayoutProps<T extends Identifiable> = {
  title: string;
  description?: string;
  data: T[];
  columns: Column<T>[];
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  onSearchSubmit?: (value: string) => void;
  searchPlaceholder?: string;
  isSearchable?: boolean;
  sortOptions?: ReadonlyArray<import("@/types/Types").SortOption<string>>;
  sortBy?: string;
  sortDirection?: import("@/types/Types").SortDirection;
  onSortByChange?: (value: string) => void;
  onSortDirectionChange?: (direction: import("@/types/Types").SortDirection) => void;
  sortLabel?: string;
  controls?: React.ReactNode;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
  loadingMessage?: string;
  errorMessage?: string | null;
  disabled?: boolean;
  className?: string;
  table: TableOptions<T>;
};