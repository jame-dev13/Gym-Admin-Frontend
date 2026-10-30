// @vitest-environment node
// Pure unit test: no DOM access, so it skips the jsdom setup cost.
import {
  getQueryDomainKey,
  getRankingQueryKeys,
} from "@/features/ranking/services/ranking-query-keys";
import { getSubscriptionQueryKeys } from "@/features/subscription/services/subscription-query-keys";
import { QueryClient } from "@tanstack/react-query";

describe("ranking query keys", () => {
  it("nests the ranking domain under the subscription domain", () => {
    expect(getQueryDomainKey()).toEqual(["subscriptions", "ranking"]);
  });

  it("exposes membership and period keys below the administration root", () => {
    const { administration } = getRankingQueryKeys();

    expect(administration.all()).toEqual([
      "administration",
      "subscriptions",
      "ranking",
    ]);
    expect(administration.membership()).toEqual([
      "administration",
      "subscriptions",
      "ranking",
      "memberships",
    ]);
    expect(administration.period()).toEqual([
      "administration",
      "subscriptions",
      "ranking",
      "periods",
    ]);
  });

  it("shares the subscription prefix so subscription mutations invalidate rankings", () => {
    const subscriptionKey = getSubscriptionQueryKeys().administration.all();
    const rankingKey = getRankingQueryKeys().administration.all();

    expect(rankingKey.slice(0, subscriptionKey.length)).toEqual(subscriptionKey);
    expect(rankingKey.length).toBeGreaterThan(subscriptionKey.length);
  });

  it("invalidates every ranking query when the subscription key is invalidated", async () => {
    const client = new QueryClient();
    const rankingKey = getRankingQueryKeys().administration.membership();
    client.setQueryData(rankingKey, { content: [] });

    await client.invalidateQueries({
      queryKey: getSubscriptionQueryKeys().administration.all(),
    });

    expect(
      client.getQueryCache().find({ queryKey: rankingKey })?.state.isInvalidated,
    ).toBe(true);
  });
});
