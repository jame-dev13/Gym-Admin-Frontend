import type { FC } from "react";
import type { TableSize, TableResponsive } from "@/types/Props";
import "./Skeleton.css";

export interface TableSkeletonProps {
  columns?: number;
  rows?: number;
  size?: TableSize;
  responsive?: TableResponsive;
  showHeader?: boolean;
  caption?: string;
  "aria-label"?: string;
  className?: string;
}

const DEFAULT_COLUMNS = 5;
const DEFAULT_ROWS = 5;

const sizeCellPadding: Record<TableSize, string> = {
  sm: "px-3 py-2",
  md: "px-4 py-3",
};

export const TableSkeleton: FC<TableSkeletonProps> = ({
  columns = DEFAULT_COLUMNS,
  rows = DEFAULT_ROWS,
  size = "md",
  responsive = "cards",
  showHeader = true,
  caption,
  "aria-label": ariaLabel = "Table loading skeleton",
  className = "",
}) => {
  const cellPadding = sizeCellPadding[size];
  const isCards = responsive === "cards";
  const clampedColumns = Math.min(Math.max(columns, 4), 6);

  return (
    <div
      role="status"
      aria-label={ariaLabel}
      aria-busy="true"
      className={`overflow-x-auto rounded-2xl border border-border bg-surface-raised ${isCards ? "table-cards-root" : ""} ${className}`}
    >
      <table
        className={`w-full border-collapse text-sm ${isCards ? "table-cards" : ""}`}
      >
        {caption && <caption className="sr-only">{caption}</caption>}
        {showHeader && (
          <thead>
            <tr className="border-b border-border">
              {[...Array(clampedColumns)].map((_, colIndex) => (
                <th
                  key={`header-${colIndex}`}
                  scope="col"
                  className={`${cellPadding} whitespace-nowrap`}
                >
                  <div className="skeleton-pulse skeleton-table-cell w-full" aria-hidden="true" />
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody className="divide-y divide-border overflow-hidden">
          {[...Array(rows)].map((_, rowIndex) => (
            <tr key={`row-${rowIndex}`} className="transition-colors hover:bg-surface-over">
              {[...Array(clampedColumns)].map((_, colIndex) => (
                <td
                  key={`cell-${rowIndex}-${colIndex}`}
                  className={`${cellPadding} text-text-primary`}
                >
                  <div className="skeleton-pulse skeleton-table-cell w-full" aria-hidden="true" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};