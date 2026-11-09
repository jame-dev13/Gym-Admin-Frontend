import type { Identifiable } from "@/types/Types";

export type Membership = "BIWEEKLY" | "MONTHLY" | "QUARTERLY" | "ANNUAL";

export type Period = {
  periodType: string;
  periodStr: string;
};

export type SubscriptionStatus =
  | "FINALIZED"
  | "NOT_PAID"
  | "PAID"
  | "DROPPED"
  | "ON_RENEWAL"
  | "RENEWED";

export type SubscriptionAdminRequest = {
  customerEmail: string;
  membership: Membership;
};

export type SubscriptionResponse = Identifiable & {
  customerEmail: string;
  membership: Membership;
  price: number;
  periods: Period[];
  status: SubscriptionStatus;
};

export type SubscriptionAboutToEndResponse = Readonly<Identifiable & {
  member: string;
  membership: Membership;
  price: number;
  endsOn: string;
  status: SubscriptionStatus;
}>;

export type SubscriptionAnnualResumeModel = Readonly<{
  content: Readonly<{
    membershipResume: Readonly<{
      membershipCount: number;
      countDistribution: Readonly<{
        biweeklyCount: number;
        monthlyCount: number;
        quarterlyCount: number;
        annualCount: number;
      }>;
      netWorthDistribution: Readonly<{
        netWorth: number;
        biweeklyWorth: number;
        monthlyWorth: number;
        quarterlyWorth: number;
        annualWorth: number;
      }>;
    }>;
    topMembership: string;
  }>;
}>;
