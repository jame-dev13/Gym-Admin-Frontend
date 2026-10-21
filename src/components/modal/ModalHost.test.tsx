import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { ModalHost } from "./ModalHost";
import { ModalProvider } from "@/context/ModalProvider";
import { useModalContext } from "@/context/useModalContext";

type Member = { id: number; name: string };

const MEMBER: Member = { id: 7, name: "Ada Lovelace" };

const Trigger = () => {
  const { openModal } = useModalContext();

  return (
    <button
      type="button"
      onClick={() =>
        openModal({
          title: "Member details",
          description: "Read-only member information",
          data: MEMBER,
          render: (member) => <p>Details for {member.name}</p>,
        })
      }
    >
      Open member modal
    </button>
  );
};

const renderHarness = () =>
  render(
    <ModalProvider>
      <Trigger />
      <ModalHost />
    </ModalProvider>,
  );

describe("ModalHost", () => {
  it("renders nothing while no modal is open", () => {
    renderHarness();

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("renders the modal with the content bound to the opened data", async () => {
    const user = userEvent.setup();
    renderHarness();

    await user.click(
      screen.getByRole("button", { name: "Open member modal" }),
    );

    const dialog = screen.getByRole("dialog", { name: "Member details" });
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveTextContent("Read-only member information");
    expect(dialog).toHaveTextContent("Details for Ada Lovelace");
  });

  it("closes through the modal close button", async () => {
    const user = userEvent.setup();
    renderHarness();

    await user.click(
      screen.getByRole("button", { name: "Open member modal" }),
    );
    await user.click(screen.getByRole("button", { name: "Close dialog" }));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
