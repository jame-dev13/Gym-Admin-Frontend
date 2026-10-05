import { ToastProvider } from "@/context/ToastProvider";
import { useHandleRecover } from "@/features/auth/hooks/recovery";
import { getQueryAppClient } from "@/services/query-client";
import { server } from "@/test/mocks/server";
import { QueryClientProvider } from "@tanstack/react-query";
import { renderHook, screen, waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import type React from "react";
import { createElement, type ReactNode } from "react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { API_BASE_URL } from "./test-utils";

const RECOVERY_URI = import.meta.env.VITE_RECOVERY as string;
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
let recoveryStatus = 200;
let recoveryDelayMs = 0;

const renderRecoveryHandler = () => {
  const client = getQueryAppClient();
  client.clear();
  client.setDefaultOptions({
    queries: { retry: false },
    mutations: { retry: false },
  });

  const wrapper = ({ children }: { children: ReactNode }) =>
    createElement(
      QueryClientProvider,
      { client },
      createElement(
        MemoryRouter,
        null,
        createElement(ToastProvider, null, children),
      ),
    );

  return wrapper;
};

const buildRecoverySubmitEvent = (email: string, token: string) => {
  const form = document.createElement("form");
  const emailInput = document.createElement("input");
  emailInput.name = "email";
  emailInput.value = email;
  form.append(emailInput);

  const tokenInputs = token.split("").map((character) => {
    const tokenInput = document.createElement("input");
    tokenInput.name = "token";
    tokenInput.value = character;
    form.append(tokenInput);
    return tokenInput;
  });

  return {
    event: {
      preventDefault: vi.fn(),
      currentTarget: form,
    } as unknown as React.SubmitEvent<HTMLFormElement>,
    emailInput,
    tokenInputs,
  };
};

beforeEach(() => {
  navigateMock.mockClear();
  recordedRecoveries.length = 0;
  recoveryStatus = 200;
  recoveryDelayMs = 0;
  server.use(
    http.post(
      `${API_BASE_URL}${RECOVERY_URI}/activate`,
      async ({ request }) => {
        if (recoveryDelayMs > 0) {
          await new Promise((resolve) => setTimeout(resolve, recoveryDelayMs));
        }
        const url = new URL(request.url);
        const body = await request.json().catch(() => undefined);
        recordedRecoveries.push({ path: url.pathname, body });
        if (recoveryStatus !== 200) {
          return HttpResponse.json(
            { message: "Invalid recovery token", status: recoveryStatus },
            { status: recoveryStatus },
          );
        }
        return HttpResponse.json({}, { status: 200 });
      },
    ),
  );
});

describe("useHandleRecover suite", () => {
  it("Shouldn't be undefined", () => {
    const wrapper = renderRecoveryHandler();
    const { result } = renderHook(() => useHandleRecover(), { wrapper });

    expect(result).toBeDefined();
    expect(result.current).toBeDefined();
    expect(typeof result.current.handleSubmit).toBe("function");
  });

  it("Should post the email and token, then navigate to login replacing history", async () => {
    const wrapper = renderRecoveryHandler();
    const { result } = renderHook(() => useHandleRecover(), { wrapper });
    const { event, emailInput, tokenInputs } = buildRecoverySubmitEvent(
      EMAIL,
      TOKEN,
    );

    result.current.handleSubmit(event);

    await waitFor(() =>
      expect(navigateMock).toHaveBeenCalledWith(LOGIN_ROUTE, {
        replace: true,
      }),
    );

    expect(recordedRecoveries).toEqual([
      {
        path: `${RECOVERY_URI}/activate`,
        body: { email: EMAIL, token: TOKEN },
      },
    ]);
    expect(emailInput.value).toBe("");
    expect(tokenInputs.map((input) => input.value).join("")).toBe("");
  });

  it("Should show an error toast and preserve the input when recovery fails", async () => {
    recoveryStatus = 400;
    const wrapper = renderRecoveryHandler();
    const { result } = renderHook(() => useHandleRecover(), { wrapper });
    const { event, emailInput, tokenInputs } = buildRecoverySubmitEvent(
      EMAIL,
      TOKEN,
    );

    result.current.handleSubmit(event);

    const toast = await screen.findByRole("status");
    expect(toast).toHaveTextContent(
      "Cannot succeed recovery operation: Invalid recovery token",
    );

    expect(navigateMock).not.toHaveBeenCalled();
    expect(result.current.error).toMatchObject({
      message: "Invalid recovery token",
    });
    expect(emailInput.value).toBe(EMAIL);
    expect(tokenInputs.map((input) => input.value).join("")).toBe(TOKEN);
  });

  it("Should fail fast without mutating when the email is missing", () => {
    const wrapper = renderRecoveryHandler();
    const { result } = renderHook(() => useHandleRecover(), { wrapper });
    const { event } = buildRecoverySubmitEvent("", TOKEN);

    expect(() => result.current.handleSubmit(event)).toThrow(
      "Email is required to recover the account",
    );
    expect(recordedRecoveries).toHaveLength(0);
    expect(navigateMock).not.toHaveBeenCalled();
  });

  it("Should fail fast without mutating when the token is missing", () => {
    const wrapper = renderRecoveryHandler();
    const { result } = renderHook(() => useHandleRecover(), { wrapper });
    const { event } = buildRecoverySubmitEvent(EMAIL, "");

    expect(() => result.current.handleSubmit(event)).toThrow(
      "Recovery token is required",
    );
    expect(recordedRecoveries).toHaveLength(0);
    expect(navigateMock).not.toHaveBeenCalled();
  });

  it("Should ignore a second submit while the recovery request is pending", async () => {
    recoveryDelayMs = 50;
    const wrapper = renderRecoveryHandler();
    const { result } = renderHook(() => useHandleRecover(), { wrapper });
    const { event } = buildRecoverySubmitEvent(EMAIL, TOKEN);

    result.current.handleSubmit(event);

    await waitFor(() => expect(result.current.isPending).toBe(true));
    result.current.handleSubmit(event);

    await waitFor(() =>
      expect(navigateMock).toHaveBeenCalledWith(LOGIN_ROUTE, {
        replace: true,
      }),
    );

    expect(recordedRecoveries).toHaveLength(1);
  });
});
