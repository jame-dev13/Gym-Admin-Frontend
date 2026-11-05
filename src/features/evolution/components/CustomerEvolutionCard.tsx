import { Users } from "lucide-react";
import { useMemo } from "react";
import { EvolutionChartCard } from "@/features/evolution/components/EvolutionChartCard";
import type { EvolutionCardProps } from "@/features/evolution/components/EvolutionChartTypes";
import {
  useGetCustomerDowningEvo,
  useGetCustomerJoiningEvo,
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

const ERROR_MESSAGE = "Customer evolution could not be loaded.";

const CUSTOMER_SERIES: ChartSeries[] = [
  { dataKey: "joins", name: "New customers", color: "#22d3ee" },
  { dataKey: "downs", name: "Lost customers", color: "#f43f5e" },
];

export const CustomerEvolutionCard = ({ year }: EvolutionCardProps) => {
  const joins = useGetCustomerJoiningEvo(year);
  const downs = useGetCustomerDowningEvo(year);

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
  const netGrowth = joiningTotal - downingTotal;

  const isLoading = joins.isPending || downs.isPending;
  const isRefetching = joins.isRefetching || downs.isRefetching;
  const hasData = chartData.length > 0;
  const errorMessage =
    !hasData && !isLoading
      ? resolveEvolutionError(joins.error ?? downs.error, ERROR_MESSAGE)
      : null;

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
          label: "Net growth",
          value: formatSignedEvolutionCount(netGrowth),
          tone:
            netGrowth > 0 ? "success" : netGrowth < 0 ? "danger" : "neutral",
        },
      ]}
      isLoading={isLoading}
      isRefetching={isRefetching}
      errorMessage={errorMessage}
      emptyMessage="No customer movement recorded for this year."
      onRefetch={() => {
        void joins.refetch();
        void downs.refetch();
      }}
    />
  );
};
