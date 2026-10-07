import { describe, expect, it } from "vitest";
import {
  validateUserCreate,
  validateUserUpdate,
} from "@/features/user/services/userFormValidation";

describe("validateUserCreate", () => {
  it("returns no errors for a valid create payload", () => {
    expect(
      validateUserCreate({
        name: "Ada Admin",
        email: "ada@gym.test",
        password: "secret12",
        authProvider: "LOCAL",
        roles: ["ADMIN"],
      }),
    ).toEqual({});
  });

  it("requires name, email, password, provider and roles", () => {
    const errors = validateUserCreate({
      name: " ",
      email: "not-an-email",
      password: "123",
      authProvider: "UNKNOWN",
      roles: [],
    });

    expect(errors.name).toMatch(/at least 2/i);
    expect(errors.email).toMatch(/valid email/i);
    expect(errors.password).toMatch(/at least 6/i);
    expect(errors.authProvider).toMatch(/provider/i);
    expect(errors.roles).toMatch(/at least one role/i);
  });
});

describe("validateUserUpdate", () => {
  it("returns no errors for a valid update payload", () => {
    expect(
      validateUserUpdate({
        name: "Ada Updated",
        email: "ada@gym.test",
        roles: ["ADMIN"],
      }),
    ).toEqual({});
  });

  it("ignores password and provider fields", () => {
    const errors = validateUserUpdate({
      name: "A",
      email: "bad",
      roles: [],
    });

    expect(Object.keys(errors).sort()).toEqual(["email", "name", "roles"]);
  });
});
