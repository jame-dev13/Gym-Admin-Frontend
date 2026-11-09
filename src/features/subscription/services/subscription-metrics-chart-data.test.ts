// @vitest-environment node
// Pure unit test: no DOM access, so it skips the jsdom setup cost.
import {
  buildSubscriptionCountChartData,
  buildSubscriptionWorthChartData,
  formatMembershipLabel,
  getSubscriptionCountTotal,
  getSubscriptionWorthTotal,
} from "@/features/subscription/services/subscription-metrics-chart-data";

const countDistribution = {
  biweeklyCount: 2,
  monthlyCount: 8,
  quarterlyCount: 4,
  annualCount: 1,
} as const;

const netWorthDistribution = {
  netWorth: 12000,
  biweeklyWorth: 1200,
  monthlyWorth: 6000,
  quarterlyWorth: 3000,
  annualWorth: 1800,
} as const;

describe("subscription metrics chart data", () => {
  it("serializes the count distribution by plan", () => {
    expect(buildSubscriptionCountChartData(countDistribution)).toEqual([
      { plan: "Biweekly", count: 2 },
      { plan: "Monthly", count: 8 },
      { plan: "Quarterly", count: 4 },
      { plan: "Annual", count: 1 },
    ]);
    expect(getSubscriptionCountTotal(countDistribution)).toBe(15);
  });

  it("serializes the net worth distribution by plan", () => {
    expect(buildSubscriptionWorthChartData(netWorthDistribution)).toEqual([
      { plan: "Biweekly", worth: 1200 },
      { plan: "Monthly", worth: 6000 },
      { plan: "Quarterly", worth: 3000 },
      { plan: "Annual", worth: 1800 },
    ]);
    expect(getSubscriptionWorthTotal(netWorthDistribution)).toBe(12000);
  });

  it("formats membership labels", () => {
    expect(formatMembershipLabel("MONTHLY")).toBe("Monthly");
    expect(formatMembershipLabel("quarterly")).toBe("Quarterly");
    expect(formatMembershipLabel("")).toBe("Not available");
  });
});
