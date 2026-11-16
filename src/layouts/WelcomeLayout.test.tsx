import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import {
  WELCOME_NAV_LINKS,
  WELCOME_TESTIMONIALS,
} from "@/components/welcome/WelcomeContent";
import { WELCOME_SECTION_IDS } from "@/components/welcome/WelcomeSectionIds";
import { WelcomeLayout } from "@/layouts/WelcomeLayout";
import { renderWithProviders } from "@/test/test-utils";

const renderWelcome = () =>
  renderWithProviders(<WelcomeLayout />, { route: "/home" });

describe("WelcomeLayout", () => {
  it("sets a meaningful title and meta description for search and sharing", () => {
    renderWelcome();

    expect(document.title).toBe("Become a member | Gym Admin");
    expect(
      document
        .querySelector('meta[name="description"]')
        ?.getAttribute("content"),
    ).toContain("subscription");
    expect(
      document.querySelector('script[data-welcome-seo="true"]'),
    ).toBeInTheDocument();
  });

  it("renders every navigable section with its anchor target", () => {
    const { container } = renderWelcome();

    for (const id of Object.values(WELCOME_SECTION_IDS)) {
      expect(container.querySelector(`#${CSS.escape(id)}`)).toBeInTheDocument();
    }
  });

  it("exposes navbar anchors for every in-page section", () => {
    renderWelcome();

    for (const link of WELCOME_NAV_LINKS) {
      const anchors = screen
        .getAllByRole("link", { name: link.label })
        .filter((anchor) => anchor.getAttribute("href") === link.href);
      expect(anchors.length).toBeGreaterThan(0);
    }
  });

  it("opens the membership registration dialog from a membership call to action", async () => {
    const user = userEvent.setup();
    renderWelcome();

    await user.click(
      screen.getAllByRole("button", { name: "Become a member" })[0],
    );

    const dialog = screen.getByRole("dialog", {
      name: "Membership registration",
    });
    expect(dialog).toBeInTheDocument();
    expect(
      within(dialog).getByText("Still in development"),
    ).toBeInTheDocument();
    expect(within(dialog).queryByRole("link")).not.toBeInTheDocument();
  });

  it("closes the membership dialog without leaving the page", async () => {
    const user = userEvent.setup();
    renderWelcome();

    await user.click(screen.getByRole("button", { name: "Add your voice" }));
    expect(
      screen.getByRole("dialog", { name: "Membership registration" }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Got it" }));
    expect(
      screen.queryByRole("dialog", { name: "Membership registration" }),
    ).not.toBeInTheDocument();
  });

  it("offers a skip link as the first focusable element", () => {
    renderWelcome();

    expect(
      screen.getByRole("link", { name: "Skip to main content" }),
    ).toHaveAttribute("href", "#welcome-main");
  });

  it("shows member testimonials in the community section", () => {
    renderWelcome();

    for (const testimonial of WELCOME_TESTIMONIALS) {
      expect(screen.getAllByText(testimonial.name).length).toBeGreaterThan(0);
    }
  });
});
