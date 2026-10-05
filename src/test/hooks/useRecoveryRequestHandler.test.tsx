import { ToastProvider } from "@/context/ToastProvider";
import { useHandleRecoveryRequest } from "@/features/auth/hooks/useRecoveryRequestHandler";
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
const EMAIL = "jane@gym.com";

const renderRecoveryRequestHandler = () => {
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

type RecordedRecoveryRequest = { path: string; body: unknown };

const recordedRequests: RecordedRecoveryRequest[] = [];
let recoveryRequestStatus = 200;
let recoveryRequestDelayMs = 0;

const buildRequestSubmitEvent = (email: string) => {
  const form = document.createElement("form");
  const emailInput = document.createElement("input");
  emailInput.name = "email";
  emailInput.value = email;
  form.append(emailInput);
  return {
    event: {
      preventDefault: vi.fn(),
      currentTarget: form,
    } as unknown as React.SubmitEvent<HTMLFormElement>,
    emailInput,
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

describe("useHandleRecoveryRequest suite", () => {
  it("Shouldn't be undefined", () => {
    const wrapper = renderRecoveryRequestHandler();
    const emailRef = { current: "" };
    const { result } = renderHook(
      () => useHandleRecoveryRequest(emailRef, vi.fn()),
      { wrapper },
    );

    expect(result).toBeDefined();
    expect(result.current).toBeDefined();
    expect(typeof result.current.handleSubmit).toBe("function");
  });

  it("Should post the email and notify success to show the recovery form", async () => {
    const wrapper = renderRecoveryRequestHandler();
    const emailRef = { current: "" };
    const onSuccess = vi.fn();
    const { result } = renderHook(
      () => useHandleRecoveryRequest(emailRef, onSuccess),
      { wrapper },
    );
    const { event, emailInput } = buildRequestSubmitEvent(EMAIL);

    result.current.handleSubmit(event);

    await waitFor(() => expect(onSuccess).toHaveBeenCalledTimes(1));

    expect(recordedRequests).toEqual([
      { path: `${RECOVERY_URI}/recover`, body: { email: EMAIL } },
    ]);
    expect(emailRef.current).toBe(EMAIL);
    expect(emailInput.value).toBe("");
  });

  it("Should show an error toast and preserve the input when the request fails", async () => {
    recoveryRequestStatus = 404;
    const wrapper = renderRecoveryRequestHandler();
    const emailRef = { current: "" };
    const onSuccess = vi.fn();
    const { result } = renderHook(
      () => useHandleRecoveryRequest(emailRef, onSuccess),
      { wrapper },
    );
    const { event, emailInput } = buildRequestSubmitEvent(EMAIL);

    result.current.handleSubmit(event);

    const toast = await screen.findByRole("status");
    expect(toast).toHaveTextContent(
      "Cannot succeed recovery request: Email not found",
    );

    expect(onSuccess).not.toHaveBeenCalled();
    expect(result.current.error).toMatchObject({ message: "Email not found" });
    expect(emailInput.value).toBe(EMAIL);
  });

  it("Should fail fast without mutating when the email entry is missing", () => {
    const wrapper = renderRecoveryRequestHandler();
    const emailRef = { current: "" };
    const onSuccess = vi.fn();
    const { result } = renderHook(
      () => useHandleRecoveryRequest(emailRef, onSuccess),
      { wrapper },
    );
    const form = document.createElement("form");
    const event = {
      preventDefault: vi.fn(),
      currentTarget: form,
    } as unknown as React.SubmitEvent<HTMLFormElement>;

    expect(() => result.current.handleSubmit(event)).toThrow(
      "Email is required to request a recovery",
    );
    expect(recordedRequests).toHaveLength(0);
    expect(onSuccess).not.toHaveBeenCalled();
  });

  it("Should ignore a second submit while the recovery request is pending", async () => {
    recoveryRequestDelayMs = 50;
    const wrapper = renderRecoveryRequestHandler();
    const emailRef = { current: "" };
    const onSuccess = vi.fn();
    const { result } = renderHook(
      () => useHandleRecoveryRequest(emailRef, onSuccess),
      { wrapper },
    );
    const { event } = buildRequestSubmitEvent(EMAIL);

    result.current.handleSubmit(event);

    await waitFor(() => expect(result.current.isPending).toBe(true));
    result.current.handleSubmit(event);

    await waitFor(() => expect(onSuccess).toHaveBeenCalledTimes(1));

    expect(recordedRequests).toHaveLength(1);
  });
});
