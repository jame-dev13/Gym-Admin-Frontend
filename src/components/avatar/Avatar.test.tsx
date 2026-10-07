import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Settings } from "lucide-react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Avatar } from "./Avatar";
import { getInitials } from "./getInitials";
import { AvatarMenu } from "./AvatarMenu";
import type { AvatarUser } from "@/types/Types";

const user: AvatarUser = {
  name: "Alex Morgan",
  email: "alex@gymadmin.io",
  status: "online",
};

const renderMenu = (props?: Partial<Parameters<typeof AvatarMenu>[0]>) =>
  render(<AvatarMenu user={user} {...props} />);

const openMenu = async (actor: ReturnType<typeof userEvent.setup>) => {
  await actor.click(screen.getByRole("button", { name: /account menu/i }));
  return screen.getByRole("menu");
};

describe("getInitials", () => {
  it.each([
    ["Alex Morgan", "AM"],
    ["alex", "AL"],
    ["  Maria  del  Carmen  ", "MC"],
    ["", ""],
    ["   ", ""],
  ])("derives %s initials", (name, expected) => {
    expect(getInitials(name)).toBe(expected);
  });
});

describe("Avatar", () => {
  it("renders initials from the name", () => {
    render(<Avatar name="Alex Morgan" />);
    expect(screen.getByText("AM")).toBeInTheDocument();
  });

  it("renders an image when src is provided", () => {
    render(<Avatar name="Alex Morgan" src="https://example.com/a.png" />);
    expect(screen.getByRole("presentation", { hidden: true })).toHaveAttribute(
      "src",
      "https://example.com/a.png",
    );
  });

  it("falls back to a generic icon when no name or src is given", () => {
    const { container } = render(<Avatar />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });
});

describe("AvatarMenu", () => {
  it("is closed by default and exposes menu semantics", () => {
    renderMenu();
    const trigger = screen.getByRole("button", { name: "Account menu for Alex Morgan" });
    expect(trigger).toHaveAttribute("aria-haspopup", "menu");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("opens on trigger click and shows the user header plus every item", async () => {
    const actor = userEvent.setup();
    renderMenu();
    const menu = await openMenu(actor);

    expect(screen.getByRole("button", { name: /account menu/i })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    expect(within(menu).getByText("Alex Morgan")).toBeInTheDocument();
    expect(within(menu).getByText("alex@gymadmin.io")).toBeInTheDocument();
    expect(within(menu).getByRole("menuitem", { name: /profile/i })).toBeInTheDocument();
    expect(within(menu).getByRole("menuitem", { name: /settings/i })).toBeInTheDocument();
    expect(within(menu).getByRole("menuitem", { name: /log out/i })).toBeInTheDocument();
  });

  it("notifies the selected action value and closes", async () => {
    const actor = userEvent.setup();
    const onAction = vi.fn();
    renderMenu({ onAction });

    await openMenu(actor);
    await actor.click(screen.getByRole("menuitem", { name: /settings/i }));

    expect(onAction).toHaveBeenCalledTimes(1);
    expect(onAction).toHaveBeenCalledWith("settings");
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("does not select disabled items", async () => {
    const actor = userEvent.setup();
    const onAction = vi.fn();
    renderMenu({
      onAction,
      items: [{ value: "settings", label: "Settings", Icon: Settings, disabled: true }],
    });

    await openMenu(actor);
    await actor.click(screen.getByRole("menuitem", { name: /settings/i }));

    expect(onAction).not.toHaveBeenCalled();
    expect(screen.getByRole("menu")).toBeInTheDocument();
  });

  it("closes on Escape and returns focus to the trigger", async () => {
    const actor = userEvent.setup();
    renderMenu();

    const trigger = screen.getByRole("button", { name: /account menu/i });
    await actor.click(trigger);
    expect(screen.getByRole("menu")).toBeInTheDocument();

    await actor.keyboard("{Escape}");

    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it("closes on outside click", async () => {
    const actor = userEvent.setup();
    render(
      <>
        <button type="button">Outside</button>
        <AvatarMenu user={user} />
      </>,
    );

    await actor.click(screen.getByRole("button", { name: /account menu/i }));
    expect(screen.getByRole("menu")).toBeInTheDocument();

    await actor.click(screen.getByRole("button", { name: "Outside" }));
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("supports arrow-key navigation and Enter selection", async () => {
    const actor = userEvent.setup();
    const onAction = vi.fn();
    renderMenu({ onAction });

    const trigger = screen.getByRole("button", { name: /account menu/i });
    trigger.focus();
    await actor.keyboard("{ArrowDown}");

    expect(screen.getByRole("menuitem", { name: /profile/i })).toHaveFocus();

    await actor.keyboard("{ArrowDown}");
    expect(screen.getByRole("menuitem", { name: /settings/i })).toHaveFocus();

    await actor.keyboard("{Enter}");
    expect(onAction).toHaveBeenCalledWith("settings");
    expect(trigger).toHaveFocus();
  });

  it("throws when items are empty", () => {
    expect(() => render(<AvatarMenu user={user} items={[]} />)).toThrow(
      "AvatarMenu requires at least one item",
    );
  });

  describe("auto placement", () => {
    const originalInnerWidth = window.innerWidth;

    const mockViewport = (width: number) => {
      Object.defineProperty(window, "innerWidth", {
        value: width,
        configurable: true,
      });
    };

    const mockTriggerRect = (rect: { left: number; right: number }) => {
      const trigger = screen.getByRole("button", { name: /account menu/i });
      vi.spyOn(trigger, "getBoundingClientRect").mockReturnValue({
        x: rect.left,
        y: 8,
        width: rect.right - rect.left,
        height: 40,
        top: 8,
        bottom: 48,
        left: rect.left,
        right: rect.right,
        toJSON: () => {},
      });
    };

    afterEach(() => {
      mockViewport(originalInnerWidth);
    });

    it("anchors the panel to the left edge when the trigger is on the left of a small viewport", async () => {
      const actor = userEvent.setup();
      mockViewport(360);
      renderMenu();
      mockTriggerRect({ left: 8, right: 48 });

      await actor.click(screen.getByRole("button", { name: /account menu/i }));

      expect(screen.getByRole("menu")).toHaveClass("left-0");
    });

    it("anchors the panel to the right edge when the trigger is on the right of a small viewport", async () => {
      const actor = userEvent.setup();
      mockViewport(360);
      renderMenu();
      mockTriggerRect({ left: 300, right: 340 });

      await actor.click(screen.getByRole("button", { name: /account menu/i }));

      expect(screen.getByRole("menu")).toHaveClass("right-0");
    });

    it("honors an explicit placement even when it would overflow", async () => {
      const actor = userEvent.setup();
      mockViewport(360);
      renderMenu({ placement: "bottom-start" });
      mockTriggerRect({ left: 300, right: 340 });

      await actor.click(screen.getByRole("button", { name: /account menu/i }));

      expect(screen.getByRole("menu")).toHaveClass("left-0");
    });
  });
});
