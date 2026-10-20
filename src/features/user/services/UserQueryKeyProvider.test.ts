// @vitest-environment node
// Pure unit test: no DOM access, so it skips the jsdom setup cost.
import {
  getQueryDomainKey,
  userQueryKeyProvider,
} from "@/features/user/services/UserQueryKeyProvider";

describe("user query domain key", () => {
  it("returns the domain key used by the user query keys", () => {
    expect(getQueryDomainKey()).toEqual(["user"]);
    expect(userQueryKeyProvider.administration.all()).toEqual([
      "administration",
      "user",
    ]);
  });
});
