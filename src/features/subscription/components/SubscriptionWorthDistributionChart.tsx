import { Carousell, type CarousellItem } from "@/components/carousell";
import { ChartBar } from "@/components/charts/ChartBar";
import { ChartPie } from "@/components/charts/ChartPie";
import type { SubscriptionWorthDistribution } from "@/features/subscription/services/subscription-metrics-chart-data";
import {
  buildSubscriptionWorthChartData,
  formatSubscriptionMetricsMoney,
  getSubscriptionWorthSeries,
  getSubscriptionWorthTotal,
} from "@/features/subscription/services/subscription-metrics-chart-data";
import { useMemo } from "react";
import { SubscriptionChartsSkeleton } from "./SubscriptionChartsSkeleton";

const CHART_HEIGHT = 280;

const WORTH_SERIES = getSubscriptionWorthSeries();

type SubscriptionWorthDistributionChartProps = Readonly<{
  distribution?: SubscriptionWorthDistribution;
}>;

export const SubscriptionWorthDistributionChart = ({
  distribution,
}: SubscriptionWorthDistributionChartProps) => {
  const chartData = useMemo(
    () =>
      distribution ? buildSubscriptionWorthChartData(distribution) : [],
    [distribution],
  );

  const items = useMemo<CarousellItem[]>(
    () => [
      {
        id: "subscription-worth-bar",
        label: "Net worth by plan",
        content: (
          <ChartBar
            data={chartData}
            series={WORTH_SERIES}
            xKey="plan"
            tooltipVariant="money"
            locale="es-MX"
            currency="MXN"
            height={CHART_HEIGHT}
            aria-label="Net worth by membership plan"
          />
        ),
      },
      {
        id: "subscription-worth-pie",
        label: "Share of net worth",
        content: (
          <ChartPie
            data={chartData}
            dataKey="worth"
            nameKey="plan"
            tooltipVariant="money"
            locale="es-MX"
            currency="MXN"
            height={CHART_HEIGHT}
            aria-label="Share of net worth by membership plan"
          />
        ),
      },
    ],
    [chartData],
  );

  if (!distribution) {
    return <SubscriptionChartsSkeleton />;
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center justify-between gap-2 px-1">
        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-text-tertiary">
          Total net worth
        </span>
        <span className="text-sm font-semibold tabular-nums text-text-primary">
          {formatSubscriptionMetricsMoney(
            getSubscriptionWorthTotal(distribution),
          )}
        </span>
      </div>

      <Carousell
        items={items}
        aria-label="Subscription net worth charts"
        className="bg-surface-raised"
      />
    </div>
  );
};
