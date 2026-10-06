import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useNavigate } from "react-router-dom";
import { EntityDomainProvider } from "@/context/EntityDomainProvider";
import { useEntityDomainContext } from "@/context/useEntityDomainContext";
import { renderWithProviders } from "@/test/test-utils";

const EntityProbe = () => {
  const { entity, domain } = useEntityDomainContext();
  const navigate = useNavigate();

  return (
    <div>
      <p data-testid="entity">{entity}</p>
      <p data-testid="domain">{domain}</p>
      <button
        type="button"
        onClick={() => navigate("/administration/recycle/backups")}
      >
        go recycle
      </button>
    </div>
  );
};

const renderEntityProbe = (route: string) =>
  renderWithProviders(
    <EntityDomainProvider>
      <EntityProbe />
    </EntityDomainProvider>,
    { route },
  );

describe("EntityDomainProvider", () => {
  it("resolves entity and domain from a services route", () => {
    renderEntityProbe("/administration/services/users");

    expect(screen.getByTestId("entity")).toHaveTextContent("user");
    expect(screen.getByTestId("domain")).toHaveTextContent("services");
  });

  it("resolves entity and domain from a recycle route", () => {
    renderEntityProbe("/administration/recycle/backups");

    expect(screen.getByTestId("entity")).toHaveTextContent("backup");
    expect(screen.getByTestId("domain")).toHaveTextContent("recycle");
  });

  it("updates the context when the route changes", async () => {
    const user = userEvent.setup();
    renderEntityProbe("/administration/services/users");

    await user.click(screen.getByRole("button", { name: "go recycle" }));

    expect(screen.getByTestId("entity")).toHaveTextContent("backup");
    expect(screen.getByTestId("domain")).toHaveTextContent("recycle");
  });

  it("throws when the route has no entity or domain", () => {
    expect(() =>
      renderEntityProbe("/administration/overview/subscriptions"),
    ).toThrow("useEntityDomainContext must be used within an EntityDomainProvider");
  });

  it("throws when used without a provider", () => {
    expect(() =>
      renderWithProviders(<EntityProbe />, {
        route: "/administration/services/users",
      }),
    ).toThrow("useEntityDomainContext must be used within an EntityDomainProvider");
  });
});
