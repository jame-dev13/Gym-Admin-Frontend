import { screen } from "@testing-library/react";
import { Route, Routes } from "react-router-dom";
import { renderWithProviders } from "@/test/test-utils";
import AdminOverview from "@/features/administration/components/AdminOverview";
import AdministrationLayout from "./AdministrationLayout";

const renderShell = (route = "/administration") =>
  renderWithProviders(
    <Routes>
      <Route path="/administration" element={<AdministrationLayout />}>
        <Route index element={<AdminOverview />} />
      </Route>
    </Routes>,
    { route },
  );

describe("AdministrationLayout", () => {
  it("renders the navbar, sidebar, main content, and footer landmarks", () => {
    renderShell();

    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(
      screen.getByRole("navigation", { name: "Sidebar" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("main")).toBeInTheDocument();
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });

  it("renders the active panel inside main when its sidebar link is selected", () => {
    renderShell();

    const overviewLink = screen.getByRole("link", { name: "Overview" });
    expect(overviewLink).toHaveAttribute("href", "/administration");

    const main = screen.getByRole("main");
    expect(main).toContainElement(
      screen.getByRole("heading", { level: 1, name: "Administration" }),
    );
  });
});
