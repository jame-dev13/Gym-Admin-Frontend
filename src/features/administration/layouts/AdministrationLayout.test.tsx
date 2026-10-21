import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactElement } from "react";
import { Route, Routes } from "react-router-dom";
import { renderWithProviders } from "@/test/test-utils";
import { useSelectionContext } from "@/context/useSelectionContext";
import AdminOverview from "@/features/administration/components/AdminOverview";
import AdministrationLayout from "./AdministrationLayout";

const renderShell = (
  route = "/administration",
  content: ReactElement = <AdminOverview />,
) =>
  renderWithProviders(
    <Routes>
      <Route path="/administration" element={<AdministrationLayout />}>
        <Route index element={content} />
        <Route path="*" element={content} />
      </Route>
    </Routes>,
    { route },
  );

const SelectionProbe = () => {
  const { currentSelection, setCurrentSelection } = useSelectionContext();

  return (
    <div>
      <button type="button" onClick={() => setCurrentSelection({ id: 7 })}>
        Select row
      </button>
      <span data-testid="current-selection">
        {currentSelection?.id ?? "none"}
      </span>
    </div>
  );
};

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

  it("clears the current selection when a sidebar link changes the panel", async () => {
    const user = userEvent.setup();
    renderShell("/administration", <SelectionProbe />);

    await user.click(screen.getByRole("button", { name: "Select row" }));
    expect(screen.getByTestId("current-selection")).toHaveTextContent("7");

    await user.click(screen.getAllByRole("link", { name: "Customers" })[0]);

    expect(screen.getByTestId("current-selection")).toHaveTextContent("none");
  });
});
