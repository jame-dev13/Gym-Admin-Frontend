import type { FC } from "react";
import {
  CartesianGrid,
  Line,
  LineChart as RechartsLineChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartContainer } from "./ChartContainer";
import { ChartTooltip } from "./ChartTooltip";
import { resolveSeriesColor } from "./chartPalette";
import type { LineChartProps } from "@/types/Props";

const MAX_SERIES = 3;

export const ChartLine: FC<LineChartProps> = ({
  data,
  series,
  xKey = "name",
  tooltipVariant = "default",
  locale,
  currency,
  height,
  responsive,
  animate = true,
  "aria-label": ariaLabel = "Line chart",
  className,
}) => {
  if (series.length === 0) {
    throw new Error("ChartLine requires at least one series");
  }
  if (series.length > MAX_SERIES) {
    throw new Error(
      `ChartLine supports at most ${MAX_SERIES} series, received ${series.length}`,
    );
  }

  return (
    <ChartContainer
      empty={data.length === 0}
      height={height}
      responsive={responsive}
      aria-label={ariaLabel}
      className={className}
      legend={series.map((entry, index) => ({
        name: entry.name ?? entry.dataKey,
        color: resolveSeriesColor(entry, index),
      }))}
      renderChart={({ width, height: chartHeight }) => (
        <RechartsLineChart
          data={data}
          width={width}
          height={chartHeight}
          margin={{ top: 8, right: 8, bottom: 0, left: 0 }}
        >
          <CartesianGrid stroke="var(--color-border)" vertical={false} />
          <XAxis
            dataKey={xKey}
            tickLine={false}
            axisLine={false}
            minTickGap={24}
            tick={{ fill: "var(--color-text-tertiary)", fontSize: 12 }}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tick={{ fill: "var(--color-text-tertiary)", fontSize: 12 }}
          />
          <Tooltip
            content={
              <ChartTooltip
                variant={tooltipVariant}
                data={data}
                xKey={xKey}
                locale={locale}
                currency={currency}
              />
            }
          />
          {series.map((entry, index) => (
            <Line
              key={entry.dataKey}
              dataKey={entry.dataKey}
              name={entry.name ?? entry.dataKey}
              stroke={resolveSeriesColor(entry, index)}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
              isAnimationActive={animate}
            />
          ))}
        </RechartsLineChart>
      )}
    />
  );
};
