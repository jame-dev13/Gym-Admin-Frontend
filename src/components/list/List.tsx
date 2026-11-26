import { memo } from "react";
import type { ListGap, ListItemKey, ListProps } from "./ListTypes";

const DEFAULT_EMPTY_MESSAGE = "No data available";

const gapClasses: Record<ListGap, string> = {
  sm: "gap-2",
  md: "gap-3",
  lg: "gap-4",
};

function resolveItemKey<T>(
  entry: T,
  index: number,
  getItemKey?: ListItemKey<T>,
): string | number {
  if (getItemKey) {
    return getItemKey(entry);
  }

  if (typeof entry === "object" && entry !== null && "id" in entry) {
    const { id } = entry as { id?: unknown };

    if (typeof id === "string" || typeof id === "number") {
      return id;
    }
  }

  return index;
}

function ListComponent<T>({
  data,
  item,
  getItemKey,
  emptyMessage = DEFAULT_EMPTY_MESSAGE,
  "aria-label": ariaLabel,
  gap = "md",
  scrollable = true,
  className = "",
}: ListProps<T>) {
  return (
    <div
      data-testid="list"
      className={[
        "relative min-h-0 w-full",
        scrollable
          ? "max-h-full overflow-auto overscroll-contain"
          : "overflow-visible",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* `w-fit` + `min-w-full` keeps normal content wrapping inside the
          available width, but lets the list grow past the viewport when an
          item has a wider intrinsic minimum. That gives the scroll container
          a meaningful X axis without forcing every item to max-content. */}
      <ul
        role="list"
        aria-label={ariaLabel}
        className={[
          "flex w-fit min-w-full flex-col",
          gapClasses[gap],
        ].join(" ")}
      >
        {data.length === 0 ? (
          <li
            role="status"
            className="w-full px-4 py-12 text-center text-sm text-text-secondary sm:py-16"
          >
            {emptyMessage}
          </li>
        ) : (
          data.map((entry, index) => {
            const extraClassName =
              typeof item.className === "function"
                ? item.className(entry)
                : item.className;

            return (
              <li
                key={resolveItemKey(entry, index, getItemKey)}
                data-testid="list-item"
                className={extraClassName}
              >
                {item.render(entry, index)}
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
}

export const List = memo(ListComponent) as {
  <T>(props: ListProps<T>): ReturnType<typeof ListComponent<T>>;
};
