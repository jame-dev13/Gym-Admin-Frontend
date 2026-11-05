// @vitest-environment node
// Pure unit test: no DOM access, so it skips the jsdom setup cost.
import {
  formatEvolutionCount,
  formatEvolutionMoney,
  formatSignedEvolutionCount,
  getEvolutionYearOptions,
  mergeEvolutionSeries,
  resolveEvolutionError,
  sumEvolutionValues,
  toBillingChartData,
} from "@/features/evolution/services/evolution-chart-data";

describe("evolution chart data", () => {
  it("merges joins and downs by month", () => {
    const data = mergeEvolutionSeries(
      {
        dataKey: "joins",
        points: [
          { month: "Jan", evolutionValue: 4 },
          { month: "Feb", evolutionValue: 6 },
        ],
      },
      {
        dataKey: "downs",
        points: [
          { month: "Jan", evolutionValue: 1 },
          { month: "Feb", evolutionValue: 3 },
        ],
      },
    );

    expect(data).toEqual([
      { month: "Jan", joins: 4, downs: 1 },
      { month: "Feb", joins: 6, downs: 3 },
    ]);
  });

  it("maps billing evolution to chart data", () => {
    expect(
      toBillingChartData({
        content: [
          { month: "Jan", total: 1200 },
          { month: "Feb", total: 1800 },
        ],
      }),
    ).toEqual([
      { month: "Jan", total: 1200 },
      { month: "Feb", total: 1800 },
    ]);
    expect(toBillingChartData(undefined)).toEqual([]);
  });

  it("sums evolution values", () => {
    expect(
      sumEvolutionValues([
        { month: "Jan", evolutionValue: 4 },
        { month: "Feb", evolutionValue: 6 },
      ]),
    ).toBe(10);
  });

  it("formats counts, signed counts, and money", () => {
    expect(formatEvolutionCount(1234)).toBe("1,234");
    expect(formatSignedEvolutionCount(12)).toBe("+12");
    expect(formatSignedEvolutionCount(-3)).toBe("-3");
    expect(formatEvolutionMoney(1500)).toContain("1,500");
  });

  it("builds descending year options", () => {
    expect(getEvolutionYearOptions(2026, 3)).toEqual([2026, 2025, 2024]);
    expect(getEvolutionYearOptions(2026, 0)).toEqual([2026]);
  });

  it("resolves API errors with a fallback", () => {
    expect(resolveEvolutionError(undefined, "fallback")).toBeNull();
    expect(resolveEvolutionError({ message: "boom" }, "fallback")).toBe("boom");
    expect(resolveEvolutionError({ error: "bad" }, "fallback")).toBe("bad");
    expect(resolveEvolutionError({}, "fallback")).toBe("fallback");
  });
});
