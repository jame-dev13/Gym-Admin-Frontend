import { ToastProvider } from "@/context/ToastProvider";
import { server } from "@/test/mocks/server";
import { createTestQueryClient } from "@/test/test-utils";
import { QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import type { ReactNode } from "react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import PasswordResetForm from "./PasswordResetForm";

const RESET_URI = import.meta.env.VITE_PASSWORD_RESET as string;
const API_BASE_URL = import.meta.env.VITE_BASE as string;
const EMAIL = "jane@gym.com";

const { navigateMock } = vi.hoisted(() => ({ navigateMock: vi.fn() }));

vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router-dom")>();
  return { ...actual, useNavigate: () => navigateMock };
});

type RecordedReset = { path: string; body: unknown };

const recordedResets: RecordedReset[] = [];

const renderPasswordResetForm = () => {
  const queryClient = createTestQueryClient();
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={["/auth/password-reset"]}>
        <ToastProvider>{children}</ToastProvider>
      </MemoryRouter>
    </QueryClientProvider>
  );
  return render(<PasswordResetForm />, { wrapper });
};

beforeEach(() => {
  navigateMock.mockClear();
  recordedResets.length = 0;
  server.use(
    http.post(`${API_BASE_URL}${RESET_URI}/request-reset`, async ({ request }) => {
      const url = new URL(request.url);
      const body = await request.json().catch(() => undefined);
      recordedResets.push({ path: url.pathname, body });
      return HttpResponse.json({}, { status: 200 });
    }),
  );
});

const submitEmailStep = async (email: string) => {
  const user = userEvent.setup();
  await user.type(screen.getByLabelText("Email input"), email);
  await user.click(screen.getByRole("button", { name: "Send reset link" }));
};

describe("PasswordResetForm suite", () => {
  it("Should set a meaningful document title", () => {
    renderPasswordResetForm();

    expect(document.title).toBe("Reset Password | Gym Admin");
  });

  it("Should render the email confirmation step initially", () => {
    renderPasswordResetForm();

    expect(
      screen.getByRole("group", { name: "Email confirmation form" }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Email input")).toBeRequired();
    expect(
      screen.getByRole("button", { name: "Send reset link" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByLabelText("Reset link sent confirmation"),
    ).not.toBeInTheDocument();
  });

  it("Should request a reset and show the confirmation message", async () => {
    renderPasswordResetForm();

    await submitEmailStep(EMAIL);

    const confirmation = await screen.findByLabelText(
      "Reset link sent confirmation",
    );

    expect(recordedResets).toEqual([
      { path: `${RESET_URI}/request-reset`, body: { email: EMAIL } },
    ]);
    expect(confirmation).toHaveTextContent(
      `We sent a password reset link to ${EMAIL}.`,
    );
    expect(confirmation).toHaveTextContent(
      "Check your inbox and follow the link to continue with the reset process.",
    );
    expect(
      screen.queryByRole("group", { name: "Email confirmation form" }),
    ).not.toBeInTheDocument();
  });

  it("Should return to the email step when using a different email", async () => {
    renderPasswordResetForm();

    await submitEmailStep(EMAIL);
    await screen.findByLabelText("Reset link sent confirmation");

    const user = userEvent.setup();
    await user.click(
      screen.getByRole("button", { name: "Use a different email" }),
    );

    expect(
      screen.getByRole("group", { name: "Email confirmation form" }),
    ).toBeInTheDocument();
    expect(recordedResets).toHaveLength(1);
  });
});
