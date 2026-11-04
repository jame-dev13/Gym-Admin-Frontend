import { ResumeCard } from "@/components/card/ResumeCard";
import { ListSkeleton } from "@/components/skeleton";
import { useGetOverviewInsights } from "@/features/administration/hooks/useFetchOverview";
import {
  CreditCardX,
  DollarSignIcon,
  UserPlus,
  UserStarIcon,
  type LucideProps,
} from "lucide-react";
import React, { useMemo } from "react";

type DataCard = {
  Icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
  label: string;
  value: number;
};

export const AdministrationOverviewInsights = () => {
  const { data, isError, isLoading } = useGetOverviewInsights();

  const dataCard = useMemo<DataCard[]>(() => {
    if (!data) return [];

    const { activeMembers, monthlyRevenue, expiringSubscriptions, newSignups } =
      data.data;

    return [
      {
        Icon: UserStarIcon,
        label: "Active members",
        value: activeMembers,
      },
      {
        Icon: DollarSignIcon,
        label: "Monthly revenue",
        value: monthlyRevenue,
      },
      {
        Icon: CreditCardX,
        label: "Expiring subscriptions",
        value: expiringSubscriptions,
      },
      {
        Icon: UserPlus,
        label: "New sign-ups",
        value: newSignups,
      },
    ];
  }, [data]);

  if (isLoading) {
    return <ListSkeleton showAvatar items={2} />;
  }

  if (isError) {
    return (
      <p aria-live="polite" className="text-danger truncate">
        Error loading overview insights
      </p>
    );
  }

  return (
    <div className="grid gap-3 max-xl:grid-cols-4 max-md:grid-cols-2">
      {dataCard.map(({ Icon, label, value }) => (
        <ResumeCard key={label} Icon={Icon} heading={label}>
          {value}
        </ResumeCard>
      ))}
    </div>
  );
};
