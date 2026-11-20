import type { Period } from "@/features/subscription/types";

const DAY_IN_MS = 86_400_000;
const DATE_ONLY_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;
const ISO_DATE_PATTERN = /\d{4}-\d{2}-\d{2}/g;

/**
 * Where a period sits relative to today.
 */
export type SubscriptionPeriodState =
  | "completed"
  | "active"
  | "upcoming"
  | "unknown";

export type SubscriptionPeriodEntry = Readonly<{
  key: string;
  periodType: string;
  periodStr: string;
  start: Date | null;
  end: Date | null;
  durationDays: number;
  state: SubscriptionPeriodState;
}>;

export type SubscriptionPeriodMetricsModel = Readonly<{
  entries: readonly SubscriptionPeriodEntry[];
  /**
   * Last item of the `periods` array: the API appends every renewal, so this
   * is the period currently in force.
   */
  activeEntry: SubscriptionPeriodEntry | null;
  startDate: Date | null;
  expirationDate: Date | null;
  totalDays: number;
  elapsedDays: number;
  remainingDays: number;
  progressPercent: number;
  isExpired: boolean;
  periodsCount: number;
}>;

const DATE_FORMATTER = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeZone: "UTC",
});

const toUtcDate = (value: string): Date | null => {
  const match = DATE_ONLY_PATTERN.exec(value.trim());
  if (!match) return null;

  const [, year, month, day] = match;
  const date = new Date(
    Date.UTC(Number(year), Number(month) - 1, Number(day)),
  );

  return Number.isNaN(date.getTime()) ? null : date;
};

const startOfTodayUtc = (now: Date): Date =>
  new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));

const daysBetween = (from: Date, to: Date): number =>
  Math.round((to.getTime() - from.getTime()) / DAY_IN_MS);

const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max);

/**
 * Parses the `"<start> - <end>"` range produced by the API for a period.
 *
 * The range is matched by ISO dates instead of splitting on `-`, because the
 * dates themselves contain hyphens (`2026-11-17 - 2026-12-17`).
 */
export const parsePeriodRange = (
  periodStr: string,
): Readonly<{ start: Date; end: Date }> | null => {
  const matches = periodStr.match(ISO_DATE_PATTERN);
  if (!matches || matches.length < 2) return null;

  const start = toUtcDate(matches[0]);
  const end = toUtcDate(matches[1]);
  if (!start || !end || end.getTime() < start.getTime()) return null;

  return { start, end };
};

const resolveState = (
  start: Date,
  end: Date,
  today: Date,
  isActivePeriod: boolean,
): SubscriptionPeriodState => {
  if (end.getTime() < today.getTime()) return "completed";
  if (isActivePeriod) return "active";
  return start.getTime() > today.getTime() ? "upcoming" : "completed";
};

/**
 * Derives date metrics for a subscription from its registered periods.
 *
 * The API appends every renewal, so the last item of `periods` is the period
 * currently in force. The expiration date and remaining days are anchored to
 * that period instead of searching for a date match.
 *
 * Every calculation is done on UTC midnights so day counts stay exact and do
 * not drift with daylight-saving transitions.
 */
export const getSubscriptionPeriodMetrics = (
  periods: readonly Period[],
  now: Date = new Date(),
): SubscriptionPeriodMetricsModel => {
  const today = startOfTodayUtc(now);

  const entries: SubscriptionPeriodEntry[] = periods.map((period, index) => {
    const range = parsePeriodRange(period.periodStr);
    const isActivePeriod = index === periods.length - 1;

    return {
      key: `${period.periodType}-${index}`,
      periodType: period.periodType,
      periodStr: period.periodStr,
      start: range?.start ?? null,
      end: range?.end ?? null,
      durationDays: range ? daysBetween(range.start, range.end) : 0,
      state: range
        ? resolveState(range.start, range.end, today, isActivePeriod)
        : ("unknown" as const),
    };
  });

  const activeEntry = entries.length > 0 ? entries[entries.length - 1] : null;

  const startTimestamps = entries.flatMap((entry) =>
    entry.start ? [entry.start.getTime()] : [],
  );
  const endTimestamps = entries.flatMap((entry) =>
    entry.end ? [entry.end.getTime()] : [],
  );

  const startDate =
    startTimestamps.length > 0 ? new Date(Math.min(...startTimestamps)) : null;
  const expirationDate =
    activeEntry?.end ??
    (endTimestamps.length > 0 ? new Date(Math.max(...endTimestamps)) : null);

  if (!startDate || !expirationDate) {
    return {
      entries,
      activeEntry,
      startDate: null,
      expirationDate: null,
      totalDays: 0,
      elapsedDays: 0,
      remainingDays: 0,
      progressPercent: 0,
      isExpired: false,
      periodsCount: entries.length,
    };
  }

  const totalDays = Math.max(0, daysBetween(startDate, expirationDate));
  const elapsedDays = clamp(daysBetween(startDate, today), 0, totalDays);
  const remainingDays = daysBetween(today, expirationDate);
  const progressPercent =
    totalDays > 0
      ? clamp(Math.round((elapsedDays / totalDays) * 100), 0, 100)
      : 0;

  return {
    entries,
    activeEntry,
    startDate,
    expirationDate,
    totalDays,
    elapsedDays,
    remainingDays,
    progressPercent,
    isExpired: remainingDays < 0,
    periodsCount: entries.length,
  };
};

export const formatPeriodMetricDate = (date: Date | null): string =>
  date ? DATE_FORMATTER.format(date) : "Not available";

export const formatPeriodMetricDays = (days: number): string =>
  `${days} ${days === 1 ? "day" : "days"}`;
