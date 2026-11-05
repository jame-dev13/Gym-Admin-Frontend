import { UserPlus } from "lucide-react";
import { useMemo } from "react";
import { EvolutionChartCard } from "@/features/evolution/components/EvolutionChartCard";
import type { EvolutionCardProps } from "@/features/evolution/components/EvolutionChartTypes";
import {
  useGetSubscriberDowningEvo,
  useGetSubscriberJoiningEvo,
} from "@/features/evolution/hooks/useFetchEvolution";
import {
  EMPTY_EVOLUTION,
  formatEvolutionCount,
  formatSignedEvolutionCount,
  mergeEvolutionSeries,
  resolveEvolutionError,
  sumEvolutionValues,
} from "@/features/evolution/services/evolution-chart-data";
import type { ChartSeries } from "@/types/Types";

const ERROR_MESSAGE = "Subscriber evolution could not be loaded.";

const SUBSCRIBER_SERIES: ChartSeries[] = [
  { dataKey: "joins", name: "New subscribers", color: "#22d3ee" },
  { dataKey: "downs", name: "Lost subscribers", color: "#f43f5e" },
];

export const SubscriberEvolutionCard = ({ year }: EvolutionCardProps) => {
  const joins = useGetSubscriberJoiningEvo(year);
  const downs = useGetSubscriberDowningEvo(year);

  const joiningPoints = joins.data?.data.content ?? EMPTY_EVOLUTION;
  const downingPoints = downs.data?.data.content ?? EMPTY_EVOLUTION;

  const chartData = useMemo(
    () =>
      mergeEvolutionSeries(
        { points: joiningPoints, dataKey: "joins" },
        { points: downingPoints, dataKey: "downs" },
      ),
    [joiningPoints, downingPoints],
  );

  const joiningTotal = useMemo(
    () => sumEvolutionValues(joiningPoints),
    [joiningPoints],
  );
  const downingTotal = useMemo(
    () => sumEvolutionValues(downingPoints),
    [downingPoints],
  );
  const netMovement = joiningTotal - downingTotal;

  const isLoading = joins.isPending || downs.isPending;
  const isRefetching = joins.isRefetching || downs.isRefetching;
  const hasData = chartData.length > 0;
  const errorMessage =
    !hasData && !isLoading
      ? resolveEvolutionError(joins.error ?? downs.error, ERROR_MESSAGE)
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
          value: formatSignedEvolutionCount(netMovement),
          tone:
            netMovement > 0
              ? "success"
              : netMovement < 0
                ? "danger"
                : "neutral",
        },
      ]}
      isLoading={isLoading}
      isRefetching={isRefetching}
      errorMessage={errorMessage}
      emptyMessage="No subscriber movement recorded for this year."
      onRefetch={() => {
        void joins.refetch();
        void downs.refetch();
      }}
    />
  );
};
