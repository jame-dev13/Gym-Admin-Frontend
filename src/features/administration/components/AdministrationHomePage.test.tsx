import { render, screen } from "@testing-library/react";
import AdministrationHomePage from "./AdministrationHomePage";

describe("AdministrationHomePage", () => {
  it("renders the administration heading", () => {
    render(<AdministrationHomePage />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Administration" }),
    ).toBeInTheDocument();
  });
});
