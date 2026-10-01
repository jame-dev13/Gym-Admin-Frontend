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
import VerificationForm from "./VerificationForm";

const VERIFY_URI = import.meta.env.VITE_VERIFICATION as string;
const API_BASE_URL = import.meta.env.VITE_BASE as string;
const LOGIN_ROUTE = "/auth/login";
const REGISTER_ROUTE = "/auth/register";
const STATE_EMAIL = "jane@gym.com";

const { navigateMock } = vi.hoisted(() => ({ navigateMock: vi.fn() }));

vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router-dom")>();
  return { ...actual, useNavigate: () => navigateMock };
});

type RecordedVerify = { path: string; body: unknown };

const recordedVerifies: RecordedVerify[] = [];
let verifyStatus = 200;
let verifyDelayMs = 0;

const renderVerificationForm = (email: string | null = STATE_EMAIL) => {
  const queryClient = createTestQueryClient();
  const initialEntries =
    email === null
      ? ["/auth/verification"]
      : [{ pathname: "/auth/verification", state: { email } }];
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={initialEntries}>
        <ToastProvider>{children}</ToastProvider>
      </MemoryRouter>
    </QueryClientProvider>
  );
  return render(<VerificationForm />, { wrapper });
};

beforeEach(() => {
  navigateMock.mockClear();
  recordedVerifies.length = 0;
  verifyStatus = 200;
  verifyDelayMs = 0;
  server.use(
    http.patch(`${API_BASE_URL}${VERIFY_URI}`, async ({ request }) => {
      if (verifyDelayMs > 0) {
        await new Promise((resolve) => setTimeout(resolve, verifyDelayMs));
      }
      const url = new URL(request.url);
      const body = await request.json().catch(() => undefined);
      recordedVerifies.push({ path: url.pathname, body });
      if (verifyStatus !== 200) {
        return HttpResponse.json(
          { message: "Invalid verification code", status: verifyStatus },
          { status: verifyStatus },
        );
      }
      return HttpResponse.json({}, { status: 200 });
    }),
  );
});

const fillTokenAndSubmit = async (token: string) => {
  const user = userEvent.setup();
  const cells = token.split("");
  for (let index = 0; index < cells.length; index += 1) {
    await user.type(
      screen.getByLabelText(`Character ${index + 1}`),
      cells[index],
    );
  }
  await user.click(screen.getByRole("button", { name: "Verify button" }));
};

describe("VerificationForm suite", () => {
  it("Should set a meaningful document title", () => {
    renderVerificationForm();

    expect(document.title).toBe("Verification | Gym Admin");
  });

  it("Should render the required fields, verify action, and back navigation", () => {
    renderVerificationForm();

    const email = screen.getByLabelText("Email input");

    expect(email).toBeRequired();
    expect(email).toHaveValue(STATE_EMAIL);
    expect(email).toHaveAttribute("readonly");
    expect(
      screen.getByRole("group", { name: "Verification code" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Verify button" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Go back to previous page" }),
    ).toBeInTheDocument();
  });

  it("Should redirect to register when there is no email in location state", () => {
    renderVerificationForm(null);

    expect(navigateMock).toHaveBeenCalledWith(REGISTER_ROUTE, {
      replace: true,
    });
    expect(
      screen.queryByRole("button", { name: "Verify button" }),
    ).not.toBeInTheDocument();
    expect(recordedVerifies).toHaveLength(0);
  });

  it("Should patch the state email and token, then navigate to login on success", async () => {
    renderVerificationForm();

    expect(screen.getByLabelText("Email input")).toHaveValue(STATE_EMAIL);

    await fillTokenAndSubmit("ABC123");

    await waitFor(() =>
      expect(navigateMock).toHaveBeenCalledWith(LOGIN_ROUTE),
    );

    expect(recordedVerifies).toHaveLength(1);
    expect(recordedVerifies[0]).toEqual({
      path: VERIFY_URI,
      body: { email: STATE_EMAIL, token: "ABC123" },
    });
  });

  it("Should show an error toast and keep the typed input when verify fails", async () => {
    verifyStatus = 400;
    renderVerificationForm();

    await fillTokenAndSubmit("ABC123");

    const toast = await screen.findByRole("status");
    expect(toast).toHaveTextContent(
      "Cannot succeed verification operation: Invalid verification code",
    );

    expect(navigateMock).not.toHaveBeenCalled();
    expect(screen.getByLabelText("Email input")).toHaveValue(STATE_EMAIL);
    expect(screen.getByLabelText("Character 1")).toHaveValue("A");
    expect(screen.getByLabelText("Character 6")).toHaveValue("3");
  });

  it("Should disable the verify button while the request is pending", async () => {
    verifyDelayMs = 50;
    renderVerificationForm();

    await fillTokenAndSubmit("ABC123");

    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: "Verify button" }),
      ).toBeDisabled(),
    );

    await waitFor(() =>
      expect(navigateMock).toHaveBeenCalledWith(LOGIN_ROUTE),
    );
    expect(recordedVerifies).toHaveLength(1);
  });
});
