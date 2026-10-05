import { render, screen } from "@testing-library/react";
import AdminOverview from "./AdminOverview";

describe("AdminOverview", () => {
  it("renders the administration heading", () => {
    render(<AdminOverview />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Administration" }),
    ).toBeInTheDocument();
  });
});
