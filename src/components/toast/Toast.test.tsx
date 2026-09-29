import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useEffect } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ToastProvider } from "@/context/ToastProvider";
import { TOAST_DURATION_MS } from "@/context/ToastContext";
import { useToastContext } from "@/context/useToastContext";
import type { ToastType } from "@/types/Types";

const TYPES: ToastType[] = ["success", "error", "warning", "info", "default"];

const Harness = () => {
  const { show, hide, isShowing, type } = useToastContext();

  return (
    <>
      {TYPES.map((kind) => (
        <button
          key={kind}
          type="button"
          onClick={() => show(`Message ${kind}`, kind)}
        >
          Notify {kind}
        </button>
      ))}
      <button type="button" onClick={hide}>
        Dismiss
      </button>
      <span data-testid="toast-flag">{isShowing ? "on" : "off"}</span>
      <span data-testid="toast-kind">{type}</span>
    </>
  );
};

const renderHarness = () =>
  render(
    <ToastProvider>
      <Harness />
    </ToastProvider>,
  );

describe("Toast auto-hide", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it("hides automatically after the duration", () => {
    renderHarness();

    fireEvent.click(screen.getByRole("button", { name: "Notify success" }));
    expect(screen.getByRole("status")).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(TOAST_DURATION_MS - 1);
    });
    expect(screen.getByRole("status")).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    expect(screen.getByTestId("toast-flag")).toHaveTextContent("off");
  });

  it("restarts the timer when a new toast replaces the visible one", () => {
    renderHarness();

    fireEvent.click(screen.getByRole("button", { name: "Notify success" }));
    act(() => {
      vi.advanceTimersByTime(TOAST_DURATION_MS - 1000);
    });

    fireEvent.click(screen.getByRole("button", { name: "Notify error" }));
    act(() => {
      vi.advanceTimersByTime(TOAST_DURATION_MS - 1000);
    });
    expect(screen.getByRole("status")).toHaveTextContent("Message error");

    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("pauses the timer while hovered and resumes afterwards", () => {
    renderHarness();

    fireEvent.click(screen.getByRole("button", { name: "Notify warning" }));
    const status = screen.getByRole("status");

    fireEvent.mouseOver(status);
    act(() => {
      vi.advanceTimersByTime(TOAST_DURATION_MS);
    });
    expect(screen.getByRole("status")).toBeInTheDocument();

    fireEvent.mouseOut(status);
    act(() => {
      vi.advanceTimersByTime(TOAST_DURATION_MS);
    });
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });
});

beforeEach(() => {
  vi.useRealTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("ToastProvider state", () => {
  it("is hidden by default with type default", () => {
    renderHarness();

    expect(screen.getByTestId("toast-flag")).toHaveTextContent("off");
    expect(screen.getByTestId("toast-kind")).toHaveTextContent("default");
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("shows the message with the requested type", async () => {
    const user = userEvent.setup();
    renderHarness();

    await user.click(screen.getByRole("button", { name: "Notify success" }));

    expect(screen.getByTestId("toast-flag")).toHaveTextContent("on");
    expect(screen.getByTestId("toast-kind")).toHaveTextContent("success");
    expect(screen.getByRole("status")).toHaveTextContent("Message success");
  });

  it.each(TYPES)("renders type %s when shown", async (kind) => {
    const user = userEvent.setup();
    renderHarness();

    await user.click(screen.getByRole("button", { name: `Notify ${kind}` }));

    expect(screen.getByTestId("toast-kind")).toHaveTextContent(kind);
    expect(screen.getByRole("status")).toHaveTextContent(`Message ${kind}`);
  });

  it("hides through hide()", async () => {
    const user = userEvent.setup();
    renderHarness();

    await user.click(screen.getByRole("button", { name: "Notify info" }));
    await user.click(screen.getByRole("button", { name: "Dismiss" }));

    expect(screen.getByTestId("toast-flag")).toHaveTextContent("off");
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("throws when the message is empty", () => {
    const Bad = () => {
      const { show } = useToastContext();
      useEffect(() => {
        show("   ", "info");
      }, [show]);
      return null;
    };

    expect(() =>
      render(
        <ToastProvider>
          <Bad />
        </ToastProvider>,
      ),
    ).toThrow("Toast message must not be empty");
  });
});

describe("Toast viewport", () => {
  it("shows a progress bar while visible", async () => {
    const user = userEvent.setup();
    renderHarness();

    await user.click(screen.getByRole("button", { name: "Notify info" }));

    const progress = screen.getByTestId("toast-progress");
    expect(progress).toBeInTheDocument();
    expect(progress).toHaveStyle("width: 100%");
  });

  it("closes through the close button", async () => {
    const user = userEvent.setup();
    renderHarness();

    await user.click(screen.getByRole("button", { name: "Notify success" }));
    await user.click(screen.getByRole("button", { name: "Close toast" }));

    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("closes when Escape is pressed", async () => {
    const user = userEvent.setup();
    renderHarness();

    await user.click(screen.getByRole("button", { name: "Notify error" }));
    await user.keyboard("{Escape}");

    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("announces errors assertively and other types politely", async () => {
    const user = userEvent.setup();
    renderHarness();

    await user.click(screen.getByRole("button", { name: "Notify error" }));
    expect(screen.getByRole("status")).toHaveAttribute(
      "aria-live",
      "assertive",
    );

    await user.click(screen.getByRole("button", { name: "Notify info" }));
    expect(screen.getByRole("status")).toHaveAttribute("aria-live", "polite");
  });
});

describe("useToastContext", () => {
  it("throws when used outside of ToastProvider", () => {
    const Outside = () => {
      useToastContext();
      return null;
    };

    expect(() => render(<Outside />)).toThrow(
      "useToastContext must be used within a ToastProvider",
    );
  });
});
