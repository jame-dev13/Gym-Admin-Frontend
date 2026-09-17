import { useAppNavigation } from "@/hooks/useAppNavigation";
import { renderClientHook } from "@/test/hooks/test-utils";
import { act } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { navigateMock } = vi.hoisted(() => ({ navigateMock: vi.fn() }));

vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router-dom")>();
  return { ...actual, useNavigate: () => navigateMock };
});

const NOT_FOUND = "/not-found";

const renderNavigation = (to?: string, fallback?: string) =>
  renderClientHook(() => useAppNavigation(to, fallback));

describe("useAppNavigation suite", () => {
  beforeEach(() => {
    navigateMock.mockClear();
  });

  it("Shouldn't be undefined", async () => {
    const { result } = renderNavigation("/suite");

    expect(result).toBeDefined();
    expect(result.current).toBeDefined();
  });

  it("Should handle nullish param value's with fallback navigation to /not-found", async () => {
    const { result } = renderNavigation(undefined);

    act(() => result.current.nav());

    expect(navigateMock).toHaveBeenCalledWith(NOT_FOUND);
  });

  it("Should returns the nav() function.", async () => {
    const { result } = renderNavigation("/suite");

    expect(typeof result.current.nav).toBe("function");

    act(() => result.current.nav());

    expect(navigateMock).toHaveBeenCalledWith("/suite");
  });

  it("Should returns the fallback() function", async () => {
    const { result } = renderNavigation("/suite", "/fallback");

    expect(typeof result.current.fallback).toBe("function");

    act(() => result.current.fallback());

    expect(navigateMock).toHaveBeenCalledWith("/fallback");
  });

  it("Should returns the back() function", async () => {
    const { result } = renderNavigation("/suite");

    expect(typeof result.current.back).toBe("function");

    act(() => result.current.back());

    expect(navigateMock).toHaveBeenCalledWith(-1);
  });
});
