import type { SubscriptionMetricsSection } from "@/features/subscription/services/subscription-metrics-layout-sections";

type SubscriptionMetricsSectionHeaderProps = Readonly<
  Pick<SubscriptionMetricsSection, "headingId" | "title" | "description">
>;

export const SubscriptionMetricsSectionHeader = ({
  headingId,
  title,
  description,
}: SubscriptionMetricsSectionHeaderProps) => (
  <div className="flex flex-col gap-1">
    <h2
      id={headingId}
      className="text-lg font-semibold tracking-tight text-text-primary"
    >
      {title}
    </h2>
    <p className="text-sm text-text-secondary">{description}</p>
  </div>
);
