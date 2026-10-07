import type { FC } from "react";
import "./Skeleton.css";

export interface ListSkeletonProps {
  items?: number;
  showAvatar?: boolean;
  linesPerItem?: number;
  "aria-label"?: string;
  className?: string;
}

const DEFAULT_ITEMS = 5;
const DEFAULT_LINES = 3;

export const ListSkeleton: FC<ListSkeletonProps> = ({
  items = DEFAULT_ITEMS,
  showAvatar = true,
  linesPerItem = DEFAULT_LINES,
  "aria-label": ariaLabel = "List loading skeleton",
  className = "",
}) => {
  return (
    <div
      role="status"
      aria-label={ariaLabel}
      aria-busy="true"
      className={`flex flex-col gap-4 ${className}`}
    >
      {[...Array(items)].map((_, index) => (
        <div
          key={index}
          className="flex items-start gap-3 p-4 bg-surface-raised rounded-xl border border-border"
          role="listitem"
          aria-hidden="true"
        >
          {showAvatar && (
            <div className="skeleton-pulse skeleton-avatar size-12 shrink-0" aria-hidden="true" />
          )}
          <div className="flex-1 min-w-0 space-y-2">
            <div className="skeleton-pulse skeleton-text skeleton-text-lg w-1/3" aria-hidden="true" />
            {[...Array(linesPerItem - 1)].map((_, lineIndex) => (
              <div
                key={lineIndex}
                className="skeleton-pulse skeleton-text w-3/4"
                style={{ height: "0.875rem" }}
                aria-hidden="true"
              />
            ))}
          </div>
          <div className="skeleton-pulse skeleton-text skeleton-text-sm w-16 shrink-0" aria-hidden="true" />
        </div>
      ))}
    </div>
  );
};