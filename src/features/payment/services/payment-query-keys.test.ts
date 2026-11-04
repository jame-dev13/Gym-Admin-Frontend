// @vitest-environment node
// Pure unit test: no DOM access, so it skips the jsdom setup cost.
import {
  getPaymentQueryKeys,
  getQueryDomainKey,
} from "@/features/payment/services/payment-query-keys";

describe("payment query domain key", () => {
  it("returns the domain key used by the payment query keys", () => {
    const { administration } = getPaymentQueryKeys();

    expect(getQueryDomainKey()).toEqual(["payments"]);
    expect(administration.all()).toEqual(["administration", "payments"]);
    expect(administration.page({ page: 0 })).toEqual([
      "administration",
      "payments",
      "page",
      { page: 0 },
    ]);
  });

  it("exposes the payment metrics below the payment domain", () => {
    const { administration } = getPaymentQueryKeys();

    expect(administration.metrics()).toEqual([
      "administration",
      "payments",
      "metrics",
    ]);
    expect(administration.annualResume()).toEqual([
      "administration",
      "payments",
      "metrics",
      "resume",
    ]);
    expect(administration.investmentEvolution()).toEqual([
      "administration",
      "payments",
      "metrics",
      "evolution",
    ]);
  });
});
