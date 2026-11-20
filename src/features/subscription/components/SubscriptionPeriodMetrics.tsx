import { Badge } from "@/components/badge/Badge";
import type { BadgeVariant } from "@/components/badge/BadgeTypes";
import { formatMembershipLabel } from "@/features/subscription/services/subscription-metrics-chart-data";
import {
  formatPeriodMetricDate,
  formatPeriodMetricDays,
  getSubscriptionPeriodMetrics,
  type SubscriptionPeriodState,
} from "@/features/subscription/services/subscription-period-metrics";
import type { SubscriptionResponse } from "@/features/subscription/types";
import {
  CalendarCheck2,
  CalendarClock,
  CalendarDays,
  CalendarRange,
  Hourglass,
  type LucideIcon,
} from "lucide-react";
import { useId, useMemo } from "react";

export type SubscriptionPeriodMetricsProps = Readonly<{
  subscription: SubscriptionResponse;
  className?: string;
}>;

type MetricTone = "accent" | "success" | "warning" | "danger" | "neutral";

const TONE_CLASSES: Record<MetricTone, string> = {
  accent: "border-accent/30 bg-accent/10 text-accent",
  success: "border-success/30 bg-success/10 text-success",
  warning: "border-warning/30 bg-warning/10 text-warning",
  danger: "border-danger/30 bg-danger/10 text-danger",
  neutral: "border-border bg-surface-over/50 text-text-secondary",
};

const PERIOD_STATE: Record<
  SubscriptionPeriodState,
  { label: string; badge: BadgeVariant; dot: string }
> = {
  completed: { label: "Completed", badge: "slate", dot: "bg-slate-500" },
  active: { label: "Active", badge: "emerald", dot: "bg-success" },
  upcoming: { label: "Upcoming", badge: "blue", dot: "bg-popover-blue" },
  unknown: { label: "Undated", badge: "slate", dot: "bg-border-emphasis" },
};

type MetricTileProps = Readonly<{
  label: string;
  value: string;
  hint: string;
  Icon: LucideIcon;
  tone: MetricTone;
}>;

const MetricTile = ({ label, value, hint, Icon, tone }: MetricTileProps) => (
  <div className="flex flex-col gap-3 rounded-2xl border border-border bg-surface-raised p-4 shadow-sm">
    <div className="flex items-start justify-between gap-2">
      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-text-tertiary">
        {label}
      </p>
      <span
        className={`inline-flex size-8 shrink-0 items-center justify-center rounded-lg border ${TONE_CLASSES[tone]}`}
      >
        <Icon size={16} aria-hidden="true" />
      </span>
    </div>
    <div className="flex min-w-0 flex-col gap-1">
      <p className="truncate text-xl font-bold tracking-tight text-text-primary">
        {value}
      </p>
      <p className="text-xs leading-relaxed text-text-secondary">{hint}</p>
    </div>
  </div>
);

/**
 * Date metrics derived from the subscription `periods`.
 *
 * Fully controlled: it receives the subscription from
 * `SubscriptionOverviewLayout` and only renders when one is present.
 */
