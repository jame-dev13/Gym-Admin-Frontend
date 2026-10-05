import { screen, within } from "@testing-library/react";
import { Route, Routes } from "react-router-dom";
import { renderWithProviders } from "@/test/test-utils";
import AdministrationPanel from "../components/AdministrationPanel";
import AdministrationLayout from "./AdministrationLayout";
import { ADMINISTRATION_SECTIONS } from "../services/AdministrationSections";
import { administrationPanelRoutes } from "../services/AdministrationPanels";

const sectionDestinations = ADMINISTRATION_SECTIONS.flatMap((section) =>
  section.links.flatMap((link) =>
    link.to && link.to !== "/administration" ? [link.to] : [],
  ),
);

describe("AdministrationRoutes", () => {
  it("covers every sidebar destination with a panel route", () => {
    expect(sectionDestinations.length).toBeGreaterThan(0);

    for (const destination of sectionDestinations) {
      expect(
        administrationPanelRoutes.some(
          (route) => `/administration/${route.path}` === destination,
        ),
        `missing panel route for ${destination}`,
      ).toBe(true);
    }
  });

  it.each(
    administrationPanelRoutes.map(
      (route) => [route.path, route.title] as [string, string],
    ),
  )("renders the %s panel with its heading", (path, title) => {
    const panel = administrationPanelRoutes.find((route) => route.path === path);
    if (!panel) {
      throw new Error(`Missing panel definition for ${path}`);
    }

    renderWithProviders(
      <Routes>
        <Route path="/administration" element={<AdministrationLayout />}>
          <Route
            path={panel.path}
            element={
              <AdministrationPanel
                title={panel.title}
                description={panel.description}
              />
            }
          />
        </Route>
      </Routes>,
      { route: `/administration/${panel.path}` },
    );

    const main = screen.getByRole("main");
    expect(
      within(main).getByRole("heading", { level: 1, name: title }),
    ).toBeInTheDocument();
  });
});
