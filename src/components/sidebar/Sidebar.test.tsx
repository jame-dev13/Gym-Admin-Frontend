import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { Dumbbell, House, Settings, Users } from "lucide-react";
import { describe, expect, it, vi } from "vitest";
import { Sidebar } from "./Sidebar";
import type { SidebarSection } from "@/types/Types";

const sections: SidebarSection[] = [
  {
    label: "Management",
    links: [
      { to: "/dashboard", label: "Dashboard", Icon: House },
      { to: "/members", label: "Members", Icon: Users },
    ],
  },
  {
    label: "System",
    links: [{ to: "/settings", label: "Settings", Icon: Settings }],
  },
];

const renderSidebar = (ui: React.ReactElement) =>
  render(<MemoryRouter initialEntries={["/members"]}>{ui}</MemoryRouter>);

describe("Sidebar", () => {
  it("renders header, main, and footer zones inside a complementary landmark", () => {
    renderSidebar(
      <Sidebar brand={<span>Gym Admin</span>} sections={sections} />,
    );
    const aside = screen.getByRole("complementary");
    expect(
      within(aside).getByRole("navigation", { name: "Sidebar" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Gym Admin")).toBeInTheDocument();
    expect(screen.getByText("Management")).toBeInTheDocument();
    expect(
      screen.getAllByRole("button", { name: "Collapse sidebar" }),
    ).toHaveLength(2);
  });

  it("throws when sections are empty", () => {
    expect(() =>
      renderSidebar(<Sidebar brand={<span>Gym Admin</span>} sections={[]} />),
    ).toThrow("Sidebar requires at least one section");
  });

  it("marks the active route link", () => {
    renderSidebar(
      <Sidebar brand={<span>Gym Admin</span>} sections={sections} />,
    );
    const membersLink = screen.getByRole("link", { name: "Members" });
    expect(membersLink.getAttribute("aria-current")).toBe("page");
  });

  it("collapses to an icon-only rail hiding labels and group captions", async () => {
    const user = userEvent.setup();
    renderSidebar(
      <Sidebar
        brand={<span>Gym Admin</span>}
        collapsedBrand={<Dumbbell data-testid="collapsed-brand" />}
        sections={sections}
      />,
    );
    await user.click(
      screen.getAllByRole("button", { name: "Collapse sidebar" })[0],
    );
    expect(screen.queryByText("Gym Admin")).not.toBeInTheDocument();
    expect(screen.queryByText("Management")).not.toBeInTheDocument();
    expect(screen.queryByText("Members")).not.toBeInTheDocument();
    expect(screen.getByTestId("collapsed-brand")).toBeInTheDocument();
    expect(
      screen.getAllByRole("button", { name: "Expand sidebar" }),
    ).toHaveLength(2);
    expect(
      screen.getByRole("link", { name: "Members" }),
    ).toHaveAttribute("title", "Members");
  });

  it("expands back to full labels when toggled twice", async () => {
    const user = userEvent.setup();
    renderSidebar(
      <Sidebar brand={<span>Gym Admin</span>} sections={sections} />,
    );
    await user.click(
      screen.getAllByRole("button", { name: "Collapse sidebar" })[0],
    );
    await user.click(
      screen.getAllByRole("button", { name: "Expand sidebar" })[0],
    );
    expect(screen.getByText("Gym Admin")).toBeInTheDocument();
    expect(screen.getByText("Members")).toBeInTheDocument();
  });

  it("supports controlled collapsed state", () => {
    const onCollapsedChange = vi.fn();
    const { rerender } = renderSidebar(
      <Sidebar
        brand={<span>Gym Admin</span>}
        sections={sections}
        collapsed={false}
        onCollapsedChange={onCollapsedChange}
      />,
    );
    expect(screen.getByText("Members")).toBeInTheDocument();
    rerender(
      <MemoryRouter initialEntries={["/members"]}>
        <Sidebar
          brand={<span>Gym Admin</span>}
          sections={sections}
          collapsed
          onCollapsedChange={onCollapsedChange}
        />
      </MemoryRouter>,
    );
    expect(screen.queryByText("Members")).not.toBeInTheDocument();
  });

  it("renders the footer slot above the collapse toggle", () => {
    renderSidebar(
      <Sidebar
        brand={<span>Gym Admin</span>}
        sections={sections}
        footer={<span>Coach Ana</span>}
      />,
    );
    expect(screen.getByText("Coach Ana")).toBeInTheDocument();
  });

  it("lays out as a two-row bar below the tab breakpoint", () => {
    const { container } = renderSidebar(
      <Sidebar brand={<span>Gym Admin</span>} sections={sections} />,
    );
    const aside = container.querySelector("aside");
    expect(aside?.className).toContain("flex-col");
    expect(aside?.className).toContain("tab:h-screen");
    const nav = screen.getByRole("navigation", { name: "Sidebar" });
    expect(nav.className).toContain("flex-row");
    expect(nav.className).toContain("overflow-x-auto");
    expect(nav.className).toContain("tab:flex-col");
    expect(nav.className).toContain("tab:overflow-y-auto");
  });

  it("hides group captions in the bar strip and restores them on desktop", () => {
    renderSidebar(
      <Sidebar brand={<span>Gym Admin</span>} sections={sections} />,
    );
    const caption = screen.getByText("Management");
    expect(caption.className).toContain("hidden");
    expect(caption.className).toContain("tab:block");
  });

  it("hides the links row when collapsed in bar mode while keeping the desktop rail", async () => {
    const user = userEvent.setup();
    renderSidebar(
      <Sidebar brand={<span>Gym Admin</span>} sections={sections} />,
    );
    await user.click(
      screen.getAllByRole("button", { name: "Collapse sidebar" })[0],
    );
    const nav = screen.getByRole("navigation", { name: "Sidebar" });
    expect(nav.className).toContain("hidden");
    expect(nav.className).toContain("tab:flex");
  });

  it("renders a bar toggle in the header row and a desktop toggle in the footer", () => {
    const { container } = renderSidebar(
      <Sidebar brand={<span>Gym Admin</span>} sections={sections} />,
    );
    expect(
      screen.getAllByRole("button", { name: "Collapse sidebar" }),
    ).toHaveLength(2);
    const header = container.querySelector("aside > div:first-child");
    const barToggle = within(header as HTMLElement).getByRole("button", {
      name: "Collapse sidebar",
    });
    expect(barToggle.className).toContain("tab:hidden");
    const footer = container.querySelector("aside > div:last-child");
    expect(footer?.className).toContain("hidden");
    expect(footer?.className).toContain("tab:flex");
    const desktopToggle = within(footer as HTMLElement).getByRole("button", {
      name: "Collapse sidebar",
    });
    expect(desktopToggle).toHaveTextContent("Collapse sidebar");
  });
});
