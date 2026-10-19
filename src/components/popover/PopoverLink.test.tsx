import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { PopoverHost } from "./PopoverHost";
import { PopoverLink } from "./PopoverLink";
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
