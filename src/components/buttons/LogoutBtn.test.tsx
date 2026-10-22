import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { delay, http, HttpResponse } from "msw";
import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";
import { server } from "@/test/mocks/server";

const API_BASE = "http://api.test";
const LOGOUT_PATH = "/auth/logout";

vi.stubEnv("VITE_BASE", API_BASE);
vi.stubEnv("VITE_AUTH_LOGOUT", LOGOUT_PATH);

type LogoutModule = typeof import("./LogoutBtn");

let LogoutBtn: LogoutModule["LogoutBtn"];
let logoutCalls = 0;

const renderLogoutBtn = () => render(<LogoutBtn />);

beforeEach(async () => {
  vi.resetModules();
  logoutCalls = 0;
  localStorage.clear();
  sessionStorage.clear();
  // jsdom cannot perform a full-page navigation, so its "not implemented"
  // notice is expected whenever the component redirects after logging out.
  vi.spyOn(console, "error").mockImplementation(() => undefined);

  server.use(
    http.post(`${API_BASE}${LOGOUT_PATH}`, () => {
      logoutCalls += 1;
      return new HttpResponse(null, { status: 204 });
    }),
  );

  ({ LogoutBtn } = await import("./LogoutBtn"));
});

describe("LogoutBtn", () => {
  it("renders an enabled button with an accessible name", () => {
    renderLogoutBtn();

    const button = screen.getByRole("button", { name: "Log out" });

    expect(button).toBeEnabled();
    expect(button).not.toHaveAttribute("aria-busy");
  });

  it("ends the server session and clears the local session", async () => {
    const user = userEvent.setup();
    localStorage.setItem("access", "token");
    sessionStorage.setItem("pending", "value");
    renderLogoutBtn();

    await user.click(screen.getByRole("button", { name: "Log out" }));

    await waitFor(() => expect(logoutCalls).toBe(1));

    expect(localStorage).toHaveLength(0);
    expect(sessionStorage).toHaveLength(0);
  });

  it("still clears the local session when the server logout fails", async () => {
    const user = userEvent.setup();
    localStorage.setItem("access", "token");
    sessionStorage.setItem("pending", "value");
    server.use(
      http.post(`${API_BASE}${LOGOUT_PATH}`, () =>
        HttpResponse.json({ message: "Server error" }, { status: 500 }),
      ),
    );
    renderLogoutBtn();

    await user.click(screen.getByRole("button", { name: "Log out" }));

    await waitFor(() => expect(localStorage).toHaveLength(0));

    expect(sessionStorage).toHaveLength(0);
  });

  it("disables itself and exposes a busy state while logging out", async () => {
    const user = userEvent.setup();
    server.use(
      http.post(`${API_BASE}${LOGOUT_PATH}`, async () => {
        logoutCalls += 1;
        await delay(50);
        return new HttpResponse(null, { status: 204 });
      }),
    );
    renderLogoutBtn();

    await user.click(screen.getByRole("button", { name: "Log out" }));

    const button = screen.getByRole("button", { name: "Log out" });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-busy", "true");
    expect(document.querySelector(".animate-spin")).not.toBeNull();

    await waitFor(() => expect(logoutCalls).toBe(1));
  });
});

afterAll(() => {
  vi.unstubAllEnvs();
});
