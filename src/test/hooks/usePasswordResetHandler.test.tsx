import { ToastProvider } from "@/context/ToastProvider";
import { getQueryAppClient } from "@/services/query-client";
import { server } from "@/test/mocks/server";
import { QueryClientProvider } from "@tanstack/react-query";
import { renderHook, screen, waitFor } from "@testing-library/react";
import type React from "react";
import { createElement, type ReactNode } from "react";
import { MemoryRouter } from "react-router-dom";
import { http, HttpResponse } from "msw";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { API_BASE_URL } from "./test-utils";
import {
  useHandlePasswordResetRequest,
  useHandleResetPassword,
} from "@/features/auth/hooks/usePasswordResetHandler";

const RESET_URI = import.meta.env.VITE_PASSWORD_RESET as string;
const LOGIN_ROUTE = "/auth/login";

const { navigateMock } = vi.hoisted(() => ({ navigateMock: vi.fn() }));

vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router-dom")>();
  return { ...actual, useNavigate: () => navigateMock };
});

type RecordedRequest = { path: string; body: unknown };

const recordedRequests: RecordedRequest[] = [];
let requestResetStatus = 200;
let setPasswordStatus = 200;
let setPasswordDelayMs = 0;

const renderPasswordResetHandler = () => {
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

const buildResetSubmitEvent = (
  email: string,
  password: string,
  confirmPassword: string,
) => {
  const form = document.createElement("form");
  const emailInput = document.createElement("input");
  emailInput.name = "email";
  emailInput.value = email;
  form.append(emailInput);
  const passwordInput = document.createElement("input");
  passwordInput.name = "password";
  passwordInput.value = password;
  form.append(passwordInput);
  const confirmInput = document.createElement("input");
  confirmInput.name = "confirmPassword";
  confirmInput.value = confirmPassword;
  form.append(confirmInput);
  return {
    event: {
      preventDefault: vi.fn(),
      currentTarget: form,
    } as unknown as React.SubmitEvent<HTMLFormElement>,
    emailInput,
    passwordInput,
    confirmInput,
  };
};

beforeEach(() => {
  navigateMock.mockClear();
  recordedRequests.length = 0;
  requestResetStatus = 200;
  setPasswordStatus = 200;
  setPasswordDelayMs = 0;
  server.use(
    http.post(`${API_BASE_URL}${RESET_URI}/request-reset`, async ({ request }) => {
      const url = new URL(request.url);
      const body = await request.json().catch(() => undefined);
      recordedRequests.push({ path: url.pathname, body });
      if (requestResetStatus !== 200) {
        return HttpResponse.json(
          { message: "Email not found", status: requestResetStatus },
          { status: requestResetStatus },
        );
      }
      return HttpResponse.json({}, { status: 200 });
    }),
    http.post(`${API_BASE_URL}${RESET_URI}/set-password`, async ({ request }) => {
      if (setPasswordDelayMs > 0) {
        await new Promise((resolve) => setTimeout(resolve, setPasswordDelayMs));
      }
      const url = new URL(request.url);
      const body = await request.json().catch(() => undefined);
      recordedRequests.push({ path: url.pathname, body });
      if (setPasswordStatus !== 200) {
        return HttpResponse.json(
          { message: "Invalid reset request", status: setPasswordStatus },
          { status: setPasswordStatus },
        );
      }
      return HttpResponse.json({}, { status: 200 });
    }),
  );
});

describe("useHandlePasswordResetRequest suite", () => {
  it("Shouldn't be undefined", () => {
    const wrapper = renderPasswordResetHandler();
    const emailRef = { current: "" };
    const { result } = renderHook(
      () => useHandlePasswordResetRequest(emailRef, vi.fn()),
      { wrapper },
    );

    expect(result).toBeDefined();
    expect(result.current).toBeDefined();
    expect(typeof result.current.handleSubmit).toBe("function");
  });

  it("Should post the email and notify success to show the reset form", async () => {
    const wrapper = renderPasswordResetHandler();
    const emailRef = { current: "" };
    const onSent = vi.fn();
    const { result } = renderHook(
      () => useHandlePasswordResetRequest(emailRef, onSent),
      { wrapper },
    );
    const { event, emailInput } = buildRequestSubmitEvent("jane@gym.com");

    result.current.handleSubmit(event);

    await waitFor(() => expect(onSent).toHaveBeenCalledTimes(1));

    expect(recordedRequests).toHaveLength(1);
    expect(recordedRequests[0]).toEqual({
      path: `${RESET_URI}/request-reset`,
      body: { email: "jane@gym.com" },
    });
    expect(emailRef.current).toBe("jane@gym.com");
    expect(emailInput.value).toBe("");
  });

  it("Should show an error toast and preserve the input when the request fails", async () => {
    requestResetStatus = 404;
    const wrapper = renderPasswordResetHandler();
    const emailRef = { current: "" };
    const onSent = vi.fn();
    const { result } = renderHook(
      () => useHandlePasswordResetRequest(emailRef, onSent),
      { wrapper },
    );
    const { event, emailInput } = buildRequestSubmitEvent("jane@gym.com");

    result.current.handleSubmit(event);

    const toast = await screen.findByRole("status");
    expect(toast).toHaveTextContent(
      "Cannot succeed password reset request: Email not found",
    );

    expect(onSent).not.toHaveBeenCalled();
    expect(result.current.error).toMatchObject({ message: "Email not found" });
    expect(emailInput.value).toBe("jane@gym.com");
  });

  it("Should fail fast without mutating when the email entry is missing", () => {
    const wrapper = renderPasswordResetHandler();
    const emailRef = { current: "" };
    const onSent = vi.fn();
    const { result } = renderHook(
      () => useHandlePasswordResetRequest(emailRef, onSent),
      { wrapper },
    );
    const form = document.createElement("form");
    const event = {
      preventDefault: vi.fn(),
      currentTarget: form,
    } as unknown as React.SubmitEvent<HTMLFormElement>;

    expect(() => result.current.handleSubmit(event)).toThrow(
      "Email is required to request a password reset",
    );
    expect(recordedRequests).toHaveLength(0);
    expect(onSent).not.toHaveBeenCalled();
  });
});

describe("useHandleResetPassword suite", () => {
  it("Shouldn't be undefined", () => {
    const wrapper = renderPasswordResetHandler();
    const { result } = renderHook(() => useHandleResetPassword(), {
      wrapper,
    });

    expect(result).toBeDefined();
    expect(result.current).toBeDefined();
    expect(typeof result.current.handleSubmit).toBe("function");
  });

  it("Should post the new password and navigate to login replacing history", async () => {
    const wrapper = renderPasswordResetHandler();
    const { result } = renderHook(() => useHandleResetPassword(), {
      wrapper,
    });
    const { event, emailInput, passwordInput, confirmInput } =
      buildResetSubmitEvent("jane@gym.com", "new-secret-1", "new-secret-1");

    result.current.handleSubmit(event);

    await waitFor(() =>
      expect(navigateMock).toHaveBeenCalledWith(LOGIN_ROUTE, {
        replace: true,
      }),
    );

    expect(recordedRequests).toHaveLength(1);
    expect(recordedRequests[0]).toEqual({
      path: `${RESET_URI}/set-password`,
      body: { email: "jane@gym.com", newPassword: "new-secret-1" },
    });
    expect(emailInput.value).toBe("");
    expect(passwordInput.value).toBe("");
    expect(confirmInput.value).toBe("");
  });

  it("Should show an error toast and preserve the input when reset fails", async () => {
    setPasswordStatus = 400;
    const wrapper = renderPasswordResetHandler();
    const { result } = renderHook(() => useHandleResetPassword(), {
      wrapper,
    });
    const { event, passwordInput } = buildResetSubmitEvent(
      "jane@gym.com",
      "new-secret-1",
      "new-secret-1",
    );

    result.current.handleSubmit(event);

    const toast = await screen.findByRole("status");
    expect(toast).toHaveTextContent(
      "Cannot succeed password reset: Invalid reset request",
    );

    expect(navigateMock).not.toHaveBeenCalled();
    expect(result.current.error).toMatchObject({
      message: "Invalid reset request",
    });
    expect(passwordInput.value).toBe("new-secret-1");
  });

  it("Should fail fast without mutating when passwords do not match", () => {
    const wrapper = renderPasswordResetHandler();
    const { result } = renderHook(() => useHandleResetPassword(), {
      wrapper,
    });
    const { event } = buildResetSubmitEvent(
      "jane@gym.com",
      "new-secret-1",
      "other-secret-2",
    );

    expect(() => result.current.handleSubmit(event)).toThrow(
      "Passwords do not match",
    );
    expect(recordedRequests).toHaveLength(0);
    expect(navigateMock).not.toHaveBeenCalled();
  });

  it("Should fail fast without mutating when the email is missing", () => {
    const wrapper = renderPasswordResetHandler();
    const { result } = renderHook(() => useHandleResetPassword(), {
      wrapper,
    });
    const form = document.createElement("form");
    const passwordInput = document.createElement("input");
    passwordInput.name = "password";
    passwordInput.value = "new-secret-1";
    form.append(passwordInput);
    const confirmInput = document.createElement("input");
    confirmInput.name = "confirmPassword";
    confirmInput.value = "new-secret-1";
    form.append(confirmInput);
    const event = {
      preventDefault: vi.fn(),
      currentTarget: form,
    } as unknown as React.SubmitEvent<HTMLFormElement>;

    expect(() => result.current.handleSubmit(event)).toThrow(
      "Email is required to reset the password",
    );
    expect(recordedRequests).toHaveLength(0);
    expect(navigateMock).not.toHaveBeenCalled();
  });

  it("Should ignore a second submit while the reset request is pending", async () => {
    setPasswordDelayMs = 50;
    const wrapper = renderPasswordResetHandler();
    const { result } = renderHook(() => useHandleResetPassword(), {
      wrapper,
    });
    const { event } = buildResetSubmitEvent(
      "jane@gym.com",
      "new-secret-1",
      "new-secret-1",
    );

    result.current.handleSubmit(event);

    await waitFor(() => expect(result.current.isPending).toBe(true));
    result.current.handleSubmit(event);

    await waitFor(() =>
      expect(navigateMock).toHaveBeenCalledWith(LOGIN_ROUTE, {
        replace: true,
      }),
    );

    expect(recordedRequests).toHaveLength(1);
  });
});
