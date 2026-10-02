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
import SetPasswordForm from "./SetPasswordForm";

const RESET_URI = import.meta.env.VITE_PASSWORD_RESET as string;
const API_BASE_URL = import.meta.env.VITE_BASE as string;
const LOGIN_ROUTE = "/auth/login";
const EMAIL = "jane@gym.com";
const NEW_PASSWORD = "new-secret-1";

const { navigateMock } = vi.hoisted(() => ({ navigateMock: vi.fn() }));

vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router-dom")>();
  return { ...actual, useNavigate: () => navigateMock };
});

type RecordedReset = { path: string; body: unknown };

const recordedResets: RecordedReset[] = [];

const renderSetPasswordForm = () => {
  const queryClient = createTestQueryClient();
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={["/auth/set-password"]}>
        <ToastProvider>{children}</ToastProvider>
      </MemoryRouter>
    </QueryClientProvider>
  );
  return render(<SetPasswordForm />, { wrapper });
};

beforeEach(() => {
  navigateMock.mockClear();
  recordedResets.length = 0;
  server.use(
    http.post(`${API_BASE_URL}${RESET_URI}/set-password`, async ({ request }) => {
      const url = new URL(request.url);
      const body = await request.json().catch(() => undefined);
      recordedResets.push({ path: url.pathname, body });
      return HttpResponse.json({}, { status: 200 });
    }),
  );
});

describe("SetPasswordForm suite", () => {
  it("Should set a meaningful document title", () => {
    renderSetPasswordForm();

    expect(document.title).toBe("Set New Password | Gym Admin");
  });

  it("Should render the email and new password fields with the submit action", () => {
    renderSetPasswordForm();

    expect(
      screen.getByRole("group", { name: "Set new password form" }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Email input")).toBeRequired();
    expect(screen.getByLabelText("Password")).toBeRequired();
    expect(screen.getByLabelText("Confirm Password")).toBeRequired();
    expect(
      screen.getByRole("button", { name: "Set new password button" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Go back to previous page" }),
    ).toBeInTheDocument();
  });

  it("Should set the new password and navigate to login replacing history", async () => {
    renderSetPasswordForm();

    const user = userEvent.setup();
    await user.type(screen.getByLabelText("Email input"), EMAIL);
    await user.type(screen.getByLabelText("Password"), NEW_PASSWORD);
    await user.type(screen.getByLabelText("Confirm Password"), NEW_PASSWORD);
    await user.click(
      screen.getByRole("button", { name: "Set new password button" }),
    );

    await waitFor(() =>
      expect(navigateMock).toHaveBeenCalledWith(LOGIN_ROUTE, {
        replace: true,
      }),
    );

    expect(recordedResets).toEqual([
      {
        path: `${RESET_URI}/set-password`,
        body: { email: EMAIL, newPassword: NEW_PASSWORD },
      },
    ]);
  });

  it("Should highlight the confirmation field when passwords do not match", async () => {
    renderSetPasswordForm();

    const user = userEvent.setup();
    await user.type(screen.getByLabelText("Password"), NEW_PASSWORD);
    await user.type(
      screen.getByLabelText("Confirm Password"),
      "other-secret-2",
    );

    const message = await screen.findByText("Passwords do not match");
    const confirm = screen.getByLabelText("Confirm Password");

    expect(confirm).toHaveAttribute("aria-invalid", "true");
    expect(confirm).toHaveAttribute("aria-describedby", message.id);
    expect(message).toHaveAttribute("aria-live", "polite");
    expect(
      screen.getByRole("button", { name: "Set new password button" }),
    ).toBeDisabled();
    expect(screen.getByLabelText("Password")).not.toHaveAttribute(
      "aria-invalid",
    );
    expect(recordedResets).toHaveLength(0);
  });

  it("Should clear the mismatch once the passwords match again", async () => {
    renderSetPasswordForm();

    const user = userEvent.setup();
    await user.type(screen.getByLabelText("Password"), NEW_PASSWORD);
    const confirm = screen.getByLabelText("Confirm Password");
    await user.type(confirm, "other-secret-2");
    await screen.findByText("Passwords do not match");

    await user.clear(confirm);
    await user.type(confirm, NEW_PASSWORD);

    await waitFor(() =>
      expect(
        screen.queryByText("Passwords do not match"),
      ).not.toBeInTheDocument(),
    );
    expect(confirm).not.toHaveAttribute("aria-invalid");
    expect(
      screen.getByRole("button", { name: "Set new password button" }),
    ).toBeEnabled();
  });
});
