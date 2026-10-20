// @vitest-environment node
// Pure unit test: no DOM access, so it skips the jsdom setup cost.
import {
  getCustomerQueryKeys,
  getQueryDomainKey,
} from "@/features/customer/services/customer-query-keys";

describe("customer query domain key", () => {
  it("returns the domain key used by the customer query keys", () => {
    const { administration, current } = getCustomerQueryKeys();
    expect(getQueryDomainKey()).toEqual(["customers"]);
    expect(administration.all()).toEqual(["administration", "customers"]);
    expect(current.all()).toEqual(["current", "customers"]);
  });
});
