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
import RegisterForm from "./RegisterForm";

const REGISTER_URI = import.meta.env.VITE_REGISTER as string;
const API_BASE_URL = import.meta.env.VITE_BASE as string;
const VERIFICATION_ROUTE = "/auth/verification";

const { navigateMock } = vi.hoisted(() => ({ navigateMock: vi.fn() }));

vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router-dom")>();
  return { ...actual, useNavigate: () => navigateMock };
});

type RecordedRegister = { path: string; body: unknown };

const recordedRegisters: RecordedRegister[] = [];
let registerStatus = 201;
let registerDelayMs = 0;

const renderRegisterForm = () => {
  const queryClient = createTestQueryClient();
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <ToastProvider>{children}</ToastProvider>
      </MemoryRouter>
    </QueryClientProvider>
  );
  return render(<RegisterForm />, { wrapper });
};

beforeEach(() => {
  navigateMock.mockClear();
  recordedRegisters.length = 0;
  registerStatus = 201;
  registerDelayMs = 0;
  server.use(
    http.post(`${API_BASE_URL}${REGISTER_URI}`, async ({ request }) => {
      if (registerDelayMs > 0) {
        await new Promise((resolve) => setTimeout(resolve, registerDelayMs));
      }
      const url = new URL(request.url);
      const body = await request.json().catch(() => undefined);
      recordedRegisters.push({ path: url.pathname, body });
      if (registerStatus !== 201) {
        return HttpResponse.json(
          { message: "Email already in use", status: registerStatus },
          { status: registerStatus },
        );
      }
      return HttpResponse.json({}, { status: 201 });
    }),
  );
});

const fillAndSubmit = async (
  name: string,
  email: string,
  password: string,
) => {
  const user = userEvent.setup();
  await user.type(screen.getByLabelText("Name input"), name);
  await user.type(screen.getByLabelText("Email input"), email);
  await user.type(screen.getByLabelText("Password"), password);
  await user.click(screen.getByRole("button", { name: "Register button" }));
};

describe("RegisterForm suite", () => {
  it("Should set a meaningful document title", () => {
    renderRegisterForm();

    expect(document.title).toBe("Register | Gym Admin");
  });

  it("Should render the required fields, register action, and navigation links", () => {
    renderRegisterForm();

    const name = screen.getByLabelText("Name input");
    const email = screen.getByLabelText("Email input");
    const password = screen.getByLabelText("Password");

    expect(name).toBeRequired();
    expect(email).toBeRequired();
    expect(password).toBeRequired();
    expect(
      screen.getByRole("button", { name: "Register button" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Go to login" }),
    ).toHaveAttribute("href", "/auth/login");
    expect(
      screen.getByRole("link", { name: "Back to landing page" }),
    ).toHaveAttribute("href", "/");
  });

  it("Should post the typed payload and navigate to verification on success", async () => {
    renderRegisterForm();

    await fillAndSubmit("Jane Doe", "jane@gym.com", "secret");

    await waitFor(() =>
      expect(navigateMock).toHaveBeenCalledWith(VERIFICATION_ROUTE),
    );

    expect(recordedRegisters).toHaveLength(1);
    expect(recordedRegisters[0]).toEqual({
      path: REGISTER_URI,
      body: { name: "Jane Doe", email: "jane@gym.com", password: "secret" },
    });
  });

  it("Should show an error toast and keep the typed input when register fails", async () => {
    registerStatus = 409;
    renderRegisterForm();

    await fillAndSubmit("Jane Doe", "jane@gym.com", "secret");

    const toast = await screen.findByRole("status");
    expect(toast).toHaveTextContent(
      "Cannot succeed register operation: Email already in use",
    );

    expect(navigateMock).not.toHaveBeenCalled();
    expect(screen.getByLabelText("Name input")).toHaveValue("Jane Doe");
    expect(screen.getByLabelText("Email input")).toHaveValue("jane@gym.com");
    expect(screen.getByLabelText("Password")).toHaveValue("secret");
  });

  it("Should disable the register button while the request is pending", async () => {
    registerDelayMs = 50;
    const user = userEvent.setup();
    renderRegisterForm();

    await user.type(screen.getByLabelText("Name input"), "Jane Doe");
    await user.type(screen.getByLabelText("Email input"), "jane@gym.com");
    await user.type(screen.getByLabelText("Password"), "secret");
    await user.click(screen.getByRole("button", { name: "Register button" }));

    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: "Register button" }),
      ).toBeDisabled(),
    );

    await waitFor(() =>
      expect(navigateMock).toHaveBeenCalledWith(VERIFICATION_ROUTE),
    );
    expect(recordedRegisters).toHaveLength(1);
  });
});
