export type OverviewInsightsResponse = Readonly<{
  activeMembers: number;
  monthlyRevenue: number;
  expiringSubscriptions: number;
  newSignups: number;
}>;