import { memo, type ComponentType } from "react";
import type { Identifiable, RowAction } from "@/types/Types";
import type { TableRowActionsProps } from "./TableTypes";

export type { TableRowActionsProps };

/**
 * Contract for row-action renderers.
 *
 * `TableRowActions` below is the default generic implementation. Feature
 * domains may provide their own component with this same signature under
 * `src/features/<domain>/components/`, narrowing it to what the domain
 * needs (e.g. binding only to `row.id` with update/delete actions).
 */
export type TableRowActionsComponent<T extends Identifiable> =
  ComponentType<TableRowActionsProps<T>>;

function isDisabled<T>(action: RowAction<T>, row: T): boolean {
  return typeof action.disabled === "function"
    ? action.disabled(row)
    : (action.disabled ?? false);
}

function TableRowActionsComponent<T extends Identifiable>({
  row,
  actions,
  "aria-label": ariaLabel = "Row actions",
}: TableRowActionsProps<T>) {
  const visible = actions.filter((action) => !action.hidden?.(row));

  if (visible.length === 0) {
    return <span className="text-text-secondary">—</span>;
  }

  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className="inline-flex items-center justify-end gap-1"
    >
      {visible.map((action) => {
        const Icon = action.Icon;
        const disabled = isDisabled(action, row);
        return (
          <button
            key={action.id}
            type="button"
            aria-label={action.label}
            title={action.label}
            disabled={disabled}
            onClick={() => action.onSelect(row)}
            className={[
              "inline-flex size-8 items-center justify-center rounded-lg border transition-colors duration-150",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
              "disabled:cursor-not-allowed disabled:opacity-50",
              action.destructive
                ? "border-border bg-surface-raised text-text-secondary hover:border-red-500/60 hover:bg-red-500/10 hover:text-red-500"
                : "border-border bg-surface-raised text-text-secondary hover:border-accent hover:bg-surface-over hover:text-text-primary",
            ].join(" ")}
          >
            {Icon ? (
              <Icon size={16} aria-hidden="true" />
            ) : (
              <span className="px-2 text-xs font-semibold">{action.label}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export const TableRowActions = memo(TableRowActionsComponent) as {
  <T extends Identifiable>(props: TableRowActionsProps<T>): ReturnType<typeof TableRowActionsComponent<T>>;
};
