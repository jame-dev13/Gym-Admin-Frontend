import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { beforeEach, describe, expect, it } from "vitest";
import type {
  MembershipRankingResponse,
  PeriodRankingResponse,
} from "@/features/ranking/types";
import { server } from "@/test/mocks/server";
import { renderWithProviders } from "@/test/test-utils";
import { RankingLayout } from "./RankingLayout";

const API_BASE_URL = import.meta.env.VITE_BASE as string;
const RANKING_BASE = `${import.meta.env.VITE_ADMINISTRATION_V1}/metrics/subs/rankings`;

const membershipRanking: MembershipRankingResponse = {
  content: [
    { membership: "ANNUAL", subsCount: 12, rank: 1 },
    { membership: "MONTHLY", subsCount: 8, rank: 2 },
  ],
};

const periodRanking: PeriodRankingResponse = {
  content: [
    {
      year: 2026,
      totalPerYear: [
        {
          period: "JAN - FEB",
          subscriptionCount: 9,
          subscriptionType: "MONTHLY",
          rank: 1,
        },
      ],
    },
    {
      year: 2025,
      totalPerYear: [
        {
          period: "MAR - APR",
          subscriptionCount: 4,
          subscriptionType: "QUARTERLY",
          rank: 1,
        },
      ],
    },
  ],
};

beforeEach(() => {
  server.use(
    http.get(`${API_BASE_URL}${RANKING_BASE}/memberships`, () =>
      HttpResponse.json(membershipRanking),
    ),
    http.get(`${API_BASE_URL}${RANKING_BASE}/periods`, () =>
      HttpResponse.json(periodRanking),
    ),
  );
});

describe("RankingLayout", () => {
  it("renders both concrete ranking cards with their formatted rows", async () => {
    renderWithProviders(<RankingLayout />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Subscription rankings",
      }),
    ).toBeInTheDocument();

    const membershipCard = await screen.findByRole("region", {
      name: "Membership ranking",
    });
    expect(await within(membershipCard).findByText("Annual")).toBeInTheDocument();
    expect(within(membershipCard).getByText("12")).toBeInTheDocument();

    const periodCard = screen.getByRole("region", { name: "Period ranking" });
    expect(await within(periodCard).findByText("Jan - Feb")).toBeInTheDocument();
    expect(within(periodCard).getByText("Monthly")).toBeInTheDocument();
    expect(within(periodCard).getByText("9")).toBeInTheDocument();
    expect(
      within(periodCard).getByLabelText("Filter period ranking by year"),
    ).toHaveValue("2026");
  });

  it("switches the period ranking rows when another year is selected", async () => {
    const user = userEvent.setup();
    renderWithProviders(<RankingLayout />);

    const periodCard = await screen.findByRole("region", {
      name: "Period ranking",
    });
    await within(periodCard).findByText("Jan - Feb");

    await user.selectOptions(
      within(periodCard).getByLabelText("Filter period ranking by year"),
      "2025",
    );

    expect(within(periodCard).getByText("Mar - Apr")).toBeInTheDocument();
    expect(within(periodCard).getByText("Quarterly")).toBeInTheDocument();
    expect(within(periodCard).getByText("4")).toBeInTheDocument();
    expect(within(periodCard).queryByText("Jan - Feb")).not.toBeInTheDocument();
  });
});
