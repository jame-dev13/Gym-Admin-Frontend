import type { FC } from "react";
import "./Skeleton.css";

export interface PageSkeletonProps {
  showSidebar?: boolean;
  showNavbar?: boolean;
  showFooter?: boolean;
  contentSections?: number;
  "aria-label"?: string;
  className?: string;
}

const DEFAULT_CONTENT_SECTIONS = 3;

export const PageSkeleton: FC<PageSkeletonProps> = ({
  showSidebar = true,
  showNavbar = true,
  showFooter = true,
  contentSections = DEFAULT_CONTENT_SECTIONS,
  "aria-label": ariaLabel = "Page loading skeleton",
  className = "",
}) => {
  return (
    <div
      role="status"
      aria-label={ariaLabel}
      aria-busy="true"
      className={`flex min-h-screen flex-col bg-surface text-text-primary ${className}`}
    >
      {showNavbar && (
        <header className="border-b border-border bg-surface sticky top-0 z-40">
          <div className="flex items-center justify-between gap-4 px-4 py-3">
            <div className="flex min-w-0 items-center gap-2">
              <div className="skeleton-pulse skeleton-avatar size-9" aria-hidden="true" />
              <div className="skeleton-pulse skeleton-text skeleton-text-xl w-48" aria-hidden="true" />
            </div>
            <div className="hidden items-center gap-1 tab:flex">
              <div className="skeleton-pulse skeleton-text skeleton-text-sm w-24 px-3 py-2" aria-hidden="true" />
              <div className="skeleton-pulse skeleton-text skeleton-text-sm w-24 px-3 py-2" aria-hidden="true" />
              <div className="skeleton-pulse skeleton-text skeleton-text-sm w-24 px-3 py-2" aria-hidden="true" />
            </div>
            <div className="skeleton-pulse skeleton-button w-10 h-10 rounded-full tab:hidden" aria-hidden="true" />
          </div>
        </header>
      )}

      <div className="flex flex-1 flex-col tab:flex-row">
        {showSidebar && (
          <aside
            className="sticky top-0 z-40 flex w-full flex-col border-b border-border bg-surface-raised tab:h-screen tab:border-b-0 tab:border-r tab:transition-[width] tab:duration-200 tab:w-64 shrink-0"
            aria-hidden="true"
          >
            <div className="flex w-full shrink-0 flex-row items-center justify-between px-4 py-3 tab:w-auto tab:justify-start tab:border-b tab:border-border tab:py-4">
              <div className="skeleton-pulse skeleton-avatar size-9" aria-hidden="true" />
            </div>
            <nav aria-label="Sidebar navigation skeleton" className="min-w-0 flex-1 flex-row items-center gap-4 overflow-x-auto px-3 py-2 tab:min-h-0 tab:flex-col tab:items-stretch tab:gap-5 tab:overflow-x-visible tab:overflow-y-auto tab:py-4">
              <div className="flex flex-col gap-2 w-full">
                <div className="skeleton-pulse skeleton-text skeleton-text-xs w-1/4 px-3 py-1 uppercase tracking-wider" aria-hidden="true" />
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="skeleton-pulse skeleton-text skeleton-text-sm w-full px-3 py-2 rounded-lg" aria-hidden="true" />
                ))}
                <div className="skeleton-pulse skeleton-text skeleton-text-xs w-1/3 px-3 py-1 uppercase tracking-wider mt-4" aria-hidden="true" />
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="skeleton-pulse skeleton-text skeleton-text-sm w-full px-3 py-2 rounded-lg" aria-hidden="true" />
                ))}
              </div>
            </nav>
            <div className="hidden shrink-0 flex-col gap-2 px-3 py-4 tab:flex">
              <div className="skeleton-pulse skeleton-text skeleton-text-sm w-1/2 px-1" aria-hidden="true" />
              <div className="skeleton-pulse skeleton-button w-full justify-center px-0" aria-hidden="true" />
            </div>
          </aside>
        )}

        <div className="flex min-w-0 flex-1 flex-col">
          <main className="flex-1 px-4 py-6 tab:px-8">
            <div className="space-y-6" role="list" aria-label="Main content sections">
              {[...Array(contentSections)].map((_, index) => (
                <section key={index} className="skeleton-pulse skeleton-card p-6" role="listitem" aria-hidden="true">
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <div className="skeleton-pulse skeleton-text skeleton-text-xl w-1/3" aria-hidden="true" />
                    <div className="skeleton-pulse skeleton-button w-24 h-10" aria-hidden="true" />
                  </div>
                  <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="skeleton-pulse skeleton-text w-full" style={{ height: "1rem" }} aria-hidden="true" />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </main>

          {showFooter && (
            <footer className="border-t border-border bg-surface-raised px-4 py-3 tab:px-8" aria-hidden="true">
              <div className="flex items-center justify-between gap-4">
                <div className="skeleton-pulse skeleton-text skeleton-text-sm w-48" aria-hidden="true" />
                <div className="flex gap-2">
                  <div className="skeleton-pulse skeleton-button w-20 h-8" aria-hidden="true" />
                  <div className="skeleton-pulse skeleton-button w-20 h-8" aria-hidden="true" />
                </div>
              </div>
            </footer>
          )}
        </div>
      </div>
    </div>
  );
};