import { RefreshBtn } from "@/components/buttons/Buttons";
import { ChartLine } from "@/components/charts/ChartLine";
import { ChartSkeleton } from "@/components/skeleton";
import { useId } from "react";
import type {
  EvolutionChartCardProps,
  EvolutionStatTone,
} from "./EvolutionChartTypes";

const DEFAULT_HEIGHT = 280;

const TONE_CLASSES: Record<EvolutionStatTone, string> = {
  accent: "text-accent",
  success: "text-success",
  danger: "text-danger",
  neutral: "text-text-primary",
};

export const EvolutionChartCard = ({
  title,
  description,
  Icon,
  year,
  data,
  series,
  stats = [],
  isLoading = false,
  isRefetching = false,
  errorMessage = null,
  emptyMessage = "No evolution data available for this year.",
  tooltipVariant = "default",
  height = DEFAULT_HEIGHT,
  onRefetch,
  className = "",
}: EvolutionChartCardProps) => {
  const titleId = useId();
  const isBusy = isLoading || isRefetching;
  const hasData = data.length > 0;

  return (
    <section
      aria-labelledby={titleId}
      aria-busy={isBusy || undefined}
      className={[
        "flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface-raised shadow-sm",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <header className="border-b border-border px-4 py-4 sm:px-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-3">
            <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl border border-accent/30 bg-accent/10 text-accent">
              <Icon size={20} aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2
                  id={titleId}
                  className="text-lg font-semibold tracking-tight text-text-primary"
                >
                  {title}
                </h2>
                <span className="inline-flex items-center rounded-full border border-border bg-surface-over px-2.5 py-0.5 text-xs font-semibold tabular-nums text-text-secondary">
                  {year}
                </span>
              </div>
              <p className="mt-0.5 text-sm leading-relaxed text-text-secondary">
                {description}
              </p>
            </div>
          </div>

          {onRefetch && (
            <RefreshBtn
              label={`Refresh ${title.toLowerCase()}`}
              onClick={onRefetch}
              disabled={isBusy}
              cooldownMs={10_000}
            />
          )}
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4 sm:p-5">
        {stats.length > 0 && (
          <dl className="grid gap-2 sm:grid-cols-3">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-border/70 bg-surface-over/40 px-3 py-2"
              >
                <dt className="text-[10px] font-semibold uppercase tracking-[0.16em] text-text-tertiary">
                  {stat.label}
                </dt>
                <dd
                  className={[
                    "mt-0.5 text-lg font-semibold tabular-nums",
                    TONE_CLASSES[stat.tone ?? "neutral"],
                  ].join(" ")}
                >
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        )}

        {errorMessage ? (
          <p
            role="alert"
            className="rounded-xl border border-danger/30 bg-danger/10 px-4 py-8 text-center text-sm text-danger"
          >
            {errorMessage}
          </p>
        ) : isLoading && !hasData ? (
          <ChartSkeleton variant="line" height={height} showLegend={false} />
        ) : !hasData ? (
          <p
            role="status"
            className="flex items-center justify-center rounded-xl border border-border bg-surface-over/30 px-4 text-center text-sm text-text-secondary"
            style={{ minHeight: height }}
          >
            {emptyMessage}
          </p>
        ) : (
          <ChartLine
            data={data}
            series={series}
            xKey="month"
            tooltipVariant={tooltipVariant}
            height={height}
            aria-label={`${title} line chart`}
          />
        )}
      </div>
    </section>
  );
};
