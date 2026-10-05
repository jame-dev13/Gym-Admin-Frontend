import { render, screen } from "@testing-library/react";
import AdministrationPanel from "./AdministrationPanel";

describe("AdministrationPanel", () => {
  it("renders the title heading and description", () => {
    render(
      <AdministrationPanel
        title="Subscriptions"
        description="Track subscription metrics."
      />,
    );

    expect(
      screen.getByRole("heading", { level: 1, name: "Subscriptions" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Track subscription metrics.")).toBeInTheDocument();
  });
});
