import { render, screen } from "@testing-library/react";
import { act } from "react";
import { describe, expect, it, vi } from "vitest";
import { useRevealOnScroll } from "./useRevealOnScroll";

const Probe = () => {
  const { ref, visible } = useRevealOnScroll<HTMLDivElement>();
  return (
    <div ref={ref} data-testid="probe">
      {visible ? "visible" : "hidden"}
    </div>
  );
};

describe("useRevealOnScroll", () => {
  it("reveals immediately when IntersectionObserver is unavailable", () => {
    render(<Probe />);
    expect(screen.getByTestId("probe")).toHaveTextContent("visible");
  });

  it("reveals when the element intersects and then stops observing", async () => {
    const observe = vi.fn();
    const disconnect = vi.fn();
    let callback: IntersectionObserverCallback = () => {};
    vi.stubGlobal(
      "IntersectionObserver",
      class {
        constructor(cb: IntersectionObserverCallback) {
          callback = cb;
        }
        observe = observe;
        disconnect = disconnect;
        unobserve = vi.fn();
      },
    );

    render(<Probe />);
    expect(screen.getByTestId("probe")).toHaveTextContent("hidden");
    expect(observe).toHaveBeenCalledTimes(1);

    await act(async () => {
      callback([{ isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver);
    });

    expect(screen.getByTestId("probe")).toHaveTextContent("visible");
    expect(disconnect).toHaveBeenCalled();
    vi.unstubAllGlobals();
  });
});
