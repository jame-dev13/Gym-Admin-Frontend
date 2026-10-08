import type { FC } from "react";
import type { ChartLegendProps } from "./ChartTypes";

export const ChartLegend: FC<ChartLegendProps> = ({ items }) => {
  if (items.length === 0) {
    return null;
  }

  return (
    <ul className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 px-2 pt-2">
      {items.map((item) => (
        <li
          key={item.name}
          className="inline-flex items-center gap-1.5 text-xs text-text-secondary"
        >
          <span
            aria-hidden="true"
            className="h-2.5 w-2.5 shrink-0 rounded-full"
            style={{ backgroundColor: item.color }}
          />
          {item.name}
        </li>
      ))}
    </ul>
  );
};
