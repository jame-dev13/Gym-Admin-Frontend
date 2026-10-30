import {
  useGetMembershipRanking,
  useGetPeriodRanking,
} from "@/features/ranking/hooks/useFetchRanking";
import { getRankingQueryKeys } from "@/features/ranking/services/ranking-query-keys";
import type {
  MembershipRankingResponse,
  PeriodRankingResponse,
} from "@/features/ranking/types";
import { server } from "@/test/mocks/server";
import { waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { beforeEach, describe, expect, it } from "vitest";
import { API_BASE_URL, renderClientHook } from "./test-utils";

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
        {
          period: "MAR - APR",
          subscriptionCount: 5,
          subscriptionType: "BIWEEKLY",
          rank: 2,
        },
      ],
    },
  ],
};

const errorBody = { message: "Ranking could not be loaded", status: 500 };

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

describe("useGetMembershipRanking", () => {
  it("returns the membership ranking wrapped with its HTTP status", async () => {
    const { client, result } = renderClientHook(() => useGetMembershipRanking());

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual({
      data: membershipRanking,
      status: 200,
    });
    expect(client.getQueryCache().getAll()[0]?.queryKey).toEqual([
      ...getRankingQueryKeys().administration.membership(),
    ]);
  });

  it("surfaces the API error response on failed requests", async () => {
    server.use(
      http.get(`${API_BASE_URL}${RANKING_BASE}/memberships`, () =>
        HttpResponse.json(errorBody, { status: 500 }),
      ),
    );
    const { result } = renderClientHook(() => useGetMembershipRanking());

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toMatchObject(errorBody);
  });
});

describe("useGetPeriodRanking", () => {
  it("returns the period ranking wrapped with its HTTP status", async () => {
    const { client, result } = renderClientHook(() => useGetPeriodRanking());

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual({ data: periodRanking, status: 200 });
    expect(client.getQueryCache().getAll()[0]?.queryKey).toEqual([
      ...getRankingQueryKeys().administration.period(),
    ]);
  });
});
