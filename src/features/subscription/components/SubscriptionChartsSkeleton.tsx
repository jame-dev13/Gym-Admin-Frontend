import { ChartSkeleton } from "@/components/skeleton";

const CHART_HEIGHT = 280;

export const SubscriptionChartsSkeleton = () => (
  <ChartSkeleton
    variant="bar"
    height={CHART_HEIGHT}
    showLegend
    legendItems={4}
    aria-label="Loading subscription charts"
  />
);
