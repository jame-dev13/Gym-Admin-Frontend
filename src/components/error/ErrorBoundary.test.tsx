import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ErrorBoundary } from "./ErrorBoundary";

const Boom = () => {
  throw new Error("Boom");
};

describe("ErrorBoundary", () => {
  it("renders children when there is no error", () => {
    render(
      <ErrorBoundary>
        <p>All good</p>
      </ErrorBoundary>,
    );

    expect(screen.getByText("All good")).toBeInTheDocument();
  });

  it("renders a minimal retry panel when a child throws", () => {
    const consoleSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <Boom />
      </ErrorBoundary>,
    );

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Something went wrong" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Try again" }),
    ).toBeInTheDocument();

    consoleSpy.mockRestore();
  });

  it("renders a custom fallback when provided", () => {
    const consoleSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    render(
      <ErrorBoundary fallback={<p>Custom fallback</p>}>
        <Boom />
      </ErrorBoundary>,
    );

    expect(screen.getByText("Custom fallback")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Try again" }),
    ).not.toBeInTheDocument();

    consoleSpy.mockRestore();
  });

  it("calls onError when a child throws", () => {
    const onError = vi.fn();

    render(
      <ErrorBoundary onError={onError}>
        <Boom />
      </ErrorBoundary>,
    );

    expect(onError).toHaveBeenCalledTimes(1);
    expect(onError.mock.calls[0]?.[0]).toBeInstanceOf(Error);
  });

  it("resets local state and calls onReset when retry is clicked", async () => {
    const user = userEvent.setup();
    const onReset = vi.fn();
    const consoleSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});
    let shouldThrow = true;

    const Flaky = () => {
      if (shouldThrow) {
        throw new Error("Flaky boom");
      }
      return <p>Recovered</p>;
    };

    render(
      <ErrorBoundary onReset={onReset}>
        <Flaky />
      </ErrorBoundary>,
    );

    expect(screen.getByRole("alert")).toBeInTheDocument();

    shouldThrow = false;
    await user.click(screen.getByRole("button", { name: "Try again" }));

    expect(onReset).toHaveBeenCalledTimes(1);
    expect(screen.getByText("Recovered")).toBeInTheDocument();

    consoleSpy.mockRestore();
  });
});
