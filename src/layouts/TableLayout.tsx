import { useId } from "react";
import { SearchInput } from "@/components/input/SearchInput";
import { Pagination } from "@/components/pagination/Pagination";
import { SortControls } from "@/components/sort/SortControls";
import { SortDirectionToggle } from "@/components/sort/SortDirectionToggle";
import { SortDropdown } from "@/components/sort/SortDropdown";
import { Table } from "@/components/table/Table";
import type { TableLayoutProps } from "@/components/table/TableTypes";
import type { Identifiable } from "@/types/Types";

const DEFAULT_LOADING_MESSAGE = "Loading table data…";

export function TableLayout<T extends Identifiable>({
  title,
  description,
  data,
  columns,
  searchValue,
  onSearchChange,
  onSearchSubmit,
  searchPlaceholder,
  isSearchable = true,
  sortOptions,
  sortBy,
  sortDirection = "asc",
  onSortByChange,
  onSortDirectionChange,
  sortLabel,
  controls,
  currentPage,
  totalPages,
  onPageChange,
  isLoading = false,
  loadingMessage = DEFAULT_LOADING_MESSAGE,
  errorMessage = null,
  disabled = false,
  className = "",
  table,
}: TableLayoutProps<T>) {
  const titleId = useId();
  const hasSort = (sortOptions?.length ?? 0) > 0;
  const hasSecondRow = hasSort || isSearchable;

  const hasPages = totalPages >= 1;

  return (
    <section
      aria-labelledby={titleId}
      aria-busy={isLoading || undefined}
      className={`flex flex-col gap-4 ${className}`}
    >
      <div
        data-testid="table-layout-body"
        className="overflow-auto overscroll-contain rounded-2xl bg-surface-raised shadow-sm max-h-160"
      >
        {/* Sticky inside the scroll container so controls stay reachable
            while the rows scroll underneath. Solid backing keeps the bar
            readable over sliding content. */}
        <div
          data-testid="table-layout-toolbar"
          className="sticky top-0 z-10 flex flex-col gap-4 border-b border-border bg-surface-raised p-4"
        >
          <div className="flex flex-col gap-3 tab:flex-row tab:items-end tab:justify-between">
            <div className="min-w-0">
              <h2
                id={titleId}
                className="truncate text-xl font-bold tracking-tight text-text-primary"
              >
                {title}
              </h2>
              {description && (
                <p className="mt-1 text-sm text-text-secondary">
                  {description}
                </p>
              )}
            </div>
            {controls !== undefined && (
              <div
                data-testid="table-layout-controls"
                className="flex shrink-0 flex-col gap-2 tab:flex-row tab:items-center"
              >
                {controls}
              </div>
            )}
          </div>
          {hasSecondRow && (
            <div className="flex flex-col gap-3 tab:flex-row tab:flex-wrap tab:items-center">
              {hasSort && (
                <SortControls
                  label={sortLabel}
                  className="min-w-0 flex-1 tab:flex-none"
                >
                  <SortDropdown
                    options={sortOptions ?? []}
                    value={sortBy}
                    onChange={(value) => onSortByChange?.(value)}
                    size="sm"
                    disabled={disabled}
                  />
                  <SortDirectionToggle
                    direction={sortDirection}
                    onChange={(next) => onSortDirectionChange?.(next)}
                    disabled={disabled}
                  />
                </SortControls>
              )}
              {isSearchable && (
                <div className="w-full tab:w-72 tab:shrink-0">
                  <SearchInput
                    value={searchValue}
                    onChange={(event) => onSearchChange?.(event.currentTarget.value)}
                    onSearch={(value) => onSearchSubmit?.(value)}
                    placeholder={searchPlaceholder}
                    disabled={disabled}
                  />
                </div>
              )}
            </div>
          )}
        </div>
        {errorMessage ? (
          <p role="alert" className="px-4 py-10 text-center text-sm text-text-secondary">
            {errorMessage}
          </p>
        ) : isLoading && data.length === 0 ? (
          <p role="status" className="px-4 py-10 text-center text-sm text-text-secondary">
            {loadingMessage}
          </p>
        ) : (
          <Table
            data={data}
            columns={columns}
            caption={table.caption}
            aria-label={table["aria-label"]}
            emptyMessage={table.emptyMessage}
            getRowKey={table.getRowKey}
            stickyHeader={table.stickyHeader}
            striped={table.striped}
            size={table.size}
            responsive={table.responsive}
            cardTitleKey={table.cardTitleKey}
            className={table.className}
          />
        )}
      </div>
      {hasPages && (
        <div className="flex justify-center pt-1 tab:justify-end">
          <Pagination
            totalElements={totalPages}
            currentPage={currentPage}
            onPageChange={onPageChange}
            disabled={disabled}
          />
        </div>
      )}
    </section>
  );
}
