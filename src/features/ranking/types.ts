import type { Content } from "@/types/SharedTypes";

export type MembershipRanking = {
  membership: string;
  subsCount: number;
  rank: number;
};

export type PeriodRanking = {
  period: string;
  subscriptionCount: number;
  subscriptionType: string;
  rank: number;
};

export type PeriodRankingPerYear = {
  year: number;
  totalPerYear: ReadonlyArray<PeriodRanking>;
};

export type MembershipRankingResponse = Content<MembershipRanking>;
export type PeriodRankingResponse = Content<PeriodRankingPerYear>;
