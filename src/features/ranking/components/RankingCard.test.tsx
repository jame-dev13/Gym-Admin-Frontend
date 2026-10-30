import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { RankingCard } from "./RankingCard";
import type { RankingCardProps } from "./RankingCardTypes";
import { RankingEntry } from "./RankingEntry";

type Item = { id: string; label: string; count: number; rank: number };

const items: Item[] = [
  { id: "annual", label: "Annual", count: 12, rank: 1 },
  { id: "monthly", label: "Monthly", count: 8, rank: 2 },
];

const renderCard = (overrides: Partial<RankingCardProps<Item>> = {}) =>
  render(
    <RankingCard
      title="Membership ranking"
      description="Plans ranked by subscriptions."
      items={items}
      getItemKey={(item) => item.id}
      renderItem={(item) => (
        <RankingEntry
          rank={item.rank}
          label={item.label}
          description="Membership plan"
          value={item.count}
          valueLabel="subscriptions"
        />
      )}
      {...overrides}
    />,
  );

describe("RankingCard", () => {
  it("renders the contract header and every item through renderItem", () => {
    renderCard();

    expect(
      screen.getByRole("heading", { level: 2, name: "Membership ranking" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Plans ranked by subscriptions."),
    ).toBeInTheDocument();
    expect(screen.getByText("Annual")).toBeInTheDocument();
    expect(screen.getByText("Monthly")).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
  });

  it("shows a loading state while the first request is pending", () => {
    renderCard({ items: [], isLoading: true });

    expect(
      screen.getByRole("status", { name: "Loading ranking" }),
    ).toBeInTheDocument();
    expect(screen.queryByRole("listitem")).not.toBeInTheDocument();
  });

  it("shows the empty message when there are no items", () => {
    renderCard({ items: [], emptyMessage: "Nothing to rank yet." });

    expect(screen.getByRole("status")).toHaveTextContent("Nothing to rank yet.");
  });

  it("shows the error message instead of the ranking", () => {
    renderCard({ errorMessage: "Ranking could not be loaded." });

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Ranking could not be loaded.",
    );
    expect(screen.queryByRole("listitem")).not.toBeInTheDocument();
  });
});
