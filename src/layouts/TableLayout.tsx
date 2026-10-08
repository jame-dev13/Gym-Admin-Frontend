import { useId } from "react";
import { CommandBtn } from "@/components/buttons/Buttons";
import { Dropdown } from "@/components/dropdown/Dropdown";
import { SearchInput } from "@/components/input/SearchInput";
import { Pagination } from "@/components/pagination/Pagination";
import { SortControls } from "@/components/sort/SortControls";
import { SortDirectionToggle } from "@/components/sort/SortDirectionToggle";
import { SortDropdown } from "@/components/sort/SortDropdown";
import { Table } from "@/components/table/Table";
import type { TableLayoutProps } from "@/components/table/TableTypes";
import type { DropdownOption, Identifiable } from "@/types/Types";

const DEFAULT_ACTIONS_LABEL = "Table actions";
const DEFAULT_LOADING_MESSAGE = "Loading table data…";

export function TableLayout<T extends Identifiable>({
  title,
  description,
  data,
  columns,
  caption,
  "aria-label": ariaLabel,
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
  actions = [],
  actionsLabel = DEFAULT_ACTIONS_LABEL,
  currentPage,
  totalPages,
  onPageChange,
  emptyMessage,
  isLoading = false,
  loadingMessage = DEFAULT_LOADING_MESSAGE,
  errorMessage = null,
  striped,
  size,
  responsive,
  cardTitleKey,
  stickyHeader,
  getRowKey,
  disabled = false,
  className = "",
}: TableLayoutProps<T>) {
  const titleId = useId();
  const hasActions = actions.length > 0;
  const hasSort = (sortOptions?.length ?? 0) > 0;
  const hasSecondRow = hasSort || isSearchable || hasActions;

  const hasPages = totalPages >= 1;

  const options: DropdownOption[] = actions.map((action) => ({
    value: action.id,
    label: action.label ?? "-",
    Icon: action.Icon,
    disabled: action.disabled,
  }));

  const selectAction = (id: string) => {
    const action = actions.find((candidate) => candidate.id === id);
    if (!action || action.disabled) {
      return;
    }
    action.onSelect();
  };

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
              <div className="flex flex-col gap-3 tab:ml-auto tab:flex-row tab:items-center">
                {hasActions && (
                  <div
                    role="group"
                    aria-label={actionsLabel}
                    className="hidden gap-2 tab:inline-flex"
                  >
                    {actions.map((action) => (
                      <CommandBtn
                        key={action.id}
                        Icon={action.Icon}
                        onClick={action.onSelect}
                        disabled={disabled || action.disabled}
                      >
                        {action.label}
                      </CommandBtn>
                    ))}
                  </div>
                )}
                {/* The Dropdown menu is absolutely positioned inside the scroll
                    container, so keep action lists short to avoid clipping. */}
                {hasActions && (
                  <Dropdown
                    options={options}
                    onSelect={selectAction}
                    trigger={<span className="truncate">{actionsLabel}</span>}
                    placement="bottom-end"
                    disabled={disabled}
                    className="w-full tab:hidden"
                  />
                )}
              </div>
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
            caption={caption}
            aria-label={ariaLabel}
            emptyMessage={emptyMessage}
            getRowKey={getRowKey}
            stickyHeader={stickyHeader}
            striped={striped}
            size={size}
            responsive={responsive}
            cardTitleKey={cardTitleKey}
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
