import { ToastProvider } from "@/context/ToastProvider";
import { useToastContext } from "@/context/useToastContext";
import { useToastFactory } from "@/hooks/useToastFactory";
import type { ToastType } from "@/types/Types";
import { renderHook } from "@testing-library/react";
import { act, type ReactNode } from "react";
import { describe, expect, it } from "vitest";

const wrapper = ({ children }: { children: ReactNode }) => (
  <ToastProvider>{children}</ToastProvider>
);

const renderFactory = () =>
  renderHook(
    () => ({ factory: useToastFactory(), toast: useToastContext() }),
    { wrapper },
  );

const cases: { key: "showSuccess" | "showError" | "showWarning" | "showInfo" | "showDefault"; type: ToastType }[] = [
  { key: "showSuccess", type: "success" },
  { key: "showError", type: "error" },
  { key: "showWarning", type: "warning" },
  { key: "showInfo", type: "info" },
  { key: "showDefault", type: "default" },
];

describe("useToastFactory suite", () => {
  it("Shouldn't be undefined", () => {
    const { result } = renderFactory();

    expect(result.current.factory).toBeDefined();
  });

  it.each(cases)("Should show a $type toast via $key with message only", ({ key, type }) => {
    const { result } = renderFactory();

    act(() => result.current.factory[key]("Factory message"));

    expect(result.current.toast.isShowing).toBe(true);
    expect(result.current.toast.message).toBe("Factory message");
    expect(result.current.toast.type).toBe(type);
  });

  it("Should throw on empty message without hiding the validation in the factory", () => {
    const { result } = renderFactory();

    expect(() => act(() => result.current.factory.showError("   "))).toThrow(
      "Toast message must not be empty",
    );
  });

  it("Should keep stable helper identity across re-renders", () => {
    const { result, rerender } = renderFactory();
    const first = result.current.factory;

    rerender();
    act(() => result.current.factory.showInfo("Stable"));

    expect(result.current.factory).toBe(first);
  });

  it("Should throw when used outside a ToastProvider", () => {
    expect(() => renderHook(() => useToastFactory())).toThrow(
      "useToastContext must be used within a ToastProvider",
    );
  });
});
