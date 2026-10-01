import { ToastProvider } from "@/context/ToastProvider";
import { useHandleRegister } from "@/features/auth/hooks/useRegisterHandler";
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

const REGISTER_URI = import.meta.env.VITE_REGISTER as string;
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

const renderRegisterHandler = () => {
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

  return renderHook(() => useHandleRegister(), { wrapper });
};

const buildRegisterSubmitEvent = (
  name: string,
  email: string,
  password: string,
) => {
  const form = document.createElement("form");
  const nameInput = document.createElement("input");
  nameInput.name = "name";
  nameInput.value = name;
  const emailInput = document.createElement("input");
  emailInput.name = "email";
  emailInput.value = email;
  const passwordInput = document.createElement("input");
  passwordInput.name = "password";
  passwordInput.value = password;
  form.append(nameInput, emailInput, passwordInput);
  return {
    event: {
      preventDefault: vi.fn(),
      currentTarget: form,
    } as unknown as React.SubmitEvent<HTMLFormElement>,
    nameInput,
    emailInput,
    passwordInput,
  };
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

describe("useHandleRegister suite", () => {
  it("Shouldn't be undefined", () => {
    const { result } = renderRegisterHandler();

    expect(result).toBeDefined();
    expect(result.current).toBeDefined();
    expect(typeof result.current.handleSubmit).toBe("function");
  });

  it("Should post the form payload and navigate to verification on success", async () => {
    const { result } = renderRegisterHandler();
    const { event, nameInput, emailInput, passwordInput } =
      buildRegisterSubmitEvent("Jane Doe", "jane@gym.com", "secret");

    result.current.handleSubmit(event);

    await waitFor(() =>
      expect(navigateMock).toHaveBeenCalledWith(VERIFICATION_ROUTE, {
        state: { email: "jane@gym.com" },
      }),
    );

    expect(recordedRegisters).toHaveLength(1);
    expect(recordedRegisters[0]).toEqual({
      path: REGISTER_URI,
      body: { name: "Jane Doe", email: "jane@gym.com", password: "secret" },
    });
    expect(nameInput.value).toBe("");
    expect(emailInput.value).toBe("");
    expect(passwordInput.value).toBe("");
  });

  it("Should show an error toast and preserve the input when register fails", async () => {
    registerStatus = 409;
    const { result } = renderRegisterHandler();
    const { event, nameInput, emailInput, passwordInput } =
      buildRegisterSubmitEvent("Jane Doe", "jane@gym.com", "secret");

    result.current.handleSubmit(event);

    const toast = await screen.findByRole("status");
    expect(toast).toHaveTextContent(
      "Cannot succeed register operation: Email already in use",
    );

    expect(navigateMock).not.toHaveBeenCalled();
    expect(result.current.error).toMatchObject({
      message: "Email already in use",
    });
    expect(nameInput.value).toBe("Jane Doe");
    expect(emailInput.value).toBe("jane@gym.com");
    expect(passwordInput.value).toBe("secret");
  });

  it("Should ignore a second submit while the register request is pending", async () => {
    registerDelayMs = 50;
    const { result } = renderRegisterHandler();
    const { event } = buildRegisterSubmitEvent(
      "Jane Doe",
      "jane@gym.com",
      "secret",
    );

    result.current.handleSubmit(event);

    await waitFor(() => expect(result.current.isPending).toBe(true));
    result.current.handleSubmit(event);

    await waitFor(() =>
      expect(navigateMock).toHaveBeenCalledWith(VERIFICATION_ROUTE, {
        state: { email: "jane@gym.com" },
      }),
    );

    expect(recordedRegisters).toHaveLength(1);
  });
});
