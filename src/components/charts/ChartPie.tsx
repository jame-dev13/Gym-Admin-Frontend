import type { FC } from "react";
import {
  Cell,
  Pie,
  PieChart as RechartsPieChart,
  Tooltip,
} from "recharts";
import { ChartContainer } from "./ChartContainer";
import { ChartTooltip } from "./ChartTooltip";
import { CHART_PALETTE } from "./chartPalette";
import type { PieChartProps } from "@/types/Props";

export const ChartPie: FC<PieChartProps> = ({
  data,
  dataKey = "value",
  nameKey = "name",
  tooltipVariant = "default",
  locale,
  currency,
  height,
  responsive,
  animate = true,
  "aria-label": ariaLabel = "Pie chart",
  className,
}) => (
  <ChartContainer
    empty={data.length === 0}
    height={height}
    responsive={responsive}
    aria-label={ariaLabel}
    className={className}
    legend={data.map((entry, index) => ({
      name: String(entry[nameKey] ?? ""),
      color: CHART_PALETTE[index % CHART_PALETTE.length],
    }))}
    renderChart={({ width, height: chartHeight }) => (
      <RechartsPieChart width={width} height={chartHeight}>
        <Pie
          data={data}
          dataKey={dataKey}
          nameKey={nameKey}
          outerRadius="85%"
          paddingAngle={2}
          stroke="var(--color-surface-raised)"
          strokeWidth={2}
          isAnimationActive={animate}
        >
          {data.map((entry, index) => (
            <Cell
              key={String(entry[nameKey] ?? index)}
              fill={CHART_PALETTE[index % CHART_PALETTE.length]}
            />
          ))}
        </Pie>
        <Tooltip
          content={
            <ChartTooltip
              variant={tooltipVariant}
              locale={locale}
              currency={currency}
            />
          }
        />
      </RechartsPieChart>
    )}
  />
);
