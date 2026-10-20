import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BookUser } from "lucide-react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import { PopoverHost } from "./PopoverHost";
import { PopoverLink } from "./PopoverLink";
import type { PopoverLinkColor } from "./PopoverTypes";
import { PopoverProvider } from "@/context/PopoverProvider";

type Member = { id: number; name: string; plan: string };

const FIRST_MEMBER: Member = { id: 1, name: "Ada Lovelace", plan: "Elite" };
const SECOND_MEMBER: Member = { id: 2, name: "Grace Hopper", plan: "Basic" };

const Harness = () => (
  <>
    <button type="button">Outside</button>
    <PopoverProvider>
      <PopoverLink
        data={FIRST_MEMBER}
        label="Member details"
        render={(member) => <p>Details for {member.name}</p>}
      >
        Ada Lovelace
      </PopoverLink>
      <PopoverLink
        data={SECOND_MEMBER}
        label="Member details"
        render={(member) => <p>Details for {member.name}</p>}
      >
        Grace Hopper
      </PopoverLink>
      <PopoverHost />
    </PopoverProvider>
  </>
);

const renderHarness = () => render(<Harness />);

describe("PopoverLink", () => {
  it("starts collapsed and exposes the popover relationship", () => {
    renderHarness();

    const trigger = screen.getByRole("button", { name: "Ada Lovelace" });
    expect(trigger).toHaveAttribute("aria-haspopup", "dialog");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("opens a popover showing only the data bound to that trigger", async () => {
    const user = userEvent.setup();
    renderHarness();

    await user.click(screen.getByRole("button", { name: "Ada Lovelace" }));

    expect(
      screen.getByRole("dialog", { name: "Member details" }),
    ).toHaveTextContent("Details for Ada Lovelace");
    expect(
      screen.queryByText("Details for Grace Hopper"),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Ada Lovelace" }),
    ).toHaveAttribute("aria-expanded", "true");
  });

  it("closes when its trigger is pressed again", async () => {
    const user = userEvent.setup();
    renderHarness();

    const trigger = screen.getByRole("button", { name: "Ada Lovelace" });
    await user.click(trigger);
    await user.click(trigger);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("replaces the open popover when another trigger is pressed", async () => {
    const user = userEvent.setup();
    renderHarness();

    await user.click(screen.getByRole("button", { name: "Ada Lovelace" }));
    await user.click(screen.getByRole("button", { name: "Grace Hopper" }));

    expect(screen.getAllByRole("dialog")).toHaveLength(1);
    expect(
      screen.getByRole("dialog", { name: "Member details" }),
    ).toHaveTextContent("Details for Grace Hopper");
  });

  it("closes on Escape and returns focus to the trigger", async () => {
    const user = userEvent.setup();
    renderHarness();

    const trigger = screen.getByRole("button", { name: "Ada Lovelace" });
    await user.click(trigger);
    await user.keyboard("{Escape}");

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it("closes when pressing outside the popover", async () => {
    const user = userEvent.setup();
    renderHarness();

    await user.click(screen.getByRole("button", { name: "Ada Lovelace" }));
    await user.click(screen.getByRole("button", { name: "Outside" }));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});

describe("PopoverLink look and color variants", () => {
  const renderVariant = (children: ReactNode) =>
    render(
      <PopoverProvider>
        <PopoverLink
          data={FIRST_MEMBER}
          label="Member details"
          render={(member) => <p>Details for {member.name}</p>}
        >
          {children}
        </PopoverLink>
        <PopoverHost />
      </PopoverProvider>,
    );

  it("keeps the link look with the cyan color by default", () => {
    renderVariant(<span>Ada Lovelace</span>);

    expect(screen.getByRole("button", { name: "Ada Lovelace" })).toHaveClass(
      "underline",
      "text-accent",
    );
  });

  it("renders the pill look with the selected color", () => {
    render(
      <PopoverProvider>
        <PopoverLink
          data={FIRST_MEMBER}
          label="Member details"
          render={(member) => <p>Details for {member.name}</p>}
          look="pill"
          color="blue"
        >
          Ada Lovelace
        </PopoverLink>
        <PopoverHost />
      </PopoverProvider>,
    );

    expect(screen.getByRole("button", { name: "Ada Lovelace" })).toHaveClass(
      "rounded-full",
      "bg-popover-blue/10",
      "text-popover-blue-emphasis",
    );
  });

  it.each<[PopoverLinkColor, string]>([
    ["cyan", "text-accent"],
    ["blue", "text-popover-blue"],
    ["red", "text-danger"],
    ["slate", "text-text-secondary"],
  ])("applies the %s color to the link look", (color, expectedClass) => {
    render(
      <PopoverProvider>
        <PopoverLink
          data={FIRST_MEMBER}
          label="Member details"
          render={(member) => <p>Details for {member.name}</p>}
          color={color}
        >
          Ada Lovelace
        </PopoverLink>
        <PopoverHost />
      </PopoverProvider>,
    );

    expect(screen.getByRole("button", { name: "Ada Lovelace" })).toHaveClass(
      expectedClass,
    );
  });

  it("renders a command button with an icon and an optional label", async () => {
    const user = userEvent.setup();
    render(
      <PopoverProvider>
        <PopoverLink
          data={FIRST_MEMBER}
          label="Member details"
          render={(member) => <p>Details for {member.name}</p>}
          look="commandBtn"
          icon={<BookUser />}
        >
          Ada Lovelace
        </PopoverLink>
        <PopoverHost />
      </PopoverProvider>,
    );

    const trigger = screen.getByRole("button", { name: "Ada Lovelace" });
    expect(trigger).toHaveClass("rounded-lg", "bg-surface-raised", "px-5", "py-2.5");
    expect(trigger.querySelector("svg")).toBeInTheDocument();

    await user.click(trigger);

    expect(
      screen.getByRole("dialog", { name: "Member details" }),
    ).toHaveTextContent("Details for Ada Lovelace");
  });

  it("uses the popover label to name an icon-only command button", async () => {
    const user = userEvent.setup();
    render(
      <PopoverProvider>
        <PopoverLink
          data={FIRST_MEMBER}
          label="Member details"
          render={(member) => <p>Details for {member.name}</p>}
          look="commandBtn"
          icon={<BookUser />}
        />
        <PopoverHost />
      </PopoverProvider>,
    );

    const trigger = screen.getByRole("button", { name: "Member details" });
    expect(trigger).toHaveClass("size-11");

    await user.click(trigger);

    expect(
      screen.getByRole("dialog", { name: "Member details" }),
    ).toHaveTextContent("Details for Ada Lovelace");
  });

  it("fails fast when an icon-only command button has no accessible name", () => {
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    expect(() =>
      render(
        <PopoverProvider>
          <PopoverLink
            data={FIRST_MEMBER}
            label=""
            render={(member) => <p>Details for {member.name}</p>}
            look="commandBtn"
            icon={<BookUser />}
          />
        </PopoverProvider>,
      ),
    ).toThrow("requires a non-empty `label`");

    consoleError.mockRestore();
  });
});
