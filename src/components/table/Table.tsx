import type { CSSProperties } from "react";
import type { ColumnAlign, Identifiable } from "@/types/Types";
import type { TableProps } from "@/types/Props";
import "./Table.css";

const DEFAULT_EMPTY_MESSAGE = "No data available";
const DEFAULT_EMPTY_VALUE = "—";

const alignClasses: Record<ColumnAlign, string> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

const sizeCellClasses = {
  sm: "px-3 py-2",
  md: "px-4 py-3",
} as const;

function resolveRowKey<T extends Identifiable>(
  row: T,
  getRowKey: TableProps<T>["getRowKey"],
): string | number {
  if (getRowKey) {
    return getRowKey(row);
  }
  if (row.id !== null && row.id !== undefined) {
    return row.id;
  }
  throw new Error("Table requires a non-null row id or a getRowKey function");
}

function formatCellValue(value: unknown, emptyValue: string): string {
  if (value === null || value === undefined || value === "") {
    return emptyValue;
  }
  return String(value);
}

export function Table<T extends Identifiable>({
  data,
  columns,
  caption,
  "aria-label": ariaLabel,
  emptyMessage = DEFAULT_EMPTY_MESSAGE,
  getRowKey,
  stickyHeader = false,
  striped = false,
  size = "md",
  responsive = "cards",
  cardTitleKey,
  className = "",
}: TableProps<T>) {
  if (columns.length === 0) {
    throw new Error("Table requires at least one column");
  }

  const cellPadding = sizeCellClasses[size];
  const isCards = responsive === "cards";

  return (
    <div
      className={`overflow-x-auto rounded-2xl border border-border bg-surface-raised ${isCards ? "table-cards-root" : ""} ${className}`}
    >
      <table
        aria-label={ariaLabel}
        className={`w-full border-collapse text-sm ${isCards ? "table-cards" : ""}`}
      >
        {caption && <caption className="sr-only">{caption}</caption>}
        <thead>
          <tr className="border-b border-border">
            {columns.map((column) => (
              <th
                key={String(column.key)}
                scope="col"
                style={{ width: column.width } as CSSProperties}
                className={[
                  cellPadding,
                  "whitespace-nowrap text-xs font-semibold uppercase tracking-wider text-text-secondary",
                  alignClasses[column.align ?? "left"],
                  stickyHeader ? "sticky top-0 bg-surface-raised" : "",
                ].join(" ")}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border overflow-hidden">
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                role="status"
                className={`${cellPadding} py-10 text-center text-text-secondary`}
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr
                key={resolveRowKey(row, getRowKey)}
                className={[
                  "transition-colors hover:bg-surface-over",
                  striped ? "even:bg-surface-over/50" : "",
                ].join(" ")}
              >
                {columns.map((column) => {
                  const rawValue = row[column.key];
                  const emptyValue = column.emptyValue ?? DEFAULT_EMPTY_VALUE;
                  const rendered = column.render
                    ? column.render(rawValue, row)
                    : formatCellValue(rawValue, emptyValue);
                  const content =
                    rendered === null ||
                    rendered === undefined ||
                    rendered === ""
                      ? emptyValue
                      : rendered;
                  const isTitle = isCards && cardTitleKey === column.key;

                  return (
                    <td
                      key={String(column.key)}
                      data-label={isCards ? column.header : undefined}
                      data-card-title={isTitle ? "true" : undefined}
                      data-hide-on-cards={
                        isCards && column.hideOnCards ? "true" : undefined
                      }
                      className={[
                        cellPadding,
                        "text-text-primary",
                        alignClasses[column.align ?? "left"],
                      ].join(" ")}
                    >
                      {content}
                    </td>
                  );
                })}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
