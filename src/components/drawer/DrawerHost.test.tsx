import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { DrawerHost } from "./DrawerHost";
import { DrawerProvider } from "@/context/DrawerProvider";
import { useDrawerContext } from "@/context/useDrawerContext";

type Member = { id: number; name: string };

const MEMBER: Member = { id: 7, name: "Ada Lovelace" };

const Trigger = () => {
  const { openDrawer } = useDrawerContext();

  return (
    <button
      type="button"
      onClick={() =>
        openDrawer({
          title: "Member details",
          description: "Read-only member information",
          data: MEMBER,
          render: (member) => <p>Details for {member.name}</p>,
        })
      }
    >
      Open member drawer
    </button>
  );
};

const renderHarness = () =>
  render(
    <DrawerProvider>
      <Trigger />
      <DrawerHost />
    </DrawerProvider>,
  );

describe("DrawerHost", () => {
  it("renders nothing while no drawer is open", () => {
    renderHarness();

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("renders the drawer with the content bound to the opened data", async () => {
    const user = userEvent.setup();
    renderHarness();

    await user.click(
      screen.getByRole("button", { name: "Open member drawer" }),
    );

    const dialog = screen.getByRole("dialog", { name: "Member details" });
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveTextContent("Read-only member information");
    expect(dialog).toHaveTextContent("Details for Ada Lovelace");
  });

  it("closes through the drawer close button", async () => {
    const user = userEvent.setup();
    renderHarness();

    await user.click(
      screen.getByRole("button", { name: "Open member drawer" }),
    );
    await user.click(screen.getByRole("button", { name: "Close dialog" }));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
