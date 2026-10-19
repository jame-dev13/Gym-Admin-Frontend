import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { PopoverProvider } from "./PopoverProvider";
import { usePopoverContext } from "./usePopoverContext";

type Member = { id: number; name: string };

const FIRST_MEMBER: Member = { id: 1, name: "Ada Lovelace" };
const SECOND_MEMBER: Member = { id: 2, name: "Grace Hopper" };

const firstAnchor = document.createElement("button");
const secondAnchor = document.createElement("button");

const PopoverProbe = () => {
  const { isOpen, activePopover, openPopover, closePopover, togglePopover } =
    usePopoverContext();

  return (
    <div>
      <span data-testid="is-open">{String(isOpen)}</span>
      <span data-testid="content">
        {activePopover ? activePopover.content() : "closed"}
      </span>
      <span data-testid="label">{activePopover?.label ?? "none"}</span>

      <button
        type="button"
        onClick={() =>
          openPopover({
            anchor: firstAnchor,
            data: FIRST_MEMBER,
            label: "Member details",
            render: (member) => <p>Details for {member.name}</p>,
          })
        }
      >
        open first
      </button>

      <button
        type="button"
        onClick={() =>
          openPopover({
            anchor: secondAnchor,
            data: SECOND_MEMBER,
            render: (member) => <p>Details for {member.name}</p>,
          })
        }
      >
        open second
      </button>

      <button
        type="button"
        onClick={() =>
          togglePopover({
            anchor: firstAnchor,
            data: FIRST_MEMBER,
            render: (member) => <p>Toggled {member.name}</p>,
          })
        }
      >
        toggle first
      </button>

      <button type="button" onClick={closePopover}>
        close
      </button>
    </div>
  );
};

const renderProbe = () =>
  render(
    <PopoverProvider>
      <PopoverProbe />
    </PopoverProvider>,
  );

describe("PopoverProvider", () => {
  it("starts with no popover open", () => {
    renderProbe();

    expect(screen.getByTestId("is-open")).toHaveTextContent("false");
    expect(screen.getByTestId("content")).toHaveTextContent("closed");
    expect(screen.getByTestId("label")).toHaveTextContent("none");
  });

  it("opens a popover and binds its content to the registered data", async () => {
    const user = userEvent.setup();
    renderProbe();

    await user.click(screen.getByRole("button", { name: "open first" }));

    expect(screen.getByTestId("is-open")).toHaveTextContent("true");
    expect(screen.getByTestId("content")).toHaveTextContent(
      "Details for Ada Lovelace",
    );
    expect(screen.getByTestId("label")).toHaveTextContent("Member details");
  });

  it("replaces the open popover instead of stacking a second one", async () => {
    const user = userEvent.setup();
    renderProbe();

    await user.click(screen.getByRole("button", { name: "open first" }));
    await user.click(screen.getByRole("button", { name: "open second" }));

    expect(screen.getByTestId("is-open")).toHaveTextContent("true");
    expect(screen.getByTestId("content")).toHaveTextContent(
      "Details for Grace Hopper",
    );
    expect(screen.getByTestId("label")).toHaveTextContent("none");
  });

  it("closes the open popover", async () => {
    const user = userEvent.setup();
    renderProbe();

    await user.click(screen.getByRole("button", { name: "open first" }));
    await user.click(screen.getByRole("button", { name: "close" }));

    expect(screen.getByTestId("is-open")).toHaveTextContent("false");
    expect(screen.getByTestId("content")).toHaveTextContent("closed");
  });

  it("toggles the popover anchored to the same trigger", async () => {
    const user = userEvent.setup();
    renderProbe();

    await user.click(screen.getByRole("button", { name: "toggle first" }));
    expect(screen.getByTestId("content")).toHaveTextContent(
      "Toggled Ada Lovelace",
    );

    await user.click(screen.getByRole("button", { name: "toggle first" }));
    expect(screen.getByTestId("is-open")).toHaveTextContent("false");
    expect(screen.getByTestId("content")).toHaveTextContent("closed");
  });

  it("opens a different trigger when toggling another anchor", async () => {
    const user = userEvent.setup();
    renderProbe();

    await user.click(screen.getByRole("button", { name: "open second" }));
    await user.click(screen.getByRole("button", { name: "toggle first" }));

    expect(screen.getByTestId("is-open")).toHaveTextContent("true");
    expect(screen.getByTestId("content")).toHaveTextContent(
      "Toggled Ada Lovelace",
    );
  });
});

describe("usePopoverContext", () => {
  it("throws when used outside of a PopoverProvider", () => {
    const Outside = () => {
      usePopoverContext();
      return null;
    };

    expect(() => render(<Outside />)).toThrow(
      "usePopoverContext must be used within a PopoverProvider",
    );
  });
});
