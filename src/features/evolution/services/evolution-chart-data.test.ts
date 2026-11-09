// @vitest-environment node
// Pure unit test: no DOM access, so it skips the jsdom setup cost.
import {
  formatEvolutionCount,
  formatEvolutionMoney,
  getEvolutionYearOptions,
  resolveEvolutionError,
} from "@/features/evolution/services/evolution-chart-data";

describe("evolution chart data", () => {
  it("formats counts and money", () => {
    expect(formatEvolutionCount(1234)).toBe("1,234");
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
