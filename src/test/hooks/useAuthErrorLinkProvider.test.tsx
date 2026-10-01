import { useAuthErrorLinkProvider } from "@/features/auth/hooks/useAuthErrorLinkProvider";
import type { ApiErrorResponse } from "@/types/Types";
import { renderHook } from "@testing-library/react";
import { HttpStatusCode } from "axios";
import { describe, expect, it } from "vitest";

const renderErrorLinkProvider = (err?: ApiErrorResponse | null) =>
  renderHook(() => useAuthErrorLinkProvider(err));

describe("useAuthErrorLinkProvider suite", () => {
  it("Should return null when no error is provided", () => {
    const { result } = renderErrorLinkProvider(undefined);

    expect(result.current).toBeNull();
  });

  it("Should return null when the error is null", () => {
    const { result } = renderErrorLinkProvider(null);

    expect(result.current).toBeNull();
  });

  it("Should return null when the error carries no code or status", () => {
    const { result } = renderErrorLinkProvider({});

    expect(result.current).toBeNull();
  });

  it("Should provide the password reset link for bad credentials", () => {
    const { result } = renderErrorLinkProvider({
      code: "NO_ACCESS",
      status: HttpStatusCode.Unauthorized,
    });

    expect(result.current).toEqual({
      to: "/auth/password-reset",
      label: "Forgot your password?",
      ariaLabel: "Link to password reset page.",
    });
  });

  it("Should provide the activation link for a deactivated account", () => {
    const { result } = renderErrorLinkProvider({
      code: "VALIDATION_OPERATION",
      status: HttpStatusCode.Conflict,
    });

    expect(result.current).toEqual({
      to: "/auth/activation",
      label: "Activate account here!",
      ariaLabel: "Link to activation page.",
    });
  });

  it("Should provide the verification link for a non-verified account", () => {
    const { result } = renderErrorLinkProvider({
      code: "VERIFICATION_OPERATION",
      status: HttpStatusCode.Forbidden,
    });

    expect(result.current).toEqual({
      to: "/auth/verification",
      label: "Verify account.",
      ariaLabel: "Link to verification page.",
    });
  });

  it("Should provide the verification link when re-register finds an unverified account", () => {
    const { result } = renderErrorLinkProvider({
      code: "NOT_FOUND_OPERATION",
      status: HttpStatusCode.NotFound,
    });

    expect(result.current).toEqual({
      to: "/auth/verification",
      label: "Verify account.",
      ariaLabel: "Link to verification page.",
    });
  });

  it("Should return null when a known code arrives with an unexpected status", () => {
    const { result } = renderErrorLinkProvider({
      code: "NO_ACCESS",
      status: HttpStatusCode.Forbidden,
    });

    expect(result.current).toBeNull();
  });

  it("Should return null when a known status arrives with an unknown code", () => {
    const { result } = renderErrorLinkProvider({
      code: "UNKNOWN_OPERATION",
      status: HttpStatusCode.Unauthorized,
    });

    expect(result.current).toBeNull();
  });

  it("Should return null for an unrelated error", () => {
    const { result } = renderErrorLinkProvider({
      code: "RATE_LIMITED",
      message: "Too many requests",
      status: HttpStatusCode.TooManyRequests,
    });

    expect(result.current).toBeNull();
  });

  it("Should still resolve when a matching error carries extra fields", () => {
    const { result } = renderErrorLinkProvider({
      code: "VERIFICATION_OPERATION",
      message: "Account is not verified",
      path: "/auth/signIn",
      status: HttpStatusCode.Forbidden,
    });

    expect(result.current).toEqual({
      to: "/auth/verification",
      label: "Verify account.",
      ariaLabel: "Link to verification page.",
    });
  });
});
