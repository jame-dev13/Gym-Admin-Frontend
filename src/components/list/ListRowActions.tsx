import { memo } from "react";
import type { RowAction } from "@/types/Types";
import type { ListRowActionsProps } from "./ListTypes";

export type { ListRowActionsProps };

/**
 * `ListRowActions` is the list analogue of `TableRowActions`.
 *
 * It renders the same icon-button group but, unlike the table version, does
 * not constrain `T` to `Identifiable`. List items such as comments are keyed
 * by a domain-specific field (`commentId`) and the caller provides that key.
 */
function isDisabled<T>(action: RowAction<T>, row: T): boolean {
  return typeof action.disabled === "function"
    ? action.disabled(row)
    : (action.disabled ?? false);
}

function ListRowActionsComponent<T>({
  row,
  actions,
  "aria-label": ariaLabel = "Row actions",
}: ListRowActionsProps<T>) {
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

export const ListRowActions = memo(ListRowActionsComponent) as {
  <T>(
    props: ListRowActionsProps<T>,
  ): ReturnType<typeof ListRowActionsComponent<T>>;
};
