import type { SubscriptionAnnualResumeModel } from "@/features/subscription/types";
import type { ChartDatum, ChartSeries } from "@/types/Types";

export type SubscriptionCountDistribution =
  SubscriptionAnnualResumeModel["content"]["membershipResume"]["countDistribution"];

export type SubscriptionWorthDistribution =
  SubscriptionAnnualResumeModel["content"]["membershipResume"]["netWorthDistribution"];

type MembershipPlanKey = "biweekly" | "monthly" | "quarterly" | "annual";

type PlanDefinition = Readonly<{
  key: MembershipPlanKey;
  label: string;
  countKey: keyof SubscriptionCountDistribution;
  worthKey: keyof SubscriptionWorthDistribution;
}>;

const PLAN_DEFINITIONS: ReadonlyArray<PlanDefinition> = [
  {
    key: "biweekly",
    label: "Biweekly",
    countKey: "biweeklyCount",
    worthKey: "biweeklyWorth",
  },
  {
    key: "monthly",
    label: "Monthly",
    countKey: "monthlyCount",
    worthKey: "monthlyWorth",
  },
  {
    key: "quarterly",
    label: "Quarterly",
    countKey: "quarterlyCount",
    worthKey: "quarterlyWorth",
  },
  {
    key: "annual",
    label: "Annual",
    countKey: "annualCount",
    worthKey: "annualWorth",
  },
];

const COUNT_FORMATTER = new Intl.NumberFormat("es-MX", {
  maximumFractionDigits: 0,
});

const MONEY_FORMATTER = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
  maximumFractionDigits: 2,
});

const capitalize = (word: string): string =>
  word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();

export const formatSubscriptionMetricsCount = (value: number): string =>
  COUNT_FORMATTER.format(value);

export const formatSubscriptionMetricsMoney = (value: number): string =>
  MONEY_FORMATTER.format(value);

export const formatMembershipLabel = (membership: string): string => {
  const normalized = membership.trim().toLowerCase();

  if (!normalized) {
    return "Not available";
  }

  const knownPlan = PLAN_DEFINITIONS.find(({ key }) => key === normalized);
  if (knownPlan) {
    return knownPlan.label;
  }

  return normalized
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map(capitalize)
    .join(" ");
};

export const buildSubscriptionCountChartData = (
  distribution: SubscriptionCountDistribution,
): ChartDatum[] =>
  PLAN_DEFINITIONS.map(({ label, countKey }) => ({
    plan: label,
    count: distribution[countKey],
  }));

export const buildSubscriptionWorthChartData = (
  distribution: SubscriptionWorthDistribution,
): ChartDatum[] =>
  PLAN_DEFINITIONS.map(({ label, worthKey }) => ({
    plan: label,
    worth: distribution[worthKey],
  }));

export const getSubscriptionCountSeries = (): ChartSeries[] => [
  {
    dataKey: "count",
    name: "Subscriptions",
    color: "#22d3ee",
  },
];

export const getSubscriptionWorthSeries = (): ChartSeries[] => [
  {
    dataKey: "worth",
    name: "Net worth",
    color: "#10b981",
  },
];

export const getSubscriptionCountTotal = (
  distribution: SubscriptionCountDistribution,
): number =>
  PLAN_DEFINITIONS.reduce(
    (total, { countKey }) => total + distribution[countKey],
    0,
  );

export const getSubscriptionWorthTotal = (
  distribution: SubscriptionWorthDistribution,
): number => distribution.netWorth;
