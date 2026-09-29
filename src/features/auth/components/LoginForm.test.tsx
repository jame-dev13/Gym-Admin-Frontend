import { ToastProvider } from "@/context/ToastProvider";
import { server } from "@/test/mocks/server";
import { createTestQueryClient } from "@/test/test-utils";
import { QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import type { ReactNode } from "react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import LoginForm from "./LoginForm";

const LOGIN_URI = import.meta.env.VITE_LOGIN as string;
const API_BASE_URL = import.meta.env.VITE_BASE as string;
const HOME_ROUTE = "/home";

const { navigateMock } = vi.hoisted(() => ({ navigateMock: vi.fn() }));

vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router-dom")>();
  return { ...actual, useNavigate: () => navigateMock };
});

type RecordedLogin = { path: string; body: unknown };

const recordedLogins: RecordedLogin[] = [];
let loginStatus = 200;
let loginDelayMs = 0;

const renderLoginForm = () => {
  const queryClient = createTestQueryClient();
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <ToastProvider>{children}</ToastProvider>
      </MemoryRouter>
    </QueryClientProvider>
  );
  return render(<LoginForm />, { wrapper });
};

beforeEach(() => {
  navigateMock.mockClear();
  recordedLogins.length = 0;
  loginStatus = 200;
  loginDelayMs = 0;
  server.use(
    http.post(`${API_BASE_URL}${LOGIN_URI}`, async ({ request }) => {
      if (loginDelayMs > 0) {
        await new Promise((resolve) => setTimeout(resolve, loginDelayMs));
      }
      const url = new URL(request.url);
      const body = await request.json().catch(() => undefined);
      recordedLogins.push({ path: url.pathname, body });
      if (loginStatus !== 200) {
        return HttpResponse.json(
          { message: "Invalid credentials", status: loginStatus },
          { status: loginStatus },
        );
      }
      return HttpResponse.json(
        { isUser: true, email: "user@gym.com" },
        { status: 200 },
      );
    }),
  );
});

const fillAndSubmit = async (email: string, password: string) => {
  const user = userEvent.setup();
  await user.type(screen.getByLabelText("Email input"), email);
  await user.type(screen.getByLabelText("Password"), password);
  await user.click(screen.getByRole("button", { name: "Login button" }));
};

describe("LoginForm suite", () => {
  it("Should set a meaningful document title", () => {
    renderLoginForm();

    expect(document.title).toBe("Login | Gym Admin");
  });

  it("Should render the required fields, login action, and navigation links", () => {
    renderLoginForm();

    const email = screen.getByLabelText("Email input");
    const password = screen.getByLabelText("Password");

    expect(email).toBeRequired();
    expect(password).toBeRequired();
    expect(
      screen.getByRole("button", { name: "Login button" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Go to register" }),
    ).toHaveAttribute("href", "/auth/register");
    expect(
      screen.getByRole("link", { name: "Back to landing page" }),
    ).toHaveAttribute("href", "/");
  });

  it("Should post the typed credentials and navigate home on success", async () => {
    renderLoginForm();

    await fillAndSubmit("user@gym.com", "secret");

    await waitFor(() =>
      expect(navigateMock).toHaveBeenCalledWith(HOME_ROUTE),
    );

    expect(recordedLogins).toHaveLength(1);
    expect(recordedLogins[0]).toEqual({
      path: LOGIN_URI,
      body: { email: "user@gym.com", password: "secret" },
    });
  });

  it("Should show an error toast and keep the typed input when login fails", async () => {
    loginStatus = 401;
    renderLoginForm();

    await fillAndSubmit("user@gym.com", "wrong");

    const toast = await screen.findByRole("status");
    expect(toast).toHaveTextContent(
      "Cannot succeed login operation: Invalid credentials",
    );

    expect(navigateMock).not.toHaveBeenCalled();
    expect(screen.getByLabelText("Email input")).toHaveValue("user@gym.com");
    expect(screen.getByLabelText("Password")).toHaveValue("wrong");
  });

  it("Should disable the login button while the request is pending", async () => {
    loginDelayMs = 50;
    const user = userEvent.setup();
    renderLoginForm();

    await user.type(screen.getByLabelText("Email input"), "user@gym.com");
    await user.type(screen.getByLabelText("Password"), "secret");
    await user.click(screen.getByRole("button", { name: "Login button" }));

    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: "Login button" }),
      ).toBeDisabled(),
    );

    await waitFor(() =>
      expect(navigateMock).toHaveBeenCalledWith(HOME_ROUTE),
    );
    expect(recordedLogins).toHaveLength(1);
  });
});
