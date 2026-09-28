import type { FC, ReactElement } from "react";
import { ResponsiveContainer } from "recharts";
import { ChartLegend } from "./ChartLegend";
import type { ChartLegendItem } from "@/types/Types";

export interface ChartContainerProps {
  empty: boolean;
  height?: number;
  responsive?: boolean;
  fixedWidth?: number;
  legend?: ChartLegendItem[];
  "aria-label": string;
  className?: string;
  renderChart: (dimensions: {
    width?: number;
    height?: number;
  }) => ReactElement;
}

const DEFAULT_HEIGHT = 300;
const FIXED_TEST_WIDTH = 600;

export const ChartContainer: FC<ChartContainerProps> = ({
  empty,
  height = DEFAULT_HEIGHT,
  responsive = true,
  fixedWidth = FIXED_TEST_WIDTH,
  legend = [],
  "aria-label": ariaLabel,
  className = "",
  renderChart,
}) => {
  if (empty) {
    return (
      <div
        role="img"
        aria-label={ariaLabel}
        className={`flex w-full items-center justify-center rounded-xl border border-border bg-surface-raised px-4 ${className}`}
        style={{ height }}
      >
        <p role="status" className="text-sm text-text-tertiary">
          No data available
        </p>
      </div>
    );
  }

  if (!responsive) {
    return (
      <div role="img" aria-label={ariaLabel} className={`w-full ${className}`}>
        {renderChart({ width: fixedWidth, height })}
        <ChartLegend items={legend} />
      </div>
    );
  }

  return (
    <div role="img" aria-label={ariaLabel} className={`w-full ${className}`}>
      <ResponsiveContainer width="100%" height={height}>
        {renderChart({ height })}
      </ResponsiveContainer>
      <ChartLegend items={legend} />
    </div>
  );
};
