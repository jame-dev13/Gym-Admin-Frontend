import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it } from "vitest";
import { Modal } from "./Modal";

const Harness = ({
  description,
  showCloseButton,
  closeOnOverlayClick,
}: {
  description?: string;
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        Open modal
      </button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Settings"
        description={description}
        showCloseButton={showCloseButton}
        closeOnOverlayClick={closeOnOverlayClick}
      >
        <p>Modal body content</p>
      </Modal>
    </>
  );
};

const renderHarness = (props?: Parameters<typeof Harness>[0]) =>
  render(<Harness {...props} />);

describe("Modal", () => {
  it("renders nothing while closed", () => {
    renderHarness();

    expect(
      screen.queryByRole("dialog", { name: "Settings" }),
    ).not.toBeInTheDocument();
  });

  it("opens and exposes title, description, and content", async () => {
    const user = userEvent.setup();
    renderHarness({ description: "Manage your preferences" });

    await user.click(screen.getByRole("button", { name: "Open modal" }));

    const dialog = screen.getByRole("dialog", { name: "Settings" });
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(
      screen.getByRole("heading", { name: "Settings" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Manage your preferences")).toBeInTheDocument();
    expect(screen.getByText("Modal body content")).toBeInTheDocument();
  });

  it("closes through the close button", async () => {
    const user = userEvent.setup();
    renderHarness();

    await user.click(screen.getByRole("button", { name: "Open modal" }));
    await user.click(screen.getByRole("button", { name: "Close dialog" }));

    expect(
      screen.queryByRole("dialog", { name: "Settings" }),
    ).not.toBeInTheDocument();
  });

  it("closes when the overlay is clicked", async () => {
    const user = userEvent.setup();
    renderHarness();

    await user.click(screen.getByRole("button", { name: "Open modal" }));
    await user.click(screen.getByTestId("modal-overlay"));

    expect(
      screen.queryByRole("dialog", { name: "Settings" }),
    ).not.toBeInTheDocument();
  });

  it("keeps the modal open on overlay click when disabled", async () => {
    const user = userEvent.setup();
    renderHarness({ closeOnOverlayClick: false });

    await user.click(screen.getByRole("button", { name: "Open modal" }));
    await user.click(screen.getByTestId("modal-overlay"));

    expect(
      screen.getByRole("dialog", { name: "Settings" }),
    ).toBeInTheDocument();
  });

  it("does not close when the dialog panel itself is clicked", async () => {
    const user = userEvent.setup();
    renderHarness();

    await user.click(screen.getByRole("button", { name: "Open modal" }));
    await user.click(screen.getByText("Modal body content"));

    expect(
      screen.getByRole("dialog", { name: "Settings" }),
    ).toBeInTheDocument();
  });

  it("closes when Escape is pressed", async () => {
    const user = userEvent.setup();
    renderHarness();

    await user.click(screen.getByRole("button", { name: "Open modal" }));
    await user.keyboard("{Escape}");

    expect(
      screen.queryByRole("dialog", { name: "Settings" }),
    ).not.toBeInTheDocument();
  });

  it("moves focus into the dialog on open and restores it on close", async () => {
    const user = userEvent.setup();
    renderHarness();

    const trigger = screen.getByRole("button", { name: "Open modal" });
    await user.click(trigger);

    expect(
      screen.getByRole("button", { name: "Close dialog" }),
    ).toHaveFocus();

    await user.keyboard("{Escape}");

    expect(trigger).toHaveFocus();
  });

  it("hides the close button on demand", async () => {
    const user = userEvent.setup();
    renderHarness({ showCloseButton: false });

    await user.click(screen.getByRole("button", { name: "Open modal" }));

    expect(
      screen.queryByRole("button", { name: "Close dialog" }),
    ).not.toBeInTheDocument();
  });
});
