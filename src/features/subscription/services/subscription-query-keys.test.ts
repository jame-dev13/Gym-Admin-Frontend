// @vitest-environment node
// Pure unit test: no DOM access, so it skips the jsdom setup cost.
import {
  getQueryDomainKey,
  getSubscriptionQueryKeys,
} from "@/features/subscription/services/subscription-query-keys";

describe("subscription query domain key", () => {
  it("returns the domain key used by the subscription query keys", () => {
    const { administration } = getSubscriptionQueryKeys();
    expect(getQueryDomainKey()).toEqual(["subscriptions"]);
    expect(administration.all()).toEqual(["administration", "subscriptions"]);
    expect(administration.detail({ id: 1 })).toEqual([
      "administration",
      "subscriptions",
      "detail",
      1,
    ]);
    expect(administration.page({ page: 0 })).toEqual([
      "administration",
      "subscriptions",
      "page",
      { page: 0 },
    ]);
  });
});
