import { Trophy } from "lucide-react";
import { MembershipRankingCard } from "@/features/ranking/components/MembershipRankingCard";
import { PeriodRankingCard } from "@/features/ranking/components/PeriodRankingCard";

export const RankingLayout = () => {
  return (
    <section
      aria-labelledby="ranking-overview-heading"
      className="flex w-full flex-1 flex-col gap-6"
    >
      <header className="flex flex-col gap-2">
        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent">
          <Trophy size={14} aria-hidden="true" />
          Subscription metrics
        </span>
        <h1
          id="ranking-overview-heading"
          className="text-3xl font-bold tracking-tight text-text-primary"
        >
          Subscription rankings
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-text-secondary">
          Compare membership plans and subscription periods by the number of
          subscriptions they generated. Rankings refresh automatically whenever
          a subscription changes.
        </p>
      </header>

      <div className="grid gap-5 tab:grid-cols-2">
        <MembershipRankingCard />
        <PeriodRankingCard />
      </div>
    </section>
  );
};
