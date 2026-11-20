import type { Membership } from "@/features/subscription/types";
import {
  CalendarCheck2,
  CalendarDays,
  CalendarRange,
  Crown,
  type LucideIcon,
} from "lucide-react";

/**
 * Static description of a membership a customer can subscribe to.
 *
 * The showcase and the create/renew dialogs share this definition so the
 * displayed price always matches the plan sent to the API.
 */
export type MembershipPlan = Readonly<{
  membership: Membership;
  label: string;
  price: number;
  cadence: string;
  durationLabel: string;
  description: string;
  highlights: readonly string[];
  Icon: LucideIcon;
}>;

const MEMBERSHIP_PLANS: readonly MembershipPlan[] = [
  {
    membership: "BIWEEKLY",
    label: "Biweekly",
    price: 150,
    cadence: "Every 2 weeks",
    durationLabel: "2 weeks",
    description: "A short commitment to train at your own pace.",
    highlights: ["Full facility access", "Billed every two weeks"],
    Icon: CalendarDays,
  },
  {
    membership: "MONTHLY",
    label: "Monthly",
    price: 300,
    cadence: "Every month",
    durationLabel: "1 month",
    description: "The flexible plan for a steady monthly routine.",
    highlights: ["Full facility access", "Renew month by month"],
    Icon: CalendarRange,
  },
  {
    membership: "QUARTERLY",
    label: "Quarterly",
    price: 900,
    cadence: "Every 3 months",
    durationLabel: "3 months",
    description: "Three months of training without renewal worries.",
    highlights: ["Full facility access", "Longer billing cycle"],
    Icon: CalendarCheck2,
  },
  {
    membership: "ANNUAL",
    label: "Annual",
    price: 3600,
    cadence: "Every year",
    durationLabel: "12 months",
    description: "The best value for members who train all year.",
    highlights: ["Full facility access", "Single yearly payment"],
    Icon: Crown,
  },
];

const PRICE_FORMATTER = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
  maximumFractionDigits: 0,
});

export const getMembershipPlans = () => MEMBERSHIP_PLANS;

export const getMembershipPlan = (membership: Membership) =>
  MEMBERSHIP_PLANS.find((plan) => plan.membership === membership);

export const formatMembershipPlanPrice = (price: number): string =>
  PRICE_FORMATTER.format(price);
