// @vitest-environment node
// Pure unit test: no DOM access, so it skips the jsdom setup cost.
import {
  getBillingEvolutionQueryKey,
  getCustomerEvolutionQueryKey,
  getEvolutionQueryKeys,
  getQueryDomainKey,
  getSubscriberEvolutionQueryKey,
} from "@/features/evolution/services/evolution-query-keys";
import { getCustomerQueryKeys } from "@/features/customer/services/customer-query-keys";
import { getSubscriptionQueryKeys } from "@/features/subscription/services/subscription-query-keys";
import { QueryClient } from "@tanstack/react-query";

describe("evolution query keys", () => {
  it("exposes the evolution domain key", () => {
    expect(getQueryDomainKey()).toEqual(["evolutions"]);
  });

  it("nests customer and subscriber evolution under their source domains", () => {
    expect(getCustomerEvolutionQueryKey()).toEqual(["customers", "evolutions"]);
    expect(getSubscriberEvolutionQueryKey()).toEqual([
      "subscriptions",
      "evolutions",
    ]);
  });

  it("hardcodes the payment domain for billing evolution", () => {
    expect(getBillingEvolutionQueryKey()).toEqual(["payments", "evolutions"]);
  });

  it("exposes year and direction keys below the administration root", () => {
    const { administration } = getEvolutionQueryKeys();

    expect(administration.customers.all()).toEqual([
      "administration",
      "customers",
      "evolutions",
    ]);
    expect(administration.customers.joins(2026)).toEqual([
      "administration",
      "customers",
      "evolutions",
      "joins",
      2026,
    ]);
    expect(administration.customers.downs(2026)).toEqual([
      "administration",
      "customers",
      "evolutions",
      "downs",
      2026,
    ]);
    expect(administration.subscribers.joins(2026)).toEqual([
      "administration",
      "subscriptions",
      "evolutions",
      "joins",
      2026,
    ]);
    expect(administration.billing.year(2026)).toEqual([
      "administration",
      "payments",
      "evolutions",
      "billings",
      2026,
    ]);
  });

  it("invalidates customer and subscriber evolution from their source domains", async () => {
    const client = new QueryClient();
    const { administration } = getEvolutionQueryKeys();
    const customerEvolution = administration.customers.joins(2026);
    const subscriberEvolution = administration.subscribers.downs(2026);

    client.setQueryData(customerEvolution, { content: [] });
    client.setQueryData(subscriberEvolution, { content: [] });

    await client.invalidateQueries({
      queryKey: getCustomerQueryKeys().administration.all(),
    });
    await client.invalidateQueries({
      queryKey: getSubscriptionQueryKeys().administration.all(),
    });

    expect(
      client.getQueryCache().find({ queryKey: customerEvolution })?.state
        .isInvalidated,
    ).toBe(true);
    expect(
      client.getQueryCache().find({ queryKey: subscriberEvolution })?.state
        .isInvalidated,
    ).toBe(true);
  });
});
