import { useId } from "react";
import { RefreshBtn } from "@/components/buttons/Buttons";
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
  onRefetch,
  isRefetching = false,
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
      className={`flex flex-col tab:h-full tab:min-h-0 h-full ${className}`}
    >
      <div
        data-testid="table-layout-card"
        className="flex min-h-0 flex-col rounded-2xl border border-border bg-surface-raised shadow-sm tab:flex-1 tab:overflow-hidden"
      >
        {/* Mobile caps the body to the viewport minus the compact layout
            chrome, so the card gets more content space while keeping the
            pagination footer visible. Desktop fills the available height. */}
        <div
          data-testid="table-layout-body"
          className="min-h-0 max-h-[calc(100dvh-5rem)] overflow-auto tab:max-h-none tab:flex-1 tab:overscroll-contain"
        >
          {/* Sticky inside the scroll container so controls stay reachable
              while the rows scroll underneath. Solid backing keeps the bar
              readable over sliding content. */}
          <div
            data-testid="table-layout-toolbar"
            className="sticky top-0 left-0 z-10 rounded-t-2xl border-b border-border bg-surface-raised/95 backdrop-blur-sm tab:rounded-none"
          >
            <div className="flex gap-3 px-4 py-4 sm:px-5 tab:items-start justify-between">
              <div className="min-w-0">
                <h2
                  id={titleId}
                  className="truncate text-lg font-semibold tracking-tight text-text-primary tab:text-xl"
                >
                  {title}
                </h2>
              </div>
              {(controls || onRefetch) && (
                <div
                  data-testid="table-layout-controls"
                  className="flex shrink-0 gap-2 tab:items-center"
                >
                  {controls}
                  {onRefetch && (
                    <div>
                      <RefreshBtn
                        onClick={() => {
                          void onRefetch();
                        }}
                        disabled={disabled || isRefetching}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
            {hasSecondRow && (
              <div className="flex flex-col gap-3 border-t border-border/60 bg-surface-over/30 px-4 py-3 sm:px-5 tab:flex-row tab:items-center tab:justify-between">
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
                      onChange={(event) =>
                        onSearchChange?.(event.currentTarget.value)
                      }
                      onSearch={(value) => onSearchSubmit?.(value)}
                      placeholder={searchPlaceholder}
                      disabled={disabled}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="table-layout-embed h-full">
            {errorMessage ? (
              <p
                role="alert"
                className="px-4 py-12 text-center text-sm text-text-secondary"
              >
                {errorMessage}
              </p>
            ) : isLoading && data.length === 0 ? (
              <p
                role="status"
                className="px-4 py-12 text-center text-sm text-text-secondary"
              >
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
        </div>
        {hasPages && (
          <div
            data-testid="table-layout-footer"
            className="flex shrink-0 flex-col gap-3 rounded-b-2xl border-t border-border bg-surface-over/20 p-2 tab:rounded-none tab:flex-row tab:items-center tab:justify-between"
          >
            <div className="flex justify-center tab:justify-end">
              <Pagination
                totalElements={totalPages}
                currentPage={currentPage}
                onPageChange={onPageChange}
                disabled={disabled}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
