import { useId } from "react";
import { RefreshBtn } from "@/components/buttons/Buttons";
import { SearchInput } from "@/components/input/SearchInput";
import { Pagination } from "@/components/pagination/Pagination";
import { ListSkeleton } from "@/components/skeleton";
import { SortControls } from "@/components/sort/SortControls";
import { SortDirectionToggle } from "@/components/sort/SortDirectionToggle";
import { SortDropdown } from "@/components/sort/SortDropdown";
import { AuditLogListItem } from "@/features/audit/components/AuditLogListItem";
import { useAuditLogList } from "@/features/audit/hooks/useAuditLogList";
import { getAuditLogKey } from "@/features/audit/services/audit-log-normalizer";

const DEFAULT_ERROR_MESSAGE = "The audit logs could not be loaded.";

export type AuditLogListProps = {
  title?: string;
  className?: string;
};

export const AuditLogList = ({
  title = "Audit Logs",
  className = "",
}: AuditLogListProps) => {
  const titleId = useId();
  const {
    rows,
    error,
    isPending,
    isRefetching,
    doRefetch,
    search,
    sort,
    pagination,
  } = useAuditLogList();

  const errorMessage = error
    ? (error.message ?? DEFAULT_ERROR_MESSAGE)
    : null;
  const isInitialLoading = isPending && rows.length === 0;
  const canPaginate =
    pagination.totalPages > 0 &&
    pagination.currentPage <= pagination.totalPages;
  const currentPage = Math.max(
    1,
    Math.min(pagination.currentPage, pagination.totalPages),
  );

  return (
    <section
      aria-labelledby={titleId}
      aria-busy={isPending || isRefetching || undefined}
      className={`flex h-full min-h-0 flex-1 flex-col ${className}`}
    >
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-border bg-surface-raised shadow-sm">
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          <header className="sticky top-0 left-0 z-10 border-b border-border bg-surface-raised/95 backdrop-blur-sm">
            <div className="flex items-center justify-between gap-3 px-4 py-4 sm:px-5">
              <div className="min-w-0">
                <h2
                  id={titleId}
                  className="truncate text-lg font-semibold tracking-tight text-text-primary tab:text-xl"
                >
                  {title}
                </h2>
              </div>

              <RefreshBtn
                onClick={() => {
                  void doRefetch();
                }}
                disabled={isRefetching}
              />
            </div>

            <div className="flex flex-col gap-3 border-t border-border px-4 py-3 sm:px-5 tab:flex-row tab:items-center tab:justify-between">
              <SortControls label="Sort audit logs" className="min-w-0">
                <SortDropdown
                  options={sort.options}
                  value={sort.sortBy}
                  onChange={sort.onSortByChange}
                  disabled={isRefetching}
                  aria-label="Sort audit logs by"
                />
                <SortDirectionToggle
                  direction={sort.direction}
                  onChange={sort.onDirectionChange}
                  disabled={isRefetching}
                  aria-label={`Sort direction: ${sort.direction}`}
                />
              </SortControls>

              <div className="w-full min-w-0 tab:w-72 tab:shrink-0">
                <SearchInput
                  value={search.value}
                  onChange={(event) => search.onChange(event.currentTarget.value)}
                  onSearch={search.onSubmit}
                  placeholder="Search audit logs…"
                  disabled={isRefetching}
                />
              </div>
            </div>
          </header>

          <div className="p-3 sm:p-4">
            {errorMessage && (
              <p
                role="alert"
                className="mb-3 rounded-xl border border-danger bg-danger/10 px-4 py-3 text-sm text-text-primary"
              >
                {errorMessage}
              </p>
            )}

            {isInitialLoading ? (
              <ListSkeleton
                items={5}
                showAvatar={false}
                linesPerItem={2}
                aria-label="Loading audit logs"
              />
            ) : rows.length === 0 ? (
              errorMessage ? null : (
                <p
                  role="status"
                  className="rounded-xl border border-border bg-surface-over/20 px-4 py-10 text-center text-sm text-text-secondary"
                >
                  No audit logs found.
                </p>
              )
            ) : (
              <ul className="flex flex-col gap-3">
                {rows.map((log, index) => (
                  <AuditLogListItem
                    key={`${getAuditLogKey(log)}-${index}`}
                    data={log}
                  />
                ))}
              </ul>
            )}
          </div>
        </div>

        <footer className="flex shrink-0 flex-col gap-3 border-t border-border bg-surface-over/20 px-4 py-3 tab:flex-row tab:items-center tab:justify-between">
          <p className="text-center text-sm text-text-secondary tab:text-left">
            {pagination.totalElements}{" "}
            {pagination.totalElements === 1 ? "log" : "logs"} found
          </p>

          {canPaginate && (
            <div className="flex justify-center tab:justify-end">
              <Pagination
                totalElements={pagination.totalPages}
                currentPage={currentPage}
                onPageChange={pagination.onPageChange}
                disabled={isRefetching}
              />
            </div>
          )}
        </footer>
      </div>
    </section>
  );
};
