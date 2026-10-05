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
import RecoveryForm from "./RecoveryForm";

const RECOVERY_URI = import.meta.env.VITE_RECOVERY as string;
const API_BASE_URL = import.meta.env.VITE_BASE as string;
const LOGIN_ROUTE = "/auth/login";
const EMAIL = "jane@gym.com";
const TOKEN = "ABC123";

const { navigateMock } = vi.hoisted(() => ({ navigateMock: vi.fn() }));

vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router-dom")>();
  return { ...actual, useNavigate: () => navigateMock };
});

type RecordedRecovery = { path: string; body: unknown };

const recordedRecoveries: RecordedRecovery[] = [];
let recoveryRequestStatus = 200;
let activationStatus = 200;
let activationDelayMs = 0;

const renderRecoveryForm = () => {
  const queryClient = createTestQueryClient();
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={["/auth/recover"]}>
        <ToastProvider>{children}</ToastProvider>
      </MemoryRouter>
    </QueryClientProvider>
  );
  return render(<RecoveryForm />, { wrapper });
};

beforeEach(() => {
  navigateMock.mockClear();
  recordedRecoveries.length = 0;
  recoveryRequestStatus = 200;
  activationStatus = 200;
  activationDelayMs = 0;
  server.use(
    http.post(`${API_BASE_URL}${RECOVERY_URI}/recover`, async ({ request }) => {
      const url = new URL(request.url);
      const body = await request.json().catch(() => undefined);
      recordedRecoveries.push({ path: url.pathname, body });
      if (recoveryRequestStatus !== 200) {
        return HttpResponse.json(
          { message: "Email not found", status: recoveryRequestStatus },
          { status: recoveryRequestStatus },
        );
      }
      return HttpResponse.json({}, { status: 200 });
    }),
    http.post(
      `${API_BASE_URL}${RECOVERY_URI}/activate`,
      async ({ request }) => {
        if (activationDelayMs > 0) {
          await new Promise((resolve) =>
            setTimeout(resolve, activationDelayMs),
          );
        }
        const url = new URL(request.url);
        const body = await request.json().catch(() => undefined);
        recordedRecoveries.push({ path: url.pathname, body });
        if (activationStatus !== 200) {
          return HttpResponse.json(
            { message: "Invalid recovery token", status: activationStatus },
            { status: activationStatus },
          );
        }
        return HttpResponse.json({}, { status: 200 });
      },
    ),
  );
});

const submitRequestStep = async (email: string) => {
  const user = userEvent.setup();
  await user.type(screen.getByLabelText("Email input"), email);
  await user.click(
    screen.getByRole("button", { name: "Request recovery code button" }),
  );
};

const submitActivationStep = async (token: string) => {
  const user = userEvent.setup();
  const cells = token.split("");
  for (let index = 0; index < cells.length; index += 1) {
    await user.type(
      screen.getByLabelText(`Character ${index + 1}`),
      cells[index],
    );
  }
  await user.click(screen.getByRole("button", { name: "Recover button" }));
};

describe("RecoveryForm suite", () => {
  it("Should set a meaningful document title", () => {
    renderRecoveryForm();

    expect(document.title).toBe("Recover Account | Gym Admin");
  });

  it("Should render the recovery request step initially", () => {
    renderRecoveryForm();

    expect(
      screen.getByRole("group", { name: "Recovery Request" }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Email input")).toBeRequired();
    expect(
      screen.getByRole("button", { name: "Request recovery code button" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("group", { name: "Recovery code" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Recover button" }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Go back to previous page" }),
    ).toBeInTheDocument();
  });

  it("Should request a recovery code and show the activation step", async () => {
    renderRecoveryForm();

    await submitRequestStep(EMAIL);

    const email = await screen.findByLabelText("Email input");

    expect(recordedRecoveries).toEqual([
      { path: `${RECOVERY_URI}/recover`, body: { email: EMAIL } },
    ]);
    expect(email).toHaveValue(EMAIL);
    expect(email).toHaveAttribute("readonly");
    expect(
      screen.getByRole("group", { name: "Recovery code" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Recover button" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("group", { name: "Recovery Request" }),
    ).not.toBeInTheDocument();
  });

  it("Should return to the request step when using a different email", async () => {
    renderRecoveryForm();

    await submitRequestStep(EMAIL);
    await screen.findByRole("button", { name: "Recover button" });

    const user = userEvent.setup();
    await user.click(
      screen.getByRole("button", { name: "Use a different email" }),
    );

    expect(
      screen.getByRole("group", { name: "Recovery Request" }),
    ).toBeInTheDocument();
    expect(recordedRecoveries).toHaveLength(1);
  });

  it("Should post the email and recovery code, then navigate to login replacing history", async () => {
    renderRecoveryForm();

    await submitRequestStep(EMAIL);
    await screen.findByRole("button", { name: "Recover button" });
    await submitActivationStep(TOKEN);

    await waitFor(() =>
      expect(navigateMock).toHaveBeenCalledWith(LOGIN_ROUTE, {
        replace: true,
      }),
    );

    expect(recordedRecoveries).toEqual([
      { path: `${RECOVERY_URI}/recover`, body: { email: EMAIL } },
      {
        path: `${RECOVERY_URI}/activate`,
        body: { email: EMAIL, token: TOKEN },
      },
    ]);
  });

  it("Should show an error toast and preserve the email when the request fails", async () => {
    recoveryRequestStatus = 404;
    renderRecoveryForm();

    await submitRequestStep(EMAIL);

    const toast = await screen.findByRole("status");
    expect(toast).toHaveTextContent(
      "Cannot succeed recovery request: Email not found",
    );

    expect(navigateMock).not.toHaveBeenCalled();
    expect(screen.getByLabelText("Email input")).toHaveValue(EMAIL);
    expect(
      screen.getByRole("group", { name: "Recovery Request" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Recover button" }),
    ).not.toBeInTheDocument();
  });

  it("Should show an error toast and keep the typed input when activation fails", async () => {
    activationStatus = 400;
    renderRecoveryForm();

    await submitRequestStep(EMAIL);
    await screen.findByRole("button", { name: "Recover button" });
    await submitActivationStep(TOKEN);

    const toast = await screen.findByRole("status");
    expect(toast).toHaveTextContent(
      "Cannot succeed recovery operation: Invalid recovery token",
    );

    expect(navigateMock).not.toHaveBeenCalled();
    expect(screen.getByLabelText("Email input")).toHaveValue(EMAIL);
    expect(screen.getByLabelText("Character 1")).toHaveValue("A");
    expect(screen.getByLabelText("Character 6")).toHaveValue("3");
  });

  it("Should disable the recover button while the activation request is pending", async () => {
    activationDelayMs = 50;
    renderRecoveryForm();

    await submitRequestStep(EMAIL);
    await screen.findByRole("button", { name: "Recover button" });
    await submitActivationStep(TOKEN);

    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: "Recover button" }),
      ).toBeDisabled(),
    );

    await waitFor(() =>
      expect(navigateMock).toHaveBeenCalledWith(LOGIN_ROUTE, {
        replace: true,
      }),
    );
    expect(recordedRecoveries).toHaveLength(2);
  });
});
