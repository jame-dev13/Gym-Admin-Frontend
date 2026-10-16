import { TableLayout } from "@/layouts/TableLayout";
import type {
  TableRendererProps,
  TableRendererTableConfig,
} from "@/components/table/tableRendererConfig";
import type { TableOptions } from "@/components/table/TableTypes";
import type { Identifiable } from "@/types/Types";
import { useTableRenderer } from "@/hooks/useTableRenderer";

const DEFAULT_LOADING_MESSAGE = "Loading table data…";
const DEFAULT_ERROR_MESSAGE = "The table data could not be loaded.";

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
    queryParamNames,
    extraParams,
    pageSize,
    controls,
    loadingMessage = DEFAULT_LOADING_MESSAGE,
    disabled = false,
  } = config;

  if (columns.length === 0) {
    throw new Error("TableRenderer requires at least one column");
  }

  const isSortable = (sort?.properties.length ?? 0) > 0;

  const {
    rows,
    error,
    isPending,
    isRefetching,
    doRefetch,
    search: searchState,
    sort: sortState,
    pagination,
  } = useTableRenderer<T>({
    queryFn: usePage,
    pageSize,
    initialSearch: search.initialValue,
    sortProperties: sort?.properties,
    labels: sort?.labels,
    initialSortBy: sort?.initialSortBy,
    initialDirection: sort?.initialDirection,
    queryParamNames,
    extraParams,
  });

  const table = toTableOptions(tableOptions);

  return (
    <TableLayout
      title={title}
      description={description}
      data={rows}
      columns={columns}
      searchValue={searchState.value}
      onSearchChange={searchState.onChange}
      onSearchSubmit={searchState.onSubmit}
      searchPlaceholder={search.placeholder}
      isSearchable={search.enabled}
      sortOptions={isSortable ? sortState.options : undefined}
      sortBy={sortState.sortBy}
      sortDirection={sortState.direction}
      onSortByChange={sortState.onSortByChange}
      onSortDirectionChange={sortState.onDirectionChange}
      controls={controls}
      currentPage={pagination.currentPage}
      totalPages={pagination.totalPages}
      onPageChange={pagination.onPageChange}
      onRefetch={doRefetch}
      isRefetching={isRefetching}
      isLoading={isPending}
      loadingMessage={loadingMessage}
      errorMessage={error ? toErrorMessage(error) : null}
      disabled={disabled}
      table={table}
    />
  );
}
