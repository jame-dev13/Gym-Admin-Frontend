import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import LandingPage from "./LandingPage";
import { LANDING_SECTION_IDS } from "@/features/landing-page/services/SectionIds";

const renderLanding = () =>
  render(
    <MemoryRouter>
      <LandingPage />
    </MemoryRouter>,
  );

describe("LandingPage", () => {
  it("sets a meaningful document title", () => {
    renderLanding();
    expect(document.title).toBe("Gym Admin | Transform your body");
  });

  it("renders every section with its anchor target id", () => {
    const { container } = renderLanding();
    for (const id of Object.values(LANDING_SECTION_IDS)) {
      expect(container.querySelector(`#${CSS.escape(id)}`)).toBeInTheDocument();
    }
  });

  it("exposes anchor navigation to each section", () => {
    renderLanding();
    for (const id of [
      LANDING_SECTION_IDS.benefits,
      LANDING_SECTION_IDS.pricing,
      LANDING_SECTION_IDS.testimonials,
      LANDING_SECTION_IDS.faq,
    ]) {
      const anchors = screen
        .getAllByRole("link")
        .filter((link) => link.getAttribute("href") === `#${id}`);
      expect(anchors.length).toBeGreaterThan(0);
    }
  });

  it("routes registration calls to action to the register page", () => {
    renderLanding();
    const ctas = screen
      .getAllByRole("link", { name: /join now|create free account|create account|choose/i })
      .filter((link) => link.getAttribute("href") === "/auth/register");
    expect(ctas.length).toBeGreaterThan(0);
  });

  it("renders all four membership prices in MXN", () => {
    renderLanding();
    for (const price of ["MX$150", "MX$300", "MX$900", "MX$3,600"]) {
      expect(screen.getByText(price, { exact: false })).toBeInTheDocument();
    }
    expect(screen.getByText("Most popular")).toBeInTheDocument();
  });

  it("expands and collapses FAQ answers", async () => {
    const user = userEvent.setup();
    renderLanding();

    const question = screen.getByRole("button", {
      name: "Do I need prior experience to join?",
    });
    expect(question).toHaveAttribute("aria-expanded", "true");

    await user.click(question);
    expect(question).toHaveAttribute("aria-expanded", "false");
    expect(
      screen.queryByText(/initial assessment and a personalized routine/i),
    ).not.toBeInTheDocument();

    await user.click(question);
    expect(question).toHaveAttribute("aria-expanded", "true");
    expect(
      screen.getByText(/initial assessment and a personalized routine/i),
    ).toBeInTheDocument();
  });
});
