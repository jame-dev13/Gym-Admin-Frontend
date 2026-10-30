import { CalendarRange } from "lucide-react";
import { useState } from "react";
import { Select } from "@/components/input/Select";
import { RankingCard } from "@/features/ranking/components/RankingCard";
import { RankingEntry } from "@/features/ranking/components/RankingEntry";
import { useGetPeriodRanking } from "@/features/ranking/hooks/useFetchRanking";
import {
  formatRankingLabel,
  formatSubscriptionCount,
} from "@/features/ranking/services/ranking-formatters";
import type { PeriodRankingPerYear } from "@/features/ranking/types";

const ERROR_MESSAGE = "The period ranking could not be loaded.";
const EMPTY_CONTENT: ReadonlyArray<PeriodRankingPerYear> = [];

export const PeriodRankingCard = () => {
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const { data, error, isPending, isRefetching, refetch } =
    useGetPeriodRanking();

  const yearGroups = data?.data.content ?? EMPTY_CONTENT;
  const sortedYearGroups = [...yearGroups].sort((a, b) => b.year - a.year);
  const activeYear =
    sortedYearGroups.find((group) => group.year === selectedYear) ??
    sortedYearGroups[0];
  const items = activeYear?.totalPerYear ?? [];

  const yearOptions = sortedYearGroups.map(({ year }) => ({
    label: String(year),
    value: String(year),
  }));

  const handleYearChange = (value: string) => {
    const year = Number(value);
    if (Number.isFinite(year)) {
      setSelectedYear(year);
    }
  };

  return (
    <RankingCard
      title="Period ranking"
      description="Subscription periods with the strongest demand."
      Icon={CalendarRange}
      items={items}
      getItemKey={(item) =>
        `${activeYear?.year ?? "year"}-${item.period}-${item.subscriptionType}-${item.rank}`
      }
      headerControls={
        activeYear && (
          <Select
            label="Year"
            aria-label="Filter period ranking by year"
            options={yearOptions}
            value={String(activeYear.year)}
            onChange={(event) => handleYearChange(event.currentTarget.value)}
            className="max-w-40"
          />
        )
      }
      isLoading={isPending}
      isRefetching={isRefetching}
      errorMessage={
        error ? (error.message ?? error.error ?? ERROR_MESSAGE) : null
      }
      emptyMessage="No subscription periods to rank yet."
      onRefetch={() => {
        void refetch();
      }}
      renderItem={(item) => (
        <RankingEntry
          rank={item.rank}
          label={formatRankingLabel(item.period)}
          description={formatRankingLabel(item.subscriptionType)}
          value={item.subscriptionCount}
          valueLabel={formatSubscriptionCount(item.subscriptionCount)}
        />
      )}
    />
  );
};
