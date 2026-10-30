import { Crown } from "lucide-react";
import { RankingCard } from "@/features/ranking/components/RankingCard";
import { RankingEntry } from "@/features/ranking/components/RankingEntry";
import { useGetMembershipRanking } from "@/features/ranking/hooks/useFetchRanking";
import {
  formatRankingLabel,
  formatSubscriptionCount,
} from "@/features/ranking/services/ranking-formatters";

const ERROR_MESSAGE = "The membership ranking could not be loaded.";

export const MembershipRankingCard = () => {
  const { data, error, isPending, isRefetching, refetch } =
    useGetMembershipRanking();
  const items = data?.data.content ?? [];

  return (
    <RankingCard
      title="Membership ranking"
      description="Plans ranked by the number of paid subscriptions."
      Icon={Crown}
      items={items}
      getItemKey={(item) => item.membership}
      isLoading={isPending}
      isRefetching={isRefetching}
      errorMessage={
        error ? (error.message ?? error.error ?? ERROR_MESSAGE) : null
      }
      emptyMessage="No membership subscriptions to rank yet."
      onRefetch={() => {
        void refetch();
      }}
      renderItem={(item) => (
        <RankingEntry
          rank={item.rank}
          label={formatRankingLabel(item.membership)}
          description="Membership plan"
          value={item.subsCount}
          valueLabel={formatSubscriptionCount(item.subsCount)}
        />
      )}
    />
  );
};
