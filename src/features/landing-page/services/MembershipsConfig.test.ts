import { describe, expect, it } from "vitest";
import { getMembershipsConfig } from "./MembershipsConfig";

describe("getMembershipsConfig", () => {
  it("returns the four memberships with the agreed MXN prices", () => {
    const prices = Object.fromEntries(
      getMembershipsConfig().map((membership) => [membership.id, membership.priceMXN]),
    );
    expect(prices).toEqual({
      biweekly: 150,
      monthly: 300,
      quarterly: 900,
      annual: 3600,
    });
  });

  it("marks exactly one membership as featured", () => {
    const featured = getMembershipsConfig().filter((membership) => membership.featured);
    expect(featured).toHaveLength(1);
    expect(featured[0].id).toBe("monthly");
  });

  it("gives every membership a name, period label, tagline, and at least one perk", () => {
    for (const membership of getMembershipsConfig()) {
      expect(membership.name.length).toBeGreaterThan(0);
      expect(membership.periodLabel.length).toBeGreaterThan(0);
      expect(membership.tagline.length).toBeGreaterThan(0);
      expect(membership.perks.length).toBeGreaterThan(0);
    }
  });
});
