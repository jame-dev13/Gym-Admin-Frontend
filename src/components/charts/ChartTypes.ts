import type { ChartDatum, ChartLegendItem, ChartSeries, ChartTooltipVariant } from "@/types/Types";

export type ChartTooltipEntry = {
  name?: string;
  value?: string | number;
  color?: string;
  dataKey?: string | number;
};

export interface ChartTooltipProps {
  variant?: ChartTooltipVariant;
  active?: boolean;
  label?: string | number;
  payload?: ChartTooltipEntry[];
  data?: ChartDatum[];
  xKey?: string;
  locale?: string;
  currency?: string;
}

export interface ChartBaseProps {
  data: ChartDatum[];
  height?: number;
  responsive?: boolean;
  animate?: boolean;
  "aria-label"?: string;
  className?: string;
}

export interface LineChartProps extends ChartBaseProps {
  series: ChartSeries[];
  xKey?: string;
  tooltipVariant?: ChartTooltipVariant;
  locale?: string;
  currency?: string;
}

export interface BarChartProps extends ChartBaseProps {
  series: ChartSeries[];
  xKey?: string;
  tooltipVariant?: ChartTooltipVariant;
  locale?: string;
  currency?: string;
}

export interface PieChartProps extends ChartBaseProps {
  dataKey?: string;
  nameKey?: string;
  tooltipVariant?: Extract<ChartTooltipVariant, "default" | "money">;
  locale?: string;
  currency?: string;
}

export interface ChartLegendProps {
  items: ChartLegendItem[];
}