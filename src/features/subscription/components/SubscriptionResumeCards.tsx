import { ResumeCard } from "@/components/card/ResumeCard";
import {
  formatMembershipLabel,
  formatSubscriptionMetricsCount,
  formatSubscriptionMetricsMoney,
} from "@/features/subscription/services/subscription-metrics-chart-data";
import {
  ChartNoAxesCombined,
  CircleDollarSign,
  Crown,
  UsersRound,
  type LucideIcon,
} from "lucide-react";
import { useMemo } from "react";
import { SubscriptionResumeCardsSkeleton } from "./SubscriptionResumeCardsSkeleton";

type SubscriptionResumeCardsProps = Readonly<{
  membershipCount?: number;
  netWorth?: number;
  topMembership?: string;
}>;

type ResumeMetric = Readonly<{
  key: string;
  label: string;
  footerText: string;
  Icon: LucideIcon;
  value: string;
}>;

export const SubscriptionResumeCards = ({
  membershipCount,
  netWorth,
  topMembership,
}: SubscriptionResumeCardsProps) => {
  const metrics = useMemo<ResumeMetric[]>(() => {
    if (
      membershipCount === undefined ||
      netWorth === undefined ||
      topMembership === undefined
    ) {
      return [];
    }

    const averageNetWorth =
      membershipCount > 0 ? netWorth / membershipCount : 0;

    return [
      {
        key: "membership-count",
        label: "Total memberships",
        footerText: "Active subscriptions",
        Icon: UsersRound,
        value: formatSubscriptionMetricsCount(membershipCount),
      },
      {
        key: "net-worth",
        label: "Net worth",
        footerText: "Accumulated value",
        Icon: CircleDollarSign,
        value: formatSubscriptionMetricsMoney(netWorth),
      },
      {
        key: "top-membership",
        label: "Top plan",
        footerText: "Most subscribed",
        Icon: Crown,
        value: formatMembershipLabel(topMembership),
      },
      {
        key: "average-net-worth",
        label: "Average value",
        footerText: "Per membership",
        Icon: ChartNoAxesCombined,
        value: formatSubscriptionMetricsMoney(averageNetWorth),
      },
    ];
  }, [membershipCount, netWorth, topMembership]);

  if (metrics.length === 0) {
    return <SubscriptionResumeCardsSkeleton />;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 tab:grid-cols-4">
      {metrics.map(({ key, label, footerText, Icon, value }) => (
        <ResumeCard
          key={key}
          Icon={Icon}
          heading={label}
          footerText={footerText}
        >
          <p className="truncate text-2xl font-black tracking-tight text-text-primary">
            {value}
          </p>
        </ResumeCard>
      ))}
    </div>
  );
};
