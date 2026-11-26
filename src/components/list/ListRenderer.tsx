import { ListLayout } from "@/layouts/ListLayout";
import type { ListRendererProps } from "@/components/list/listRendererConfig";
import { useTableRenderer } from "@/hooks/useTableRenderer";

const DEFAULT_LOADING_MESSAGE = "Loading list data…";
const DEFAULT_ERROR_MESSAGE = "The list data could not be loaded.";

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

export function ListRenderer<T>({ config }: ListRendererProps<T>) {
  const {
    usePage,
    item,
    title,
    listOptions = {},
    search = { enabled: false },
    sort,
    queryParamNames,
    extraParams,
    pageSize,
    controls,
    loadingMessage = DEFAULT_LOADING_MESSAGE,
    disabled = false,
  } = config;

  const isSortable = (sort?.properties.length ?? 0) > 0;

  // Search, sort and page state are identical for tables and lists; reuse
  // the shared page-renderer state machine instead of duplicating it.
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

  return (
    <ListLayout
      title={title}
      data={rows}
      item={item}
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
      list={listOptions}
    />
  );
}
