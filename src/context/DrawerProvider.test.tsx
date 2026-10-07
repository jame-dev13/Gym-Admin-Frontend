import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useEffect } from "react";
import { describe, expect, it } from "vitest";
import { Drawer } from "@/components/drawer/Drawer";
import { DrawerProvider } from "./DrawerProvider";
import { useDrawerContext } from "./useDrawerContext";

const StateProbe = () => {
  const {
    isOpen,
    title,
    description,
    position,
    size,
    openDrawer,
    closeDrawer,
    toggleDrawer,
  } = useDrawerContext();

  return (
    <div>
      <p data-testid="drawer-open">{String(isOpen)}</p>
      <p data-testid="drawer-title">{title}</p>
      <p data-testid="drawer-description">{description ?? ""}</p>
      <p data-testid="drawer-position">{position}</p>
      <p data-testid="drawer-size">{size}</p>
      <button
        type="button"
        onClick={() =>
          openDrawer({
            title: "Settings",
            description: "Manage preferences",
            position: "left",
            size: "lg",
          })
        }
      >
        open settings
      </button>
      <button type="button" onClick={() => openDrawer({ title: "Members" })}>
        open members
      </button>
      <button type="button" onClick={() => openDrawer({ title: "   " })}>
        open blank
      </button>
      <button type="button" onClick={closeDrawer}>
        close drawer
      </button>
      <button type="button" onClick={toggleDrawer}>
        toggle drawer
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
  it("is closed with defaults by default", () => {
    renderHarness();

    expect(screen.getByTestId("drawer-open")).toHaveTextContent("false");
    expect(screen.getByTestId("drawer-position")).toHaveTextContent("right");
    expect(screen.getByTestId("drawer-size")).toHaveTextContent("md");
  });

  it("opens with the given title and layout options", async () => {
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
  });

  it("replaces the previous config when opened again", async () => {
    const user = userEvent.setup();
    renderHarness();

    await user.click(screen.getByRole("button", { name: "open settings" }));
    await user.click(screen.getByRole("button", { name: "open members" }));

    expect(screen.getByTestId("drawer-open")).toHaveTextContent("true");
    expect(screen.getByTestId("drawer-title")).toHaveTextContent("Members");
    // Defaults are restored when the next open omits layout options.
    expect(screen.getByTestId("drawer-position")).toHaveTextContent("right");
    expect(screen.getByTestId("drawer-size")).toHaveTextContent("md");
  });

  it("closes and toggles", async () => {
    const user = userEvent.setup();
    renderHarness();

    await user.click(screen.getByRole("button", { name: "open members" }));
    expect(screen.getByTestId("drawer-open")).toHaveTextContent("true");

    await user.click(screen.getByRole("button", { name: "close drawer" }));
    expect(screen.getByTestId("drawer-open")).toHaveTextContent("false");

    await user.click(screen.getByRole("button", { name: "toggle drawer" }));
    expect(screen.getByTestId("drawer-open")).toHaveTextContent("true");

    await user.click(screen.getByRole("button", { name: "toggle drawer" }));
    expect(screen.getByTestId("drawer-open")).toHaveTextContent("false");
  });

  it("throws when opened with a blank title", () => {
    const Bad = () => {
      const { openDrawer } = useDrawerContext();
      useEffect(() => {
        openDrawer({ title: "   " });
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

  it("drives the presentational Drawer without coupling to it", async () => {
    const user = userEvent.setup();

    const ConnectedDrawer = () => {
      const {
        isOpen,
        title,
        position,
        size,
        description,
        showCloseButton,
        closeOnOverlayClick,
        openDrawer,
        closeDrawer,
      } = useDrawerContext();

      return (
        <>
          <button type="button" onClick={() => openDrawer({ title: "Plans" })}>
            open plans
          </button>
          <Drawer
            open={isOpen}
            onClose={closeDrawer}
            title={title}
            position={position}
            size={size}
            description={description}
            showCloseButton={showCloseButton}
            closeOnOverlayClick={closeOnOverlayClick}
          >
            <p>Drawer body content</p>
          </Drawer>
        </>
      );
    };

    render(
      <DrawerProvider>
        <ConnectedDrawer />
      </DrawerProvider>,
    );

    expect(
      screen.queryByRole("dialog", { name: "Plans" }),
    ).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "open plans" }));

    expect(screen.getByRole("dialog", { name: "Plans" })).toBeInTheDocument();
    expect(screen.getByText("Drawer body content")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Close dialog" }));

    expect(
      screen.queryByRole("dialog", { name: "Plans" }),
    ).not.toBeInTheDocument();
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
