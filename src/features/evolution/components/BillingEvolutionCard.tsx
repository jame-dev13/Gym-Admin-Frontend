import { ReceiptText } from "lucide-react";
import { useMemo } from "react";
import { EvolutionChartCard } from "@/features/evolution/components/EvolutionChartCard";
import type { EvolutionCardProps } from "@/features/evolution/components/EvolutionChartTypes";
import { useGetBillingEvolution } from "@/features/evolution/hooks/useFetchEvolution";
import {
  formatEvolutionMoney,
  resolveEvolutionError,
} from "@/features/evolution/services/evolution-chart-data";
import type { ChartSeries } from "@/types/Types";

const ERROR_MESSAGE = "Billing evolution could not be loaded.";

const BILLING_SERIES: ChartSeries[] = [
  { dataKey: "total", name: "Billed revenue", color: "#10b981" },
];

export const BillingEvolutionCard = ({ year }: EvolutionCardProps) => {
  const { data, error, isPending, isRefetching, refetch } =
    useGetBillingEvolution(year);

  const evolution = data?.data.content;
  const chartData = useMemo(
    () => Array.from(evolution?.monthlyEvolution ?? []),
    [evolution],
  );
  const insights = evolution?.billingInsights;

  const hasData = chartData.length > 0;
  const errorMessage =
    !hasData && !isPending ? resolveEvolutionError(error, ERROR_MESSAGE) : null;

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
          value: formatEvolutionMoney(insights?.totalRevenue ?? 0),
          tone: "accent",
        },
        {
          label: "Monthly average",
          value: formatEvolutionMoney(insights?.monthlyAverage ?? 0),
          tone: "neutral",
        },
        {
          label: "Best month",
          value: insights?.bestMonth?.trim() || "—",
          tone: "success",
        },
      ]}
      isLoading={isPending}
      isRefetching={isRefetching}
      errorMessage={errorMessage}
      emptyMessage="No billing records available for this year."
      tooltipVariant="money"
      onRefetch={async () => {
        void (await refetch());
      }}
    />
  );
};
