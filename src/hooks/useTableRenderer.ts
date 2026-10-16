import type {
  PageQueryHook,
  SortableField,
  TableQueryParamNames,
} from "@/components/table/tableRendererConfig";
import type {
  ApiErrorResponse,
  Identifiable,
  SortDirection,
  SortOption,
} from "@/types/Types";
import { useCallback, useMemo, useState } from "react";

const DEFAULT_PAGE_SIZE = 10;

const DEFAULT_PARAM_NAMES: Required<TableQueryParamNames> = {
  page: "page",
  size: "size",
  search: "search",
  sort: "sort",
};

export type UseTableRendererArgs<T extends Identifiable> = {
  queryFn: PageQueryHook<T>;
  pageSize?: number;
  initialSearch?: string;
  sortProperties?: ReadonlyArray<SortableField<T>>;
  labels?: Partial<Record<SortableField<T>, string>>;
  initialSortBy?: SortableField<T>;
  initialDirection?: SortDirection;
  queryParamNames?: TableQueryParamNames;
  extraParams?: Record<string, unknown>;
};

export interface TableSearchControls {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (value: string) => void;
}

export interface TableSortControls {
  options: ReadonlyArray<SortOption<string>>;
  sortBy?: string;
  direction: SortDirection;
  onSortByChange: (value: string) => void;
  onDirectionChange: (direction: SortDirection) => void;
}

export interface TablePagination {
  /** 1-based page, ready for `Pagination`/`TableLayout`. */
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export interface UseTableRendererResult<T extends Identifiable> {
  rows: T[];
  error: ApiErrorResponse | null;
  isPending: boolean;
  isFetching: boolean;
  search: TableSearchControls;
  sort: TableSortControls;
  pagination: TablePagination;
}

function humanizeField(field: string): string {
  return field.charAt(0).toUpperCase() + field.slice(1);
}

type BuildParamsArgs = {
  page: number;
  pageSize: number;
  sort?: { field: string; direction: SortDirection };
  search?: string;
  paramNames?: TableQueryParamNames;
  extraParams?: Record<string, unknown>;
};

function buildParams({
  page,
  pageSize,
  sort,
  search,
  paramNames,
  extraParams,
}: BuildParamsArgs): Record<string, unknown> {
  const names = { ...DEFAULT_PARAM_NAMES, ...paramNames };
  const params: Record<string, unknown> = {
    [names.page]: page,
    [names.size]: pageSize,
  };

  if (sort) {
    params[names.sort] = `${sort.field},${sort.direction}`;
  }
  if (search) {
    params[names.search] = search;
  }

  return { ...params, ...extraParams };
}

export const useTableRenderer = <T extends Identifiable>({
  queryFn,
  pageSize = DEFAULT_PAGE_SIZE,
  initialSearch = "",
  sortProperties,
  labels,
  initialSortBy,
  initialDirection = "asc",
  queryParamNames,
  extraParams,
}: UseTableRendererArgs<T>): UseTableRendererResult<T> => {
  const [page, setPage] = useState(0);
  const [sortBy, setSortBy] = useState<string>();
  const [direction, setDirection] = useState<SortDirection>(initialDirection);
  const [isSortActivated, setIsSortActivated] = useState(false);
  const [searchValue, setSearchValue] = useState(initialSearch);
  const [committedSearch, setCommittedSearch] = useState(initialSearch);

  const defaultSortBy = initialSortBy ?? sortProperties?.[0];

  const sortOptions = useMemo<ReadonlyArray<SortOption<string>>>(
    () =>
      (sortProperties ?? []).map((property) => ({
        value: property,
        label: labels?.[property] ?? humanizeField(property),
      })),
    [sortProperties, labels],
  );

  const params = useMemo(
    () =>
      buildParams({
        page,
        pageSize,
        sort:
          isSortActivated && sortBy
            ? { field: sortBy, direction }
            : undefined,
        search: committedSearch.trim() !== "" ? committedSearch : undefined,
        paramNames: queryParamNames,
        extraParams,
      }),
    [
      page,
      pageSize,
      isSortActivated,
      sortBy,
      direction,
      committedSearch,
      queryParamNames,
      extraParams,
    ],
  );

  const { data, error, isPending, isFetching } = queryFn(params);
  const rows = data?.content ?? [];
  const pageInfo = data?.page;

  const handleSearchChange = useCallback((value: string) => {
    setSearchValue(value);
  }, []);

  const handleSearchSubmit = useCallback((value: string) => {
    setCommittedSearch(value);
    setPage(0);
  }, []);

  const handleSortByChange = useCallback(
    (value: string) => {
      if (!sortOptions.some((option) => option.value === value)) {
        throw new Error(
          `useTableRenderer received unknown sort value "${value}"`,
        );
      }
      setSortBy(value);
      setIsSortActivated(true);
      setPage(0);
    },
    [sortOptions],
  );

  const handleDirectionChange = useCallback(
    (next: SortDirection) => {
      setDirection(next);
      setIsSortActivated(true);
      setSortBy((current) => current ?? defaultSortBy);
      setPage(0);
    },
    [defaultSortBy],
  );

  const handlePageChange = useCallback((nextPage: number) => {
    setPage(nextPage - 1);
  }, []);

  return {
    rows,
    error,
    isPending,
    isFetching,
    search: {
      value: searchValue,
      onChange: handleSearchChange,
      onSubmit: handleSearchSubmit,
    },
    sort: {
      options: sortOptions,
      sortBy,
      direction,
      onSortByChange: handleSortByChange,
      onDirectionChange: handleDirectionChange,
    },
    pagination: {
      currentPage: page + 1,
      totalPages: pageInfo?.totalPages ?? 0,
      onPageChange: handlePageChange,
    },
  };
};
