import { ToastProvider } from "@/context/ToastProvider";
import { useHandleLogin } from "@/features/auth/hooks/login";
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

const LOGIN_URI = import.meta.env.VITE_LOGIN as string;
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

const renderLoginHandler = () => {
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

  return renderHook(() => useHandleLogin(), { wrapper });
};

const buildLoginSubmitEvent = (email: string, password: string) => {
  const form = document.createElement("form");
  const emailInput = document.createElement("input");
  emailInput.name = "email";
  emailInput.value = email;
  const passwordInput = document.createElement("input");
  passwordInput.name = "password";
  passwordInput.value = password;
  form.append(emailInput, passwordInput);
  return {
    event: {
      preventDefault: vi.fn(),
      currentTarget: form,
    } as unknown as React.SubmitEvent<HTMLFormElement>,
    emailInput,
    passwordInput,
  };
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

describe("useHandleLogin suite", () => {
  it("Shouldn't be undefined", () => {
    const { result } = renderLoginHandler();

    expect(result).toBeDefined();
    expect(result.current).toBeDefined();
    expect(typeof result.current.handleSubmit).toBe("function");
  });

  it("Should post the form credentials and navigate home on success", async () => {
    const { result } = renderLoginHandler();
    const { event, emailInput, passwordInput } = buildLoginSubmitEvent(
      "user@gym.com",
      "secret",
    );

    result.current.handleSubmit(event);

    await waitFor(() =>
      expect(navigateMock).toHaveBeenCalledWith(HOME_ROUTE),
    );

    expect(recordedLogins).toHaveLength(1);
    expect(recordedLogins[0]).toEqual({
      path: LOGIN_URI,
      body: { email: "user@gym.com", password: "secret" },
    });
    expect(emailInput.value).toBe("");
    expect(passwordInput.value).toBe("");
  });

  it("Should show an error toast and preserve the input when login fails", async () => {
    loginStatus = 401;
    const { result } = renderLoginHandler();
    const { event, emailInput, passwordInput } = buildLoginSubmitEvent(
      "user@gym.com",
      "wrong",
    );

    result.current.handleSubmit(event);

    const toast = await screen.findByRole("status");
    expect(toast).toHaveTextContent(
      "Cannot succeed login operation: Invalid credentials",
    );

    expect(navigateMock).not.toHaveBeenCalled();
    expect(result.current.error).toMatchObject({
      message: "Invalid credentials",
    });
    expect(emailInput.value).toBe("user@gym.com");
    expect(passwordInput.value).toBe("wrong");
  });

  it("Should ignore a second submit while the login request is pending", async () => {
    loginDelayMs = 50;
    const { result } = renderLoginHandler();
    const { event } = buildLoginSubmitEvent("user@gym.com", "secret");

    result.current.handleSubmit(event);

    await waitFor(() => expect(result.current.isPending).toBe(true));
    result.current.handleSubmit(event);

    await waitFor(() =>
      expect(navigateMock).toHaveBeenCalledWith(HOME_ROUTE),
    );

    expect(recordedLogins).toHaveLength(1);
  });
});
