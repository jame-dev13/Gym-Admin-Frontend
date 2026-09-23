import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Pencil, Trash2, UserPlus } from "lucide-react";
import { describe, expect, it, vi } from "vitest";
import { Dropdown } from "./Dropdown";
import type { DropdownOption } from "@/types/Types";

const options: DropdownOption[] = [
  {
    value: "edit",
    label: "Edit member",
    description: "Change name, plan or contact",
    Icon: Pencil,
  },
  { value: "invite", label: "Invite member", Icon: UserPlus },
  {
    value: "remove",
    label: "Remove member",
    description: "Revokes access immediately",
    Icon: Trash2,
    disabled: true,
  },
];

const renderDropdown = (props?: Partial<Parameters<typeof Dropdown>[0]>) =>
  render(<Dropdown options={options} label="Member actions" {...props} />);

const openMenu = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.click(screen.getByRole("button", { name: "Member actions" }));
  return screen.getByRole("menu");
};

describe("Dropdown", () => {
  it("is closed by default and exposes expanded state", () => {
    renderDropdown();

    const trigger = screen.getByRole("button", { name: "Member actions" });
    expect(trigger).toHaveAttribute("aria-haspopup", "menu");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("opens on trigger click and lists every option", async () => {
    const user = userEvent.setup();
    renderDropdown();

    const menu = await openMenu(user);

    expect(
      screen.getByRole("button", { name: "Member actions" }),
    ).toHaveAttribute("aria-expanded", "true");
    expect(
      within(menu).getByRole("menuitemradio", { name: /edit member/i }),
    ).toBeInTheDocument();
    expect(
      within(menu).getByRole("menuitemradio", { name: /invite member/i }),
    ).toBeInTheDocument();
    expect(
      within(menu).getByRole("menuitemradio", { name: /remove member/i }),
    ).toBeInTheDocument();
  });

  it("shows descriptions and marks disabled options", async () => {
    const user = userEvent.setup();
    renderDropdown();

    const menu = await openMenu(user);
    expect(
      within(menu).getByText("Change name, plan or contact"),
    ).toBeInTheDocument();

    expect(
      within(menu).getByRole("menuitemradio", { name: /remove member/i }),
    ).toBeDisabled();
  });

  it("selects an option, notifies, and closes", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    renderDropdown({ onSelect });

    await openMenu(user);
    await user.click(
      screen.getByRole("menuitemradio", { name: /invite member/i }),
    );

    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect).toHaveBeenCalledWith("invite");
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("does not select disabled options", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    renderDropdown({ onSelect });

    await openMenu(user);
    await user.click(
      screen.getByRole("menuitemradio", { name: /remove member/i }),
    );

    expect(onSelect).not.toHaveBeenCalled();
    expect(screen.getByRole("menu")).toBeInTheDocument();
  });

  it("closes on Escape and returns focus to the trigger", async () => {
    const user = userEvent.setup();
    renderDropdown();

    const trigger = screen.getByRole("button", { name: "Member actions" });
    await user.click(trigger);
    expect(screen.getByRole("menu")).toBeInTheDocument();

    await user.keyboard("{Escape}");

    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it("closes on outside click", async () => {
    const user = userEvent.setup();
    render(
      <>
        <button type="button">Outside</button>
        <Dropdown options={options} label="Member actions" />
      </>,
    );

    await user.click(screen.getByRole("button", { name: "Member actions" }));
    expect(screen.getByRole("menu")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Outside" }));

    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("supports ArrowDown/ArrowUp navigation and Enter selection", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    renderDropdown({ onSelect });

    const trigger = screen.getByRole("button", { name: "Member actions" });
    trigger.focus();
    await user.keyboard("{ArrowDown}");

    const edit = screen.getByRole("menuitemradio", { name: /edit member/i });
    expect(edit).toHaveFocus();

    await user.keyboard("{ArrowDown}");
    expect(
      screen.getByRole("menuitemradio", { name: /invite member/i }),
    ).toHaveFocus();

    // Skips the disabled "remove" option and wraps to the first item.
    await user.keyboard("{ArrowDown}");
    expect(edit).toHaveFocus();

    await user.keyboard("{ArrowUp}");
    expect(
      screen.getByRole("menuitemradio", { name: /invite member/i }),
    ).toHaveFocus();

    await user.keyboard("{Enter}");
    expect(onSelect).toHaveBeenCalledWith("invite");
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it("marks the controlled value as checked", async () => {
    const user = userEvent.setup();
    renderDropdown({ value: "invite" });

    await user.click(screen.getByRole("button", { name: "Invite member" }));

    expect(
      screen.getByRole("menuitemradio", { name: /invite member/i }),
    ).toHaveAttribute("aria-checked", "true");
    expect(
      screen.getByRole("menuitemradio", { name: /edit member/i }),
    ).toHaveAttribute("aria-checked", "false");
  });

  it("marks the default value as checked in uncontrolled mode", async () => {
    const user = userEvent.setup();
    renderDropdown({ defaultValue: "edit" });

    await user.click(screen.getByRole("button", { name: /edit member/i }));

    expect(
      screen.getByRole("menuitemradio", { name: /edit member/i }),
    ).toHaveAttribute("aria-checked", "true");
  });

  it("renders the placeholder when nothing is selected", () => {
    renderDropdown({ label: undefined, placeholder: "Choose an action" });

    expect(
      screen.getByRole("button", { name: "Choose an action" }),
    ).toBeInTheDocument();
  });

  it("renders a custom trigger instead of the default button content", async () => {
    const user = userEvent.setup();
    renderDropdown({ trigger: <span>Custom trigger</span> });

    await user.click(screen.getByRole("button", { name: "Custom trigger" }));

    expect(screen.getByRole("menu")).toBeInTheDocument();
  });

  it("does not open when disabled", async () => {
    const user = userEvent.setup();
    renderDropdown({ disabled: true });

    const trigger = screen.getByRole("button", { name: "Member actions" });
    expect(trigger).toBeDisabled();

    await user.click(trigger);

    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("throws when options are empty", () => {
    expect(() => render(<Dropdown options={[]} label="Empty" />)).toThrow(
      "Dropdown requires at least one option",
    );
  });
});
