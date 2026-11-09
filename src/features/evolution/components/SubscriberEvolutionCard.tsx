import { UserPlus } from "lucide-react";
import { useMemo } from "react";
import { EvolutionChartCard } from "@/features/evolution/components/EvolutionChartCard";
import type { EvolutionCardProps } from "@/features/evolution/components/EvolutionChartTypes";
import { useGetSubscriberEvolution } from "@/features/evolution/hooks/useFetchEvolution";
import {
  formatEvolutionCount,
  resolveEvolutionError,
} from "@/features/evolution/services/evolution-chart-data";
import type { ChartSeries } from "@/types/Types";

const ERROR_MESSAGE = "Subscriber evolution could not be loaded.";

const SUBSCRIBER_SERIES: ChartSeries[] = [
  { dataKey: "joins", name: "New subscribers", color: "#22d3ee" },
  { dataKey: "downs", name: "Lost subscribers", color: "#f43f5e" },
];

export const SubscriberEvolutionCard = ({ year }: EvolutionCardProps) => {
  const { data, error, isPending, isRefetching, refetch } =
    useGetSubscriberEvolution(year);

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
    !hasData && !isPending
      ? resolveEvolutionError(error, ERROR_MESSAGE)
      : null;

  return (
    <EvolutionChartCard
      title="Subscriber evolution"
      description="Subscription starts compared with subscriptions that dropped off."
      Icon={UserPlus}
      year={year}
      data={chartData}
      series={SUBSCRIBER_SERIES}
      stats={[
        {
          label: "New subscribers",
          value: formatEvolutionCount(joiningTotal),
          tone: "success",
        },
        {
          label: "Lost subscribers",
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
      emptyMessage="No subscriber movement recorded for this year."
      onRefetch={async () => {
        void await refetch();
      }}
    />
  );
};
