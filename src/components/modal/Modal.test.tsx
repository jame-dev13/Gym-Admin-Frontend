import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Modal } from "./Modal";
import { ModalProvider } from "@/context/ModalProvider";
import { useModalContext } from "@/context/useModalContext";

const Harness = () => {
  const { openModal } = useModalContext();

  return (
    <>
      <button type="button" onClick={openModal}>
        Open settings
      </button>
      <Modal title="Settings">
        <p>Modal body content</p>
      </Modal>
    </>
  );
};

const renderHarness = () =>
  render(
    <ModalProvider>
      <Harness />
    </ModalProvider>,
  );

describe("Modal", () => {
  it("is closed by default", () => {
    renderHarness();

    expect(
      screen.queryByRole("dialog", { name: "Settings" }),
    ).not.toBeInTheDocument();
  });

  it("opens through openModal and exposes title and content", async () => {
    const user = userEvent.setup();
    renderHarness();

    await user.click(screen.getByRole("button", { name: "Open settings" }));

    const dialog = screen.getByRole("dialog", { name: "Settings" });
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(
      screen.getByRole("heading", { name: "Settings" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Modal body content")).toBeInTheDocument();
  });

  it("closes through the close button", async () => {
    const user = userEvent.setup();
    renderHarness();

    await user.click(screen.getByRole("button", { name: "Open settings" }));
    await user.click(screen.getByRole("button", { name: "Close dialog" }));

    expect(
      screen.queryByRole("dialog", { name: "Settings" }),
    ).not.toBeInTheDocument();
  });

  it("closes when the overlay is clicked", async () => {
    const user = userEvent.setup();
    renderHarness();

    await user.click(screen.getByRole("button", { name: "Open settings" }));
    await user.click(screen.getByTestId("modal-overlay"));

    expect(
      screen.queryByRole("dialog", { name: "Settings" }),
    ).not.toBeInTheDocument();
  });

  it("does not close when the dialog panel itself is clicked", async () => {
    const user = userEvent.setup();
    renderHarness();

    await user.click(screen.getByRole("button", { name: "Open settings" }));
    await user.click(screen.getByText("Modal body content"));

    expect(
      screen.getByRole("dialog", { name: "Settings" }),
    ).toBeInTheDocument();
  });

  it("closes when Escape is pressed", async () => {
    const user = userEvent.setup();
    renderHarness();

    await user.click(screen.getByRole("button", { name: "Open settings" }));
    await user.keyboard("{Escape}");

    expect(
      screen.queryByRole("dialog", { name: "Settings" }),
    ).not.toBeInTheDocument();
  });

  it("moves focus into the dialog on open and restores it on close", async () => {
    const user = userEvent.setup();
    renderHarness();

    const trigger = screen.getByRole("button", { name: "Open settings" });
    await user.click(trigger);

    expect(
      screen.getByRole("button", { name: "Close dialog" }),
    ).toHaveFocus();

    await user.keyboard("{Escape}");

    expect(trigger).toHaveFocus();
  });
});

describe("useModalContext", () => {
  it("throws when used outside of ModalProvider", () => {
    const Outside = () => {
      useModalContext();
      return null;
    };

    expect(() => render(<Outside />)).toThrow(
      "useModalContext must be used within a ModalProvider",
    );
  });
});
