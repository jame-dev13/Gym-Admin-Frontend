import { ReceiptText } from "lucide-react";
import { useMemo } from "react";
import { EvolutionChartCard } from "@/features/evolution/components/EvolutionChartCard";
import type { EvolutionCardProps } from "@/features/evolution/components/EvolutionChartTypes";
import { useGetBillingEvolution } from "@/features/evolution/hooks/useFetchEvolution";
import {
  formatEvolutionMoney,
  resolveEvolutionError,
  toBillingChartData,
} from "@/features/evolution/services/evolution-chart-data";
import type { ChartSeries } from "@/types/Types";

const ERROR_MESSAGE = "Billing evolution could not be loaded.";

const BILLING_SERIES: ChartSeries[] = [
  { dataKey: "total", name: "Billed revenue", color: "#10b981" },
];

const EMPTY_BILLING_POINTS: ReadonlyArray<{
  month: string;
  total: number;
}> = [];

export const BillingEvolutionCard = ({ year }: EvolutionCardProps) => {
  const billing = useGetBillingEvolution(year);
  const billingEvolution = billing.data?.data;
  const billingPoints = billingEvolution?.content ?? EMPTY_BILLING_POINTS;

  const chartData = useMemo(
    () => toBillingChartData(billingEvolution),
    [billingEvolution],
  );

  const totalRevenue = useMemo(
    () => billingPoints.reduce((total, point) => total + point.total, 0),
    [billingPoints],
  );
  const monthlyAverage =
    billingPoints.length > 0 ? totalRevenue / billingPoints.length : 0;
  const bestMonth = useMemo(
    () =>
      billingPoints.reduce<(typeof billingPoints)[number] | null>(
        (best, point) =>
          !best || point.total > best.total ? point : best,
        null,
      ),
    [billingPoints],
  );

  const hasData = chartData.length > 0;
  const errorMessage =
    !hasData && !billing.isPending
      ? resolveEvolutionError(billing.error, ERROR_MESSAGE)
      : null;

  return (
    <EvolutionChartCard
      title="Billing evolution"
      description="Monthly billed revenue across the selected year."
      Icon={ReceiptText}
      year={year}
      data={chartData}
      series={BILLING_SERIES}
      stats={[
        {
          label: "Total revenue",
          value: formatEvolutionMoney(totalRevenue),
          tone: "accent",
        },
        {
          label: "Monthly average",
          value: formatEvolutionMoney(monthlyAverage),
          tone: "neutral",
        },
        {
          label: "Best month",
          value: bestMonth
            ? `${bestMonth.month} · ${formatEvolutionMoney(bestMonth.total)}`
            : "—",
          tone: "success",
        },
      ]}
      isLoading={billing.isPending}
      isRefetching={billing.isRefetching}
      errorMessage={errorMessage}
      emptyMessage="No billing records available for this year."
      tooltipVariant="money"
      onRefetch={() => {
        void billing.refetch();
      }}
    />
  );
};
