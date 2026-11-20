import {
  formatPeriodMetricDays,
  getSubscriptionPeriodMetrics,
  parsePeriodRange,
} from "@/features/subscription/services/subscription-period-metrics";
import { describe, expect, it } from "vitest";

const MONTHLY_PERIOD = {
  periodType: "MONTHLY",
  periodStr: "2026-11-01 - 2026-12-01",
} as const;

describe("parsePeriodRange", () => {
  it("parses the ISO range produced by the API", () => {
    const range = parsePeriodRange(MONTHLY_PERIOD.periodStr);

    expect(range?.start.toISOString()).toBe("2026-11-01T00:00:00.000Z");
    expect(range?.end.toISOString()).toBe("2026-12-01T00:00:00.000Z");
  });

  it("returns null when the range cannot be parsed", () => {
    expect(parsePeriodRange("October")).toBeNull();
    expect(parsePeriodRange("2026-12-01 - 2026-11-01")).toBeNull();
  });
});

describe("getSubscriptionPeriodMetrics", () => {
  it("derives the date metrics from the registered periods", () => {
    const metrics = getSubscriptionPeriodMetrics(
      [MONTHLY_PERIOD],
      new Date(2026, 10, 16),
    );

    expect(metrics.periodsCount).toBe(1);
    expect(metrics.totalDays).toBe(30);
    expect(metrics.elapsedDays).toBe(15);
    expect(metrics.remainingDays).toBe(15);
    expect(metrics.progressPercent).toBe(50);
    expect(metrics.isExpired).toBe(false);
    expect(metrics.activeEntry?.state).toBe("active");
    expect(metrics.expirationDate?.toISOString()).toBe(
      "2026-12-01T00:00:00.000Z",
    );
  });

  it("marks the membership as expired once the last period ended", () => {
    const metrics = getSubscriptionPeriodMetrics(
      [MONTHLY_PERIOD],
      new Date(2026, 11, 5),
    );

    expect(metrics.isExpired).toBe(true);
    expect(metrics.remainingDays).toBe(-4);
    expect(metrics.progressPercent).toBe(100);
    expect(metrics.activeEntry?.state).toBe("completed");
  });

  it("anchors the expiration to the last period of the array", () => {
    const metrics = getSubscriptionPeriodMetrics(
      [
        { periodType: "MONTHLY", periodStr: "2026-10-01 - 2026-11-01" },
        { periodType: "MONTHLY", periodStr: "2026-11-01 - 2026-12-01" },
      ],
      new Date(2026, 10, 16),
    );

    expect(metrics.periodsCount).toBe(2);
    expect(metrics.totalDays).toBe(61);
    expect(metrics.expirationDate?.toISOString()).toBe(
      "2026-12-01T00:00:00.000Z",
    );
    expect(metrics.activeEntry).toBe(metrics.entries[1]);
    expect(metrics.entries[0].state).toBe("completed");
    expect(metrics.activeEntry?.state).toBe("active");
  });

  it("treats the last period as active even when its dates are ahead", () => {
    const metrics = getSubscriptionPeriodMetrics(
      [
        { periodType: "MONTHLY", periodStr: "2026-11-01 - 2026-12-01" },
        { periodType: "MONTHLY", periodStr: "2026-12-01 - 2027-01-01" },
      ],
      new Date(2026, 10, 16),
    );

    expect(metrics.activeEntry).toBe(metrics.entries[1]);
    expect(metrics.activeEntry?.state).toBe("active");
    expect(metrics.expirationDate?.toISOString()).toBe(
      "2027-01-01T00:00:00.000Z",
    );
  });

  it("returns an empty model when no period can be dated", () => {
    const metrics = getSubscriptionPeriodMetrics(
      [{ periodType: "MONTH", periodStr: "October" }],
      new Date(2026, 10, 16),
    );

    expect(metrics.expirationDate).toBeNull();
    expect(metrics.totalDays).toBe(0);
    expect(metrics.entries[0].state).toBe("unknown");
  });
});

describe("formatPeriodMetricDays", () => {
  it("pluralizes the day count", () => {
    expect(formatPeriodMetricDays(1)).toBe("1 day");
    expect(formatPeriodMetricDays(30)).toBe("30 days");
  });
});
