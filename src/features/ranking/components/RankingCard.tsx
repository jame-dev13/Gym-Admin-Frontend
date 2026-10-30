import { RefreshBtn } from "@/components/buttons/Buttons";
import { useId } from "react";
import type { RankingCardProps } from "./RankingCardTypes";

const SKELETON_ROWS = 4;

const RankingCardSkeleton = () => (
  <div role="status" aria-label="Loading ranking" className="space-y-1">
    {Array.from({ length: SKELETON_ROWS }, (_, index) => (
      <div
        key={index}
        aria-hidden="true"
        className="flex animate-pulse items-center gap-3 px-1 py-3"
      >
        <div className="size-9 shrink-0 rounded-full bg-surface-over" />
        <div className="min-w-0 flex-1 space-y-2">
          <div className="h-3.5 w-1/2 rounded bg-surface-over" />
          <div className="h-3 w-1/3 rounded bg-surface-over" />
        </div>
        <div className="h-4 w-10 shrink-0 rounded bg-surface-over" />
      </div>
    ))}
  </div>
);

/**
 * Generic ranking card shell. Concrete cards provide the domain data and the
 * row renderer through `RankingCardProps<T>`.
 */
export function RankingCard<T>({
  title,
  description,
  Icon,
  items,
  getItemKey,
  renderItem,
  headerControls,
  isLoading = false,
  isRefetching = false,
  errorMessage = null,
  emptyMessage = "No ranking data available.",
  onRefetch,
  className = "",
}: RankingCardProps<T>) {
  const titleId = useId();
  const isBusy = isLoading || isRefetching;
  const hasItems = items.length > 0;

  return (
    <section
      aria-labelledby={titleId}
      aria-busy={isBusy || undefined}
      className={[
        "flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface-raised shadow-sm",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <header className="border-b border-border px-4 py-4 sm:px-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-3">
            {Icon && (
              <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl border border-accent/30 bg-accent/10 text-accent">
                <Icon size={20} aria-hidden="true" />
              </span>
            )}
            <div className="min-w-0">
              <h2
                id={titleId}
                className="truncate text-lg font-semibold tracking-tight text-text-primary"
              >
                {title}
              </h2>
              <p className="mt-0.5 text-sm leading-relaxed text-text-secondary">
                {description}
              </p>
            </div>
          </div>

          {onRefetch && (
            <RefreshBtn
              label={`Refresh ${title.toLowerCase()}`}
              onClick={onRefetch}
              disabled={isBusy}
              cooldownMs={10_000}
            />
          )}
        </div>

        {headerControls && (
          <div className="mt-3 border-t border-border/60 pt-3">
            {headerControls}
          </div>
        )}
      </header>

      <div className="flex-1 p-3 sm:p-4">
        {errorMessage ? (
          <p
            role="alert"
            className="rounded-xl border border-danger/30 bg-danger/10 px-4 py-8 text-center text-sm text-danger"
          >
            {errorMessage}
          </p>
        ) : isLoading && !hasItems ? (
          <RankingCardSkeleton />
        ) : !hasItems ? (
          <p
            role="status"
            className="px-4 py-10 text-center text-sm text-text-secondary"
          >
            {emptyMessage}
          </p>
        ) : (
          <ol className="divide-y divide-border/70">
            {items.map((item) => (
              <li key={getItemKey(item)} className="py-3 first:pt-1 last:pb-1">
                {renderItem(item)}
              </li>
            ))}
          </ol>
        )}
      </div>
    </section>
  );
}
