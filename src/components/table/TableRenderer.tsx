import { useMemo, useState } from "react";
import { TableLayout } from "@/layouts/TableLayout";
import type {
  SortableField,
  TableRendererProps,
  TableRendererTableConfig,
} from "@/components/table/tableRendererConfig";
import type { TableOptions } from "@/components/table/TableTypes";
import type {
  Identifiable,
  SortDirection,
  SortOption,
} from "@/types/Types";

const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_LOADING_MESSAGE = "Loading table data…";
const DEFAULT_ERROR_MESSAGE = "The table data could not be loaded.";

const DEFAULT_PARAM_NAMES = {
  page: "page",
  size: "size",
  search: "search",
  sort: "sort",
} as const;

function humanizeField(field: string): string {
  return field.charAt(0).toUpperCase() + field.slice(1);
}

function toSortOptions<T extends Identifiable>(
  properties: ReadonlyArray<SortableField<T>>,
  labels?: Partial<Record<SortableField<T>, string>>,
): ReadonlyArray<SortOption<string>> {
  return properties.map((property) => ({
    value: property,
    label: labels?.[property] ?? humanizeField(property),
  }));
}

function toErrorMessage(error: unknown): string {
  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as { message?: unknown }).message === "string"
  ) {
    return (error as { message: string }).message;
  }
  return DEFAULT_ERROR_MESSAGE;
}

function toTableOptions<T extends Identifiable>(
  tableOptions: TableRendererTableConfig<T> | undefined
): TableOptions<T> {
  return {
    caption: tableOptions?.caption,
    "aria-label": tableOptions?.["aria-label"],
    emptyMessage: tableOptions?.emptyMessage,
    striped: tableOptions?.striped ?? false,
    size: tableOptions?.size ?? "md",
    responsive: tableOptions?.responsive ?? "cards",
    cardTitleKey: tableOptions?.cardTitleKey,
    stickyHeader: tableOptions?.stickyHeader ?? false,
    getRowKey: tableOptions?.getRowKey,
    className: tableOptions?.className,
  };
}

export function TableRenderer<T extends Identifiable>({
  config,
}: TableRendererProps<T>) {
  const {
    usePage,
    columns,
    title,
    description,
    tableOptions = {},
    search = { enabled: false },
    sort,
    queryParamNames = {},
    extraParams = {},
    pageSize = DEFAULT_PAGE_SIZE,
    controls,
    loadingMessage = DEFAULT_LOADING_MESSAGE,
    disabled = false,
  } = config;

  if (columns.length === 0) {
    throw new Error("TableRenderer requires at least one column");
  }

  const paramNames = useMemo(
    () => ({ ...DEFAULT_PARAM_NAMES, ...queryParamNames }),
    [queryParamNames],
  );
  const isSortable = (sort?.properties.length ?? 0) > 0;

  // UI-only state. Server state lives in React Query (`usePage`).
  // Pagination is 1-based here; the backend page is 0-based (Spring).
  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState(search.initialValue ?? "");
  const [committedSearch, setCommittedSearch] = useState(
    search.initialValue ?? "",
  );
  // Plain state pair instead of `useSortControls`: sort is optional and
  // TableRenderer needs no reset/validation beyond the closed dropdown.
  const [sortBy, setSortBy] = useState<string | undefined>(
    sort?.initialSortBy ?? sort?.properties[0],
  );
  const [direction, setDirection] = useState<SortDirection>(
    sort?.initialDirection ?? "asc",
  );

  const sortOptions = useMemo(
    () =>
      isSortable && sort
        ? toSortOptions(sort.properties, sort.labels)
        : undefined,
    [isSortable, sort],
  );

  const params = useMemo(
    () => ({
      [paramNames.page]: currentPage - 1,
      [paramNames.size]: pageSize,
      ...(committedSearch ? { [paramNames.search]: committedSearch } : {}),
      ...(isSortable && sortBy
        ? { [paramNames.sort]: `${sortBy},${direction}` }
        : {}),
      ...extraParams,
    }),
    [
      paramNames,
      currentPage,
      pageSize,
      committedSearch,
      isSortable,
      sortBy,
      direction,
      extraParams,
    ],
  );

  const query = usePage(params);
  const rows = query.data?.content ?? [];
  const totalPages = query.data?.page.totalPages ?? 0;

  const handleSearchSubmit = (value: string) => {
    setCommittedSearch(value);
    setCurrentPage(1);
  };

  const handleSortByChange = (value: string) => {
    setSortBy(value);
    setCurrentPage(1);
  };

  const handleDirectionChange = (next: SortDirection) => {
    setDirection(next);
    setCurrentPage(1);
  };

  const table = toTableOptions(tableOptions);

  return (
    <TableLayout<T>
      title={title}
      description={description}
      data={rows}
      columns={columns}
      searchValue={searchValue}
      onSearchChange={setSearchValue}
      onSearchSubmit={handleSearchSubmit}
      searchPlaceholder={search.placeholder}
      isSearchable={search.enabled}
      sortOptions={sortOptions}
      sortBy={isSortable ? sortBy : undefined}
      sortDirection={direction}
      onSortByChange={handleSortByChange}
      onSortDirectionChange={handleDirectionChange}
      controls={controls}
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={setCurrentPage}
      isLoading={query.isPending}
      loadingMessage={loadingMessage}
      errorMessage={query.isError ? toErrorMessage(query.error) : null}
      disabled={disabled}
      table={table}
    />
  );
}
