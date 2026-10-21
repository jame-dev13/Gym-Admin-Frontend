import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useEffect } from "react";
import { describe, expect, it } from "vitest";
import { DrawerProvider } from "./DrawerProvider";
import { useDrawerContext } from "./useDrawerContext";

type Member = { id: number; name: string };

const MEMBER: Member = { id: 7, name: "Ada Lovelace" };

const StateProbe = () => {
  const { isOpen, activeDrawer, openDrawer, closeDrawer } = useDrawerContext();

  return (
    <div>
      <p data-testid="drawer-open">{String(isOpen)}</p>
      <p data-testid="drawer-title">{activeDrawer?.title ?? ""}</p>
      <p data-testid="drawer-description">{activeDrawer?.description ?? ""}</p>
      <p data-testid="drawer-position">{activeDrawer?.position ?? ""}</p>
      <p data-testid="drawer-size">{activeDrawer?.size ?? ""}</p>
      <div data-testid="drawer-content">
        {activeDrawer ? activeDrawer.content() : "closed"}
      </div>
      <button
        type="button"
        onClick={() =>
          openDrawer({
            title: "Settings",
            description: "Manage preferences",
            position: "left",
            size: "lg",
            data: MEMBER,
            render: (member) => <p>Details for {member.name}</p>,
          })
        }
      >
        open settings
      </button>
      <button
        type="button"
        onClick={() =>
          openDrawer({
            title: "Members",
            data: null,
            render: () => <p>Members body</p>,
          })
        }
      >
        open members
      </button>
      <button
        type="button"
        onClick={() =>
          openDrawer({ title: "   ", data: null, render: () => null })
        }
      >
        open blank
      </button>
      <button type="button" onClick={closeDrawer}>
        close drawer
      </button>
    </div>
  );
};

const renderHarness = () =>
  render(
    <DrawerProvider>
      <StateProbe />
    </DrawerProvider>,
  );

describe("DrawerProvider", () => {
  it("is closed with no active drawer by default", () => {
    renderHarness();

    expect(screen.getByTestId("drawer-open")).toHaveTextContent("false");
    expect(screen.getByTestId("drawer-title")).toHaveTextContent("");
    expect(screen.getByTestId("drawer-content")).toHaveTextContent("closed");
  });

  it("opens a drawer and binds its content to the provided data", async () => {
    const user = userEvent.setup();
    renderHarness();

    await user.click(screen.getByRole("button", { name: "open settings" }));

    expect(screen.getByTestId("drawer-open")).toHaveTextContent("true");
    expect(screen.getByTestId("drawer-title")).toHaveTextContent("Settings");
    expect(screen.getByTestId("drawer-description")).toHaveTextContent(
      "Manage preferences",
    );
    expect(screen.getByTestId("drawer-position")).toHaveTextContent("left");
    expect(screen.getByTestId("drawer-size")).toHaveTextContent("lg");
    expect(screen.getByTestId("drawer-content")).toHaveTextContent(
      "Details for Ada Lovelace",
    );
  });

  it("replaces the previous drawer and restores defaults", async () => {
    const user = userEvent.setup();
    renderHarness();

    await user.click(screen.getByRole("button", { name: "open settings" }));
    await user.click(screen.getByRole("button", { name: "open members" }));

    expect(screen.getByTestId("drawer-open")).toHaveTextContent("true");
    expect(screen.getByTestId("drawer-title")).toHaveTextContent("Members");
    expect(screen.getByTestId("drawer-description")).toHaveTextContent("");
    expect(screen.getByTestId("drawer-position")).toHaveTextContent("right");
    expect(screen.getByTestId("drawer-size")).toHaveTextContent("md");
    expect(screen.getByTestId("drawer-content")).toHaveTextContent(
      "Members body",
    );
  });

  it("closes the open drawer", async () => {
    const user = userEvent.setup();
    renderHarness();

    await user.click(screen.getByRole("button", { name: "open members" }));
    expect(screen.getByTestId("drawer-open")).toHaveTextContent("true");

    await user.click(screen.getByRole("button", { name: "close drawer" }));

    expect(screen.getByTestId("drawer-open")).toHaveTextContent("false");
    expect(screen.getByTestId("drawer-content")).toHaveTextContent("closed");
  });

  it("throws when opened with a blank title", () => {
    const Bad = () => {
      const { openDrawer } = useDrawerContext();
      useEffect(() => {
        openDrawer({ title: "   ", data: null, render: () => null });
      }, [openDrawer]);
      return null;
    };

    expect(() =>
      render(
        <DrawerProvider>
          <Bad />
        </DrawerProvider>,
      ),
    ).toThrow("Drawer title must not be empty");
  });
});

describe("useDrawerContext", () => {
  it("throws when used outside of a DrawerProvider", () => {
    const Outside = () => {
      useDrawerContext();
      return null;
    };

    expect(() => render(<Outside />)).toThrow(
      "useDrawerContext must be used within a DrawerProvider",
    );
  });
});
