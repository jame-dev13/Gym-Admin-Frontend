import { Carousell, type CarousellItem } from "@/components/carousell";
import { ChartBar } from "@/components/charts/ChartBar";
import { ChartPie } from "@/components/charts/ChartPie";
import type { SubscriptionCountDistribution } from "@/features/subscription/services/subscription-metrics-chart-data";
import {
  buildSubscriptionCountChartData,
  formatSubscriptionMetricsCount,
  getSubscriptionCountSeries,
  getSubscriptionCountTotal,
} from "@/features/subscription/services/subscription-metrics-chart-data";
import { useMemo } from "react";
import { SubscriptionChartsSkeleton } from "./SubscriptionChartsSkeleton";

const CHART_HEIGHT = 280;

const COUNT_SERIES = getSubscriptionCountSeries();

type SubscriptionCountDistributionChartProps = Readonly<{
  distribution?: SubscriptionCountDistribution;
}>;

export const SubscriptionCountDistributionChart = ({
  distribution,
}: SubscriptionCountDistributionChartProps) => {
  const chartData = useMemo(
    () =>
      distribution ? buildSubscriptionCountChartData(distribution) : [],
    [distribution],
  );

  const items = useMemo<CarousellItem[]>(
    () => [
      {
        id: "subscription-count-bar",
        label: "Subscriptions by plan",
        content: (
          <ChartBar
            data={chartData}
            series={COUNT_SERIES}
            xKey="plan"
            height={CHART_HEIGHT}
            aria-label="Subscriptions by membership plan"
          />
        ),
      },
      {
        id: "subscription-count-pie",
        label: "Share of subscriptions",
        content: (
          <ChartPie
            data={chartData}
            dataKey="count"
            nameKey="plan"
            height={CHART_HEIGHT}
            aria-label="Share of subscriptions by membership plan"
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
          Total subscriptions
        </span>
        <span className="text-sm font-semibold tabular-nums text-text-primary">
          {formatSubscriptionMetricsCount(
            getSubscriptionCountTotal(distribution),
          )}
        </span>
      </div>

      <Carousell
        items={items}
        aria-label="Subscription count charts"
        className="bg-surface-raised"
      />
    </div>
  );
};
