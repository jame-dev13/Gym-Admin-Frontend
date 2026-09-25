import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { Dumbbell, House, Settings, Users } from "lucide-react";
import { Navbar } from "./Navbar";
import type { NavbarLink } from "@/types/Types";

const links: NavbarLink[] = [
  { to: "/", label: "Home", Icon: House },
  { to: "/members", label: "Members", Icon: Users },
  { to: "/settings", label: "Settings", Icon: Settings },
];

const renderNavbar = (ui: React.ReactElement) =>
  render(<MemoryRouter initialEntries={["/members"]}>{ui}</MemoryRouter>);

describe("Navbar", () => {
  it("renders the brand and all links inside a navigation landmark", () => {
    renderNavbar(<Navbar brand={<span>Gym Admin</span>} links={links} />);
    const nav = screen.getByRole("navigation", { name: "Main navigation" });
    expect(nav).toBeInTheDocument();
    expect(screen.getByText("Gym Admin")).toBeInTheDocument();
    for (const link of links) {
      expect(
        screen.getAllByRole("link", { name: link.label }).length,
      ).toBeGreaterThan(0);
    }
  });

  it("throws when links are empty", () => {
    expect(() => renderNavbar(<Navbar links={[]} />)).toThrow(
      "Navbar requires at least one link",
    );
  });

  it.each([
    ["static", "static"],
    ["sticky", "sticky"],
    ["fixed", "fixed"],
  ] as const)("applies the %s position class", (position, expected) => {
    const { container } = renderNavbar(
      <Navbar brand={<span>Brand</span>} links={links} position={position} />,
    );
    expect(container.firstChild).toHaveClass(expected);
  });

  it("keeps sticky positioning visible at the top by default", () => {
    const { container } = renderNavbar(
      <Navbar brand={<span>Brand</span>} links={links} />,
    );
    expect(container.firstChild).toHaveClass("sticky", "top-0");
  });

  it("marks the active route link with aria-current", () => {
    renderNavbar(<Navbar brand={<span>Brand</span>} links={links} />);
    const active = screen.getAllByRole("link", { name: "Members" })[0];
    expect(active).toHaveAttribute("aria-current", "page");
    expect(screen.getAllByRole("link", { name: "Home" })[0]).not.toHaveAttribute(
      "aria-current",
    );
  });

  it("renders link icons when provided", () => {
    const { container } = renderNavbar(
      <Navbar
        brand={<span>Brand</span>}
        links={[{ to: "/", label: "Home", Icon: Dumbbell }]}
      />,
    );
    expect(container.querySelector("nav svg")).toBeInTheDocument();
  });

  it("toggles the mobile menu from the burger button", async () => {
    const user = userEvent.setup();
    renderNavbar(<Navbar brand={<span>Brand</span>} links={links} />);

    const burger = screen.getByRole("button", { name: "Open menu" });
    expect(burger).toHaveAttribute("aria-expanded", "false");

    await user.click(burger);

    expect(
      screen.getByRole("button", { name: "Close menu" }),
    ).toHaveAttribute("aria-expanded", "true");
  });

  it("starts open when defaultOpen is set", () => {
    renderNavbar(<Navbar brand={<span>Brand</span>} links={links} defaultOpen />);
    expect(screen.getByRole("button", { name: "Close menu" })).toBeInTheDocument();
  });

  it("closes the mobile menu when a link is selected", async () => {
    const user = userEvent.setup();
    renderNavbar(<Navbar brand={<span>Brand</span>} links={links} defaultOpen />);

    // Index 0 is the desktop-row duplicate; the mobile panel link is last.
    const panelLinks = screen.getAllByRole("link", { name: "Home" });
    await user.click(panelLinks[panelLinks.length - 1]);

    expect(screen.getByRole("button", { name: "Open menu" })).toBeInTheDocument();
  });

  it("closes the mobile menu on Escape and refocuses the burger button", async () => {
    const user = userEvent.setup();
    renderNavbar(<Navbar brand={<span>Brand</span>} links={links} defaultOpen />);

    await user.keyboard("{Escape}");

    const burger = screen.getByRole("button", { name: "Open menu" });
    expect(burger).toBeInTheDocument();
    expect(burger).toHaveFocus();
  });

  it("supports controlled open state", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    renderNavbar(
      <Navbar
        brand={<span>Brand</span>}
        links={links}
        open={false}
        onOpenChange={onOpenChange}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Open menu" }));

    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(
      screen.getByRole("button", { name: "Open menu" }),
    ).toBeInTheDocument();
  });

  it("renders anchor links with href for in-page navigation", () => {
    renderNavbar(
      <Navbar
        brand={<span>Brand</span>}
        links={[{ href: "#membresias", label: "Membresías" }]}
      />,
    );
    const anchor = screen.getAllByRole("link", { name: "Membresías" })[0];
    expect(anchor).toHaveAttribute("href", "#membresias");
    expect(anchor.tagName).toBe("A");
  });

  it("supports mixed router and anchor links", () => {
    renderNavbar(
      <Navbar
        brand={<span>Brand</span>}
        links={[...links, { href: "#membresias", label: "Membresías" }]}
      />,
    );
    expect(
      screen.getAllByRole("link", { name: "Membresías" })[0],
    ).toHaveAttribute("href", "#membresias");
    expect(screen.getAllByRole("link", { name: "Home" })[0]).toHaveAttribute(
      "href",
      "/",
    );
  });

  it("closes the mobile menu when an anchor link is selected", async () => {
    const user = userEvent.setup();
    renderNavbar(
      <Navbar
        brand={<span>Brand</span>}
        links={[{ href: "#membresias", label: "Membresías" }]}
        defaultOpen
      />,
    );

    const panelAnchors = screen.getAllByRole("link", { name: "Membresías" });
    await user.click(panelAnchors[panelAnchors.length - 1]);

    expect(screen.getByRole("button", { name: "Open menu" })).toBeInTheDocument();
  });
});
