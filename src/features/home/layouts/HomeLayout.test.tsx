import { screen, within } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it } from "vitest";
import { server } from "@/test/mocks/server";
import { renderWithProviders } from "@/test/test-utils";
import { HomePanel } from "../index";
import { homePanelRoutes } from "../services/HomePanels";
import { HOME_SECTIONS } from "../services/HomeSections";
import { HomeLayout } from "./HomeLayout";

const BASE = `${import.meta.env.VITE_BASE}${import.meta.env.VITE_APP_BASE}/current`;

const renderShell = (route = "/home/my/subscription") =>
  renderWithProviders(
    <Routes>
      <Route path="/home" element={<HomeLayout />}>
        <Route
          path="my/subscription"
          element={<HomePanel title="Subscription" description="desc" />}
        />
      </Route>
    </Routes>,
    { route },
  );

beforeEach(() => {
  server.use(
    http.get(BASE, () =>
      HttpResponse.json({ username: "angel", email: "angel@mail.com" }),
    ),
  );
});

describe("HomeLayout", () => {
  it("renders the sidebar, main content, and footer landmarks", async () => {
    renderShell();

    expect(
      screen.getByRole("navigation", { name: "Home sidebar" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("main")).toContainElement(
      screen.getByRole("heading", { level: 1, name: "Subscription" }),
    );
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
    expect(await screen.findByText("angel")).toBeInTheDocument();
  });

  it("renders the current user info and logout control in the sidebar", () => {
    renderShell();

    const sidebar = screen.getByRole("complementary");
    expect(
      within(sidebar).getByRole("button", { name: "Log out" }),
    ).toBeInTheDocument();
  });

  it("covers every sidebar destination with a panel route", () => {
    const destinations = HOME_SECTIONS.flatMap((section) =>
      section.links.flatMap((link) =>
        link.to && link.to !== "/home" ? [link.to] : [],
      ),
    );

    expect(destinations.length).toBeGreaterThan(0);

    for (const destination of destinations) {
      expect(
        homePanelRoutes.some(
          (route) => `/home/${route.path}` === destination,
        ),
        `missing panel route for ${destination}`,
      ).toBe(true);
    }
  });
});
