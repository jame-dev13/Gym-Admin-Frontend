import { ToastProvider } from "@/context/ToastProvider";
import { RecoveryRequestForm } from "./RecoveryRequestForm";
import { server } from "@/test/mocks/server";
import { createTestQueryClient } from "@/test/test-utils";
import { QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import type { ReactNode } from "react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

const RECOVERY_URI = import.meta.env.VITE_RECOVERY as string;
const API_BASE_URL = import.meta.env.VITE_BASE as string;
const EMAIL = "jane@gym.com";

type RecordedRecoveryRequest = { path: string; body: unknown };

const recordedRequests: RecordedRecoveryRequest[] = [];
let recoveryRequestStatus = 200;
let recoveryRequestDelayMs = 0;

const renderRecoveryRequestForm = (onSuccess: () => void) => {
  const queryClient = createTestQueryClient();
  const emailRef = { current: "" };
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={["/auth/recover"]}>
        <ToastProvider>{children}</ToastProvider>
      </MemoryRouter>
    </QueryClientProvider>
  );
  return {
    emailRef,
    ...render(
      <RecoveryRequestForm emailRef={emailRef} onSuccess={onSuccess} />,
      { wrapper },
    ),
  };
};

beforeEach(() => {
  recordedRequests.length = 0;
  recoveryRequestStatus = 200;
  recoveryRequestDelayMs = 0;
  server.use(
    http.post(`${API_BASE_URL}${RECOVERY_URI}/recover`, async ({ request }) => {
      if (recoveryRequestDelayMs > 0) {
        await new Promise((resolve) =>
          setTimeout(resolve, recoveryRequestDelayMs),
        );
      }
      const url = new URL(request.url);
      const body = await request.json().catch(() => undefined);
      recordedRequests.push({ path: url.pathname, body });
      if (recoveryRequestStatus !== 200) {
        return HttpResponse.json(
          { message: "Email not found", status: recoveryRequestStatus },
          { status: recoveryRequestStatus },
        );
      }
      return HttpResponse.json({}, { status: 200 });
    }),
  );
});

const submitEmailStep = async (email: string) => {
  const user = userEvent.setup();
  await user.type(screen.getByLabelText("Email input"), email);
  await user.click(
    screen.getByRole("button", { name: "Request recovery code button" }),
  );
};

describe("RecoveryRequestForm suite", () => {
  it("Should render the recovery request step with a required email field", () => {
    renderRecoveryRequestForm(vi.fn());

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
  });

  it("Should post the email and notify success", async () => {
    const onSuccess = vi.fn();
    const { emailRef } = renderRecoveryRequestForm(onSuccess);

    await submitEmailStep(EMAIL);

    await waitFor(() => expect(onSuccess).toHaveBeenCalledTimes(1));

    expect(recordedRequests).toEqual([
      { path: `${RECOVERY_URI}/recover`, body: { email: EMAIL } },
    ]);
    expect(emailRef.current).toBe(EMAIL);
  });

  it("Should show an error toast and preserve the input when the request fails", async () => {
    recoveryRequestStatus = 404;
    const onSuccess = vi.fn();
    renderRecoveryRequestForm(onSuccess);

    await submitEmailStep(EMAIL);

    const toast = await screen.findByRole("status");
    expect(toast).toHaveTextContent(
      "Cannot succeed recovery request: Email not found",
    );

    expect(onSuccess).not.toHaveBeenCalled();
    expect(screen.getByLabelText("Email input")).toHaveValue(EMAIL);
  });

  it("Should disable the send button while the request is pending", async () => {
    recoveryRequestDelayMs = 50;
    const onSuccess = vi.fn();
    renderRecoveryRequestForm(onSuccess);

    await submitEmailStep(EMAIL);

    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: "Request recovery code button" }),
      ).toBeDisabled(),
    );

    await waitFor(() => expect(onSuccess).toHaveBeenCalledTimes(1));
    expect(recordedRequests).toHaveLength(1);
  });
});
