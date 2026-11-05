import type { BillingEvolution } from "@/features/evolution/types";
import type { ApiErrorResponse, ChartDatum } from "@/types/Types";

export type EvolutionPoint = {
  month: string;
  evolutionValue: number;
};

type EvolutionSeries = {
  points: ReadonlyArray<EvolutionPoint>;
  dataKey: string;
};

export const EMPTY_EVOLUTION: ReadonlyArray<EvolutionPoint> = [];

const COUNT_FORMATTER = new Intl.NumberFormat("es-MX", {
  maximumFractionDigits: 0,
});

const MONEY_FORMATTER = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

/**
 * Joins and downs arrive as independent monthly series. Merge them by month so
 * a single line chart can compare both signals on the same timeline.
 */
export const mergeEvolutionSeries = (
  ...series: EvolutionSeries[]
): ChartDatum[] => {
  const byMonth = new Map<string, ChartDatum>();

  for (const { points, dataKey } of series) {
    for (const point of points) {
      const datum = byMonth.get(point.month) ?? { month: point.month };
      datum[dataKey] = point.evolutionValue;
      byMonth.set(point.month, datum);
    }
  }

  return [...byMonth.values()];
};

export const toBillingChartData = (
  evolution: BillingEvolution | undefined,
): ChartDatum[] =>
  (evolution?.content ?? []).map(({ month, total }) => ({ month, total }));

export const sumEvolutionValues = (
  points: ReadonlyArray<EvolutionPoint>,
): number =>
  points.reduce((total, point) => total + point.evolutionValue, 0);

export const formatEvolutionCount = (value: number): string =>
  COUNT_FORMATTER.format(value);

export const formatSignedEvolutionCount = (value: number): string =>
  `${value > 0 ? "+" : ""}${formatEvolutionCount(value)}`;

export const formatEvolutionMoney = (value: number): string =>
  MONEY_FORMATTER.format(value);

export const getEvolutionYearOptions = (
  currentYear = new Date().getFullYear(),
  totalYears = 5,
): number[] => {
  const safeTotalYears = Math.max(1, Math.floor(totalYears));

  return Array.from(
    { length: safeTotalYears },
    (_, index) => currentYear - index,
  );
};

export const resolveEvolutionError = (
  error: ApiErrorResponse | null | undefined,
  fallback: string,
): string | null => {
  if (!error) {
    return null;
  }

  return error.message ?? error.error ?? fallback;
};
