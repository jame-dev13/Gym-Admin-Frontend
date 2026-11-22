import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithProviders } from "@/test/test-utils";
import { SubscriptionCallToAction } from "./SubscriptionCallToAction";

describe("SubscriptionCallToAction", () => {
  it("links customers to the home overview", () => {
    renderWithProviders(<SubscriptionCallToAction />);

    expect(
      screen.getByRole("heading", {
        name: "You do not have a membership yet",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Explore memberships" }),
    ).toHaveAttribute("href", "/home");
  });

  it("allows overriding the destination", () => {
    renderWithProviders(<SubscriptionCallToAction to="/home/plans" />);

    expect(
      screen.getByRole("link", { name: "Explore memberships" }),
    ).toHaveAttribute("href", "/home/plans");
  });
});