export const SubscriptionPeriodMetrics = ({
  subscription,
  className = "",
}: SubscriptionPeriodMetricsProps) => {
  const titleId = useId();
  const metrics = useMemo(
    () => getSubscriptionPeriodMetrics(subscription.periods),
    [subscription.periods],
  );

  const {
    entries,
    startDate,
    expirationDate,
    totalDays,
    elapsedDays,
    remainingDays,
    progressPercent,
    isExpired,
    periodsCount,
    activeEntry,
  } = metrics;

  if (!expirationDate) {
    return (
      <section
        aria-labelledby={titleId}
        className={["flex flex-col gap-4", className]
          .filter(Boolean)
          .join(" ")}
      >
        <header className="flex flex-col gap-1.5">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-accent">
            <CalendarClock size={13} aria-hidden="true" />
            Period metrics
          </span>
          <h2
            id={titleId}
            className="text-xl font-bold tracking-tight text-text-primary sm:text-2xl"
          >
            Membership timeline
          </h2>
        </header>
        <p
          role="status"
          className="rounded-2xl border border-border bg-surface-raised px-5 py-6 text-center text-sm text-text-secondary"
        >
          No dated periods are available for this membership yet.
        </p>
      </section>
    );
  }

  const expirationTone: MetricTone = isExpired
    ? "danger"
    : remainingDays <= 7
      ? "warning"
      : "success";

  const expirationHint = isExpired
    ? `Ended ${formatPeriodMetricDays(Math.abs(remainingDays))} ago`
    : remainingDays === 0
      ? "The membership ends today"
      : `Ends in ${formatPeriodMetricDays(remainingDays)}`;

  const remainingHint = isExpired
    ? "The membership period is over"
    : remainingDays === 0
      ? "Today is the last day"
      : "Days left before it ends";

  return (
    <section
      aria-labelledby={titleId}
      className={["flex flex-col gap-4", className].filter(Boolean).join(" ")}
    >
      <header className="flex flex-col gap-1.5">
        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-accent">
          <CalendarClock size={13} aria-hidden="true" />
          Period metrics
        </span>
        <h2
          id={titleId}
          className="text-xl font-bold tracking-tight text-text-primary sm:text-2xl"
        >
          Membership timeline
        </h2>
        <p className="max-w-2xl text-sm leading-relaxed text-text-secondary">
          Dates calculated from the registered periods of your membership.
        </p>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricTile
          label="Expiration date"
          value={formatPeriodMetricDate(expirationDate)}
          hint={expirationHint}
          Icon={CalendarCheck2}
          tone={expirationTone}
        />
        <MetricTile
          label="Days until it ends"
          value={
            isExpired ? "Expired" : formatPeriodMetricDays(remainingDays)
          }
          hint={remainingHint}
          Icon={Hourglass}
          tone={expirationTone}
        />
        <MetricTile
          label="Membership days"
          value={formatPeriodMetricDays(totalDays)}
          hint={`${formatPeriodMetricDays(elapsedDays)} elapsed`}
          Icon={CalendarDays}
          tone="accent"
        />
        <MetricTile
          label="Billing periods"
          value={String(periodsCount)}
          hint={
            activeEntry
              ? `Active period: ${formatMembershipLabel(activeEntry.periodType)}`
              : "No active period right now"
          }
          Icon={CalendarRange}
          tone="neutral"
        />
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border border-border bg-surface-raised p-4 shadow-sm sm:p-5">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-text-tertiary">
            Membership progress
          </p>
          <span className="text-xs font-semibold text-text-primary">
            {progressPercent}%
          </span>
        </div>
        <div
          role="progressbar"
          aria-label="Membership progress"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progressPercent}
          className="h-2 w-full overflow-hidden rounded-full bg-surface-over"
        >
          <div
            aria-hidden="true"
            className="h-full rounded-full bg-linear-to-r from-accent to-popover-blue transition-[width] duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-medium text-text-tertiary">
          <span>Started {formatPeriodMetricDate(startDate)}</span>
          <span>
            {isExpired ? "Ended" : "Ends"}{" "}
            {formatPeriodMetricDate(expirationDate)}
          </span>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-surface-raised shadow-sm">
        <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3 sm:px-5">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-text-tertiary">
            Period breakdown
          </p>
          <span className="text-[11px] font-medium text-text-tertiary">
            {formatPeriodMetricDays(totalDays)} in total
          </span>
        </div>
        <ol className="flex flex-col divide-y divide-border">
          {entries.map((entry) => {
            const state = PERIOD_STATE[entry.state];

            return (
              <li
                key={entry.key}
                className="flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5"
              >
                <div className="flex min-w-0 items-start gap-3">
                  <span
                    aria-hidden="true"
                    className={`mt-1.5 size-2 shrink-0 rounded-full ${state.dot}`}
                  />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-text-primary">
                      {formatMembershipLabel(entry.periodType)}
                    </p>
                    <p className="truncate text-xs text-text-secondary">
                      {entry.start && entry.end
                        ? `${formatPeriodMetricDate(entry.start)} → ${formatPeriodMetricDate(entry.end)}`
                        : entry.periodStr}
                    </p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2 self-start sm:self-auto">
                  <span className="text-[11px] font-medium text-text-tertiary">
                    {entry.durationDays > 0
                      ? formatPeriodMetricDays(entry.durationDays)
                      : "—"}
                  </span>
                  <Badge variant={state.badge} leading="dot">
                    {state.label}
                  </Badge>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
};

export default SubscriptionPeriodMetrics;
