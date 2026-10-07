import type { FC } from "react";
import "./Skeleton.css";

export type ChartSkeletonVariant = "bar" | "line" | "pie";

export interface ChartSkeletonProps {
  variant: ChartSkeletonVariant;
  height?: number;
  showLegend?: boolean;
  legendItems?: number;
  "aria-label"?: string;
  className?: string;
}

const DEFAULT_HEIGHT = 300;
const DEFAULT_LEGEND_ITEMS = 3;

const variantLabels: Record<ChartSkeletonVariant, string> = {
  bar: "Bar chart loading skeleton",
  line: "Line chart loading skeleton",
  pie: "Pie chart loading skeleton",
};

const renderBarChart = () => (
  <div className="flex items-end justify-center gap-3 h-full p-4" role="img" aria-hidden="true">
    {[...Array(5)].map((_, i) => (
      <div
        key={i}
        className="skeleton-pulse skeleton-chart-bar flex-1 max-w-16"
        style={{
          height: `${20 + Math.random() * 60}%`,
          minHeight: "2rem",
        }}
        aria-hidden="true"
      />
    ))}
  </div>
);

const renderLineChart = () => (
  <div className="relative h-full p-4" role="img" aria-hidden="true">
    <div className="absolute inset-0 flex items-end justify-center">
      <div className="w-full h-full" aria-hidden="true">
        {[...Array(3)].map((_, seriesIndex) => (
          <div
            key={seriesIndex}
            className="absolute inset-0"
            style={{
              clipPath: `polygon(0% 100%, 0% ${40 + seriesIndex * 15}%, 25% ${60 - seriesIndex * 10}%, 50% ${30 + seriesIndex * 10}%, 75% ${70 - seriesIndex * 15}%, 100% ${20 + seriesIndex * 10}%, 100% 100%)`,
            }}
          >
            <div className="skeleton-pulse skeleton-chart-line w-full h-full" aria-hidden="true" />
          </div>
        ))}
      </div>
    </div>
    <div className="absolute bottom-4 left-4 right-4 flex justify-between text-text-tertiary text-xs" aria-hidden="true">
      <div className="skeleton-pulse skeleton-text skeleton-text-xs w-12" />
      <div className="skeleton-pulse skeleton-text skeleton-text-xs w-12" />
      <div className="skeleton-pulse skeleton-text skeleton-text-xs w-12" />
    </div>
  </div>
);

const renderPieChart = () => (
  <div className="relative h-full p-4 flex items-center justify-center" role="img" aria-hidden="true">
    <div className="relative size-48" aria-hidden="true">
      <div className="absolute inset-0 skeleton-pulse skeleton-chart-pie-segment rounded-full border-8 border-surface-over" />
      <div className="absolute inset-0 skeleton-pulse skeleton-chart-pie-segment rounded-full border-8 border-border rotate-90" style={{ clipPath: "polygon(50% 50%, 100% 50%, 100% 100%, 50% 100%)" }} />
      <div className="absolute inset-0 skeleton-pulse skeleton-chart-pie-segment rounded-full border-8 border-surface-over rotate-180" style={{ clipPath: "polygon(50% 50%, 50% 0%, 100% 0%, 100% 50%)" }} />
    </div>
  </div>
);

const renderLegend = (count: number) => (
  <div className="flex flex-wrap items-center justify-center gap-4 mt-4" role="list" aria-label="Chart legend" aria-hidden="true">
    {[...Array(count)].map((_, i) => (
      <div key={i} className="flex items-center gap-2">
        <div className="skeleton-pulse skeleton-avatar size-4" aria-hidden="true" />
        <div className="skeleton-pulse skeleton-text skeleton-text-sm w-20" aria-hidden="true" />
      </div>
    ))}
  </div>
);

const renderAxes = () => (
  <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
    <div className="absolute left-4 bottom-4 top-4 w-0.5 skeleton-pulse bg-border" />
    <div className="absolute left-4 bottom-4 right-4 h-0.5 skeleton-pulse bg-border" />
  </div>
);

export const ChartSkeleton: FC<ChartSkeletonProps> = ({
  variant,
  height = DEFAULT_HEIGHT,
  showLegend = true,
  legendItems = DEFAULT_LEGEND_ITEMS,
  "aria-label": ariaLabel,
  className = "",
}) => {
  const defaultAriaLabel = variantLabels[variant];
  const finalAriaLabel = ariaLabel ?? defaultAriaLabel;

  const renderChart = () => {
    switch (variant) {
      case "bar":
        return (
          <>
            {renderAxes()}
            {renderBarChart()}
          </>
        );
      case "line":
        return (
          <>
            {renderAxes()}
            {renderLineChart()}
          </>
        );
      case "pie":
        return renderPieChart();
      default:
        return null;
    }
  };

  return (
    <figure
      role="status"
      aria-label={finalAriaLabel}
      aria-busy="true"
      className={`w-full ${className}`}
    >
      <div
        className="flex w-full items-center justify-center rounded-xl border border-border bg-surface-raised relative"
        style={{ height }}
      >
        {renderChart()}
      </div>
      {showLegend && renderLegend(legendItems)}
    </figure>
  );
};