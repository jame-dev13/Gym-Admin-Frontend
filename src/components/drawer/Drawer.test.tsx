import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it } from "vitest";
import { Drawer } from "./Drawer";
import type { DrawerPosition, DrawerSize } from "@/types/Types";

const Harness = ({
  position = "right",
  size = "md",
  footer,
  description,
  headerActions,
  showCloseButton,
  closeOnOverlayClick,
}: {
  position?: DrawerPosition;
  size?: DrawerSize;
  footer?: React.ReactNode;
  description?: string;
  headerActions?: React.ReactNode;
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        Open drawer
      </button>
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        title="Settings"
        position={position}
        size={size}
        footer={footer}
        description={description}
        headerActions={headerActions}
        showCloseButton={showCloseButton}
        closeOnOverlayClick={closeOnOverlayClick}
      >
        <p>Drawer body content</p>
      </Drawer>
    </>
  );
};

const renderHarness = (props?: Parameters<typeof Harness>[0]) =>
  render(<Harness {...props} />);

const positionCases: Array<[DrawerPosition, string]> = [
  ["right", "right-0"],
  ["left", "left-0"],
  ["top", "top-0"],
  ["bottom", "bottom-0"],
];

describe("Drawer", () => {
  it("renders nothing while closed", () => {
    renderHarness();

    expect(
      screen.queryByRole("dialog", { name: "Settings" }),
    ).not.toBeInTheDocument();
  });

  it("opens and exposes title, description, and body", async () => {
    const user = userEvent.setup();
    renderHarness({ description: "Manage your preferences" });

    await user.click(screen.getByRole("button", { name: "Open drawer" }));

    const dialog = screen.getByRole("dialog", { name: "Settings" });
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(
      screen.getByRole("heading", { name: "Settings" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Manage your preferences")).toBeInTheDocument();
    expect(screen.getByText("Drawer body content")).toBeInTheDocument();
  });

  it.each(positionCases)(
    "docks to the %s edge of the screen",
    async (position, anchorClass) => {
      const user = userEvent.setup();
      renderHarness({ position });

      await user.click(screen.getByRole("button", { name: "Open drawer" }));

      expect(
        screen.getByRole("dialog", { name: "Settings" }),
      ).toHaveClass(anchorClass);
    },
  );

  it("sizes the panel for side and vertical positions", async () => {
    const user = userEvent.setup();
    const { rerender } = render(<Harness position="left" size="sm" />);

    await user.click(screen.getByRole("button", { name: "Open drawer" }));
    expect(
      screen.getByRole("dialog", { name: "Settings" }),
    ).toHaveClass("w-72");

    rerender(<Harness position="top" size="lg" />);
    expect(
      screen.getByRole("dialog", { name: "Settings" }),
    ).toHaveClass("h-[32rem]");
  });

  it("closes through the close button", async () => {
    const user = userEvent.setup();
    renderHarness();

    await user.click(screen.getByRole("button", { name: "Open drawer" }));
    await user.click(screen.getByRole("button", { name: "Close dialog" }));

    expect(
      screen.queryByRole("dialog", { name: "Settings" }),
    ).not.toBeInTheDocument();
  });

  it("closes on Escape and restores focus to the trigger", async () => {
    const user = userEvent.setup();
    renderHarness();

    await user.click(screen.getByRole("button", { name: "Open drawer" }));
    expect(screen.getByRole("dialog", { name: "Settings" })).toBeInTheDocument();

    await user.keyboard("{Escape}");

    expect(
      screen.queryByRole("dialog", { name: "Settings" }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Open drawer" }),
    ).toHaveFocus();
  });

  it("closes on overlay click by default", async () => {
    const user = userEvent.setup();
    renderHarness();

    await user.click(screen.getByRole("button", { name: "Open drawer" }));
    await user.click(screen.getByTestId("drawer-overlay"));

    expect(
      screen.queryByRole("dialog", { name: "Settings" }),
    ).not.toBeInTheDocument();
  });

  it("keeps the drawer open on overlay click when disabled", async () => {
    const user = userEvent.setup();
    renderHarness({ closeOnOverlayClick: false });

    await user.click(screen.getByRole("button", { name: "Open drawer" }));
    await user.click(screen.getByTestId("drawer-overlay"));

    expect(
      screen.getByRole("dialog", { name: "Settings" }),
    ).toBeInTheDocument();
  });

  it("hides the footer region when no footer is provided", async () => {
    const user = userEvent.setup();
    renderHarness();

    await user.click(screen.getByRole("button", { name: "Open drawer" }));

    expect(screen.queryByTestId("drawer-footer")).not.toBeInTheDocument();
  });

  it("renders the footer slot when provided", async () => {
    const user = userEvent.setup();
    renderHarness({ footer: <button type="button">Save changes</button> });

    await user.click(screen.getByRole("button", { name: "Open drawer" }));

    expect(screen.getByTestId("drawer-footer")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Save changes" }),
    ).toBeInTheDocument();
  });

  it("renders header actions and hides the close button on demand", async () => {
    const user = userEvent.setup();
    renderHarness({
      headerActions: <span>Header action</span>,
      showCloseButton: false,
    });

    await user.click(screen.getByRole("button", { name: "Open drawer" }));

    expect(screen.getByText("Header action")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Close dialog" }),
    ).not.toBeInTheDocument();
  });
});
