import { Users } from "lucide-react";
import { useMemo } from "react";
import { EvolutionChartCard } from "@/features/evolution/components/EvolutionChartCard";
import type { EvolutionCardProps } from "@/features/evolution/components/EvolutionChartTypes";
import { useGetCustomerEvolution } from "@/features/evolution/hooks/useFetchEvolution";
import {
  formatEvolutionCount,
  resolveEvolutionError,
} from "@/features/evolution/services/evolution-chart-data";
import type { ChartSeries } from "@/types/Types";

const ERROR_MESSAGE = "Customer evolution could not be loaded.";

const CUSTOMER_SERIES: ChartSeries[] = [
  { dataKey: "joins", name: "New customers", color: "#22d3ee" },
  { dataKey: "downs", name: "Lost customers", color: "#f43f5e" },
];

export const CustomerEvolutionCard = ({ year }: EvolutionCardProps) => {
  const { data, error, isPending, isRefetching, refetch } =
    useGetCustomerEvolution(year);

  const evolution = data?.data.content;
  const chartData = useMemo(
    () => Array.from(evolution?.monthlyEvolution ?? []),
    [evolution],
  );
  const insights = evolution?.evoInsights;

  const joiningTotal = insights?.joiningTotal ?? 0;
  const downingTotal = insights?.downingTotal ?? 0;
  const netMovement = insights?.netMovement ?? 0;

  const hasData = chartData.length > 0;
  const errorMessage =
    !hasData && !isPending ? resolveEvolutionError(error, ERROR_MESSAGE) : null;

  return (
    <EvolutionChartCard
      title="Customer evolution"
      description="New customers compared with customers who stopped attending."
      Icon={Users}
      year={year}
      data={chartData}
      series={CUSTOMER_SERIES}
      stats={[
        {
          label: "New customers",
          value: formatEvolutionCount(joiningTotal),
          tone: "success",
        },
        {
          label: "Lost customers",
          value: formatEvolutionCount(downingTotal),
          tone: "danger",
        },
        {
          label: "Net movement",
          value: formatEvolutionCount(netMovement),
          tone:
            joiningTotal === downingTotal
              ? "neutral"
              : joiningTotal > downingTotal
                ? "success"
                : "danger",
        },
      ]}
      isLoading={isPending}
      isRefetching={isRefetching}
      errorMessage={errorMessage}
      emptyMessage="No customer movement recorded for this year."
      onRefetch={async () => {
        void (await refetch());
      }}
    />
  );
};
