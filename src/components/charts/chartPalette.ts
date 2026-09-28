import type { ChartSeries } from "@/types/Types";

export const CHART_PALETTE = [
  "#22d3ee",
  "#10b981",
  "#f59e0b",
  "#f43f5e",
  "#8b5cf6",
] as const;

export const resolveSeriesColor = (
  series: ChartSeries,
  index: number,
): string => series.color ?? CHART_PALETTE[index % CHART_PALETTE.length];
