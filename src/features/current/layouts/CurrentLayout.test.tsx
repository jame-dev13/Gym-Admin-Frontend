import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { beforeEach, describe, expect, it } from "vitest";
import { ToastProvider } from "@/context/ToastProvider";
import { server } from "@/test/mocks/server";
import { renderWithProviders } from "@/test/test-utils";
import { CurrentLayout } from "./CurrentLayout";

const BASE = `${import.meta.env.VITE_BASE}${import.meta.env.VITE_APP_BASE}/current`;

const overview = { username: "angel", email: "angel@mail.com" };
const user = { name: "Angel Maciel", email: "angel@mail.com", roles: ["ADMIN"] };

beforeEach(() => {
  server.use(
    http.get(BASE, () => HttpResponse.json(overview)),
    http.get(`${BASE}/user`, () => HttpResponse.json(user)),
  );
});

describe("CurrentLayout", () => {
  it("shows the section cards with current user data", async () => {
    renderWithProviders(
      <ToastProvider>
        <CurrentLayout />
      </ToastProvider>,
    );

    const overviewCard = await screen.findByRole("region", {
      name: "Account overview",
    });
    expect(await within(overviewCard).findByText("angel")).toBeInTheDocument();

    const userCard = screen.getByRole("region", {
      name: "Personal information",
    });
    expect(await within(userCard).findByText("Angel Maciel")).toBeInTheDocument();
    expect(within(userCard).getByText("ADMIN")).toBeInTheDocument();
  });

  it("opens the edit form and returns to the cards on cancel", async () => {
    const actor = userEvent.setup();
    renderWithProviders(
      <ToastProvider>
        <CurrentLayout />
      </ToastProvider>,
    );

    await screen.findByText("Angel Maciel");
    await actor.click(
      screen.getByRole("button", { name: "Edit current user information" }),
    );

    const form = await screen.findByText("Info");
    expect(form).toBeInTheDocument();
    expect(screen.getByLabelText("Name")).toHaveValue("Angel Maciel");

    await actor.click(
      screen.getByRole("button", {
        name: "Cancel update current info form button",
      }),
    );

    expect(
      await screen.findByRole("region", { name: "Account overview" }),
    ).toBeInTheDocument();
  });
});
