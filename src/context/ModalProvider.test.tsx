import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useEffect } from "react";
import { describe, expect, it } from "vitest";
import { ModalProvider } from "./ModalProvider";
import { useModalContext } from "./useModalContext";

type Member = { id: number; name: string };

const MEMBER: Member = { id: 7, name: "Ada Lovelace" };

const StateProbe = () => {
  const { isOpen, activeModal, openModal, closeModal } = useModalContext();

  return (
    <div>
      <p data-testid="modal-open">{String(isOpen)}</p>
      <p data-testid="modal-title">{activeModal?.title ?? ""}</p>
      <p data-testid="modal-description">{activeModal?.description ?? ""}</p>
      <p data-testid="modal-size">{activeModal?.size ?? ""}</p>
      <div data-testid="modal-content">
        {activeModal ? activeModal.content() : "closed"}
      </div>
      <button
        type="button"
        onClick={() =>
          openModal({
            title: "Settings",
            description: "Manage preferences",
            size: "lg",
            data: MEMBER,
            render: (member) => <p>Details for {member.name}</p>,
          })
        }
      >
        open settings
      </button>
      <button
        type="button"
        onClick={() =>
          openModal({
            title: "Members",
            data: null,
            render: () => <p>Members body</p>,
          })
        }
      >
        open members
      </button>
      <button type="button" onClick={closeModal}>
        close modal
      </button>
    </div>
  );
};

const renderHarness = () =>
  render(
    <ModalProvider>
      <StateProbe />
    </ModalProvider>,
  );

describe("ModalProvider", () => {
  it("is closed with no active modal by default", () => {
    renderHarness();

    expect(screen.getByTestId("modal-open")).toHaveTextContent("false");
    expect(screen.getByTestId("modal-title")).toHaveTextContent("");
    expect(screen.getByTestId("modal-content")).toHaveTextContent("closed");
  });

  it("opens a modal and binds its content to the provided data", async () => {
    const user = userEvent.setup();
    renderHarness();

    await user.click(screen.getByRole("button", { name: "open settings" }));

    expect(screen.getByTestId("modal-open")).toHaveTextContent("true");
    expect(screen.getByTestId("modal-title")).toHaveTextContent("Settings");
    expect(screen.getByTestId("modal-description")).toHaveTextContent(
      "Manage preferences",
    );
    expect(screen.getByTestId("modal-size")).toHaveTextContent("lg");
    expect(screen.getByTestId("modal-content")).toHaveTextContent(
      "Details for Ada Lovelace",
    );
  });

  it("replaces the previous modal and restores defaults", async () => {
    const user = userEvent.setup();
    renderHarness();

    await user.click(screen.getByRole("button", { name: "open settings" }));
    await user.click(screen.getByRole("button", { name: "open members" }));

    expect(screen.getByTestId("modal-open")).toHaveTextContent("true");
    expect(screen.getByTestId("modal-title")).toHaveTextContent("Members");
    expect(screen.getByTestId("modal-description")).toHaveTextContent("");
    expect(screen.getByTestId("modal-size")).toHaveTextContent("md");
    expect(screen.getByTestId("modal-content")).toHaveTextContent(
      "Members body",
    );
  });

  it("closes the open modal", async () => {
    const user = userEvent.setup();
    renderHarness();

    await user.click(screen.getByRole("button", { name: "open members" }));
    expect(screen.getByTestId("modal-open")).toHaveTextContent("true");

    await user.click(screen.getByRole("button", { name: "close modal" }));

    expect(screen.getByTestId("modal-open")).toHaveTextContent("false");
    expect(screen.getByTestId("modal-content")).toHaveTextContent("closed");
  });

  it("throws when opened with a blank title", () => {
    const Bad = () => {
      const { openModal } = useModalContext();
      useEffect(() => {
        openModal({ title: "   ", data: null, render: () => null });
      }, [openModal]);
      return null;
    };

    expect(() =>
      render(
        <ModalProvider>
          <Bad />
        </ModalProvider>,
      ),
    ).toThrow("Modal title must not be empty");
  });
});

describe("useModalContext", () => {
  it("throws when used outside of a ModalProvider", () => {
    const Outside = () => {
      useModalContext();
      return null;
    };

    expect(() => render(<Outside />)).toThrow(
      "useModalContext must be used within a ModalProvider",
    );
  });
});
