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
