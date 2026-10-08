import type { FC } from "react";
import {
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartContainer } from "./ChartContainer";
import { ChartTooltip } from "./ChartTooltip";
import { resolveSeriesColor } from "./chartPalette";
import type { BarChartProps } from "./ChartTypes";

export const ChartBar: FC<BarChartProps> = ({
  data,
  series,
  xKey = "name",
  tooltipVariant = "default",
  locale,
  currency,
  height,
  responsive,
  animate = true,
  "aria-label": ariaLabel = "Bar chart",
  className,
}) => {
  if (series.length === 0) {
    throw new Error("ChartBar requires at least one series");
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
        <RechartsBarChart
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
            <Bar
              key={entry.dataKey}
              dataKey={entry.dataKey}
              name={entry.name ?? entry.dataKey}
              fill={resolveSeriesColor(entry, index)}
              radius={[6, 6, 0, 0]}
              maxBarSize={48}
              isAnimationActive={animate}
            />
          ))}
        </RechartsBarChart>
      )}
    />
  );
};
