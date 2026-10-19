import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { Popover } from "./Popover";

const rect = (values: Partial<DOMRect>): DOMRect =>
  ({
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: 0,
    height: 0,
    x: 0,
    y: 0,
    toJSON: () => ({}),
    ...values,
  }) as DOMRect;

const Harness = ({ onClose }: { onClose: () => void }) => {
  const [anchor, setAnchor] = useState<HTMLButtonElement | null>(null);

  return (
    <>
      <button ref={setAnchor} type="button" data-testid="anchor">
        Anchor
      </button>
      {anchor ? (
        <Popover anchor={anchor} label="Member details" onClose={onClose}>
          <p>Only the given data</p>
        </Popover>
      ) : null}
    </>
  );
};

const renderHarness = () => {
  const onClose = vi.fn();
  render(<Harness onClose={onClose} />);
  return { onClose };
};

const mockRects = (anchorRect: DOMRect, panelRect: DOMRect) => {
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(
    function (this: HTMLElement) {
      return this.getAttribute("role") === "dialog" ? panelRect : anchorRect;
    },
  );
};

const getPanel = () => screen.getByRole("dialog", { name: "Member details" });

describe("Popover", () => {
  it("renders the panel content with an accessible name", () => {
    renderHarness();

    expect(getPanel()).toHaveTextContent("Only the given data");
  });

  it("anchors the panel below the trigger when there is room", () => {
    mockRects(
      rect({ top: 100, bottom: 130, left: 40, width: 90, height: 30 }),
      rect({ width: 280, height: 200 }),
    );
    renderHarness();

    expect(getPanel()).toHaveAttribute("data-placement", "below");
    expect(getPanel().style.top).toBe("138px");
    expect(getPanel().style.left).toBe("40px");
  });

  it("flips the panel above when there is no room below", () => {
    mockRects(
      rect({ top: 700, bottom: 730, left: 40, width: 90, height: 30 }),
      rect({ width: 280, height: 200 }),
    );
    renderHarness();

    expect(getPanel()).toHaveAttribute("data-placement", "above");
    expect(getPanel().style.top).toBe("492px");
  });

  it("clamps the panel inside the viewport horizontally", () => {
    mockRects(
      rect({ top: 100, bottom: 130, left: 1000, width: 90, height: 30 }),
      rect({ width: 280, height: 200 }),
    );
    renderHarness();

    expect(getPanel().style.left).toBe("736px");
  });

  it("moves focus into the panel on open", () => {
    renderHarness();

    expect(getPanel()).toHaveFocus();
  });

  it("closes on Escape and returns focus to the anchor", async () => {
    const user = userEvent.setup();
    const { onClose } = renderHarness();

    await user.keyboard("{Escape}");

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId("anchor")).toHaveFocus();
  });

  it("closes on an outside pointer press", async () => {
    const user = userEvent.setup();
    const { onClose } = renderHarness();

    await user.click(document.body);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("does not close when the panel itself is pressed", async () => {
    const user = userEvent.setup();
    const { onClose } = renderHarness();

    await user.click(screen.getByText("Only the given data"));

    expect(onClose).not.toHaveBeenCalled();
  });
});
