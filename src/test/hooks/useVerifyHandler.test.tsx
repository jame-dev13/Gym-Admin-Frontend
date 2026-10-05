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
import { useHandleVerify } from "@/features/auth/hooks/verification";

const VERIFY_URI = import.meta.env.VITE_VERIFICATION as string;
const LOGIN_ROUTE = "/auth/login";

const { navigateMock } = vi.hoisted(() => ({ navigateMock: vi.fn() }));

vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router-dom")>();
  return { ...actual, useNavigate: () => navigateMock };
});

type RecordedVerify = { path: string; body: unknown };

const recordedVerifies: RecordedVerify[] = [];
let verifyStatus = 200;
let verifyDelayMs = 0;

const renderVerifyHandler = () => {
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

  return renderHook(() => useHandleVerify(), { wrapper });
};

const buildVerifySubmitEvent = (email: string, token: string) => {
  const form = document.createElement("form");
  const emailInput = document.createElement("input");
  emailInput.name = "email";
  emailInput.value = email;
  form.append(emailInput);
  const tokenInputs = token.split("").map((char) => {
    const cell = document.createElement("input");
    cell.name = "token";
    cell.value = char;
    form.append(cell);
    return cell;
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

describe("useHandleVerify suite", () => {
  it("Shouldn't be undefined", () => {
    const { result } = renderVerifyHandler();

    expect(result).toBeDefined();
    expect(result.current).toBeDefined();
    expect(typeof result.current.handleSubmit).toBe("function");
  });

  it("Should patch the form payload and navigate to login on success", async () => {
    const { result } = renderVerifyHandler();
    const { event, emailInput, tokenInputs } = buildVerifySubmitEvent(
      "jane@gym.com",
      "ABC123",
    );

    result.current.handleSubmit(event);

    await waitFor(() =>
      expect(navigateMock).toHaveBeenCalledWith(LOGIN_ROUTE),
    );

    expect(recordedVerifies).toHaveLength(1);
    expect(recordedVerifies[0]).toEqual({
      path: VERIFY_URI,
      body: { email: "jane@gym.com", token: "ABC123" },
    });
    expect(emailInput.value).toBe("");
    for (const cell of tokenInputs) {
      expect(cell.value).toBe("");
    }
  });

  it("Should show an error toast and preserve the input when verify fails", async () => {
    verifyStatus = 400;
    const { result } = renderVerifyHandler();
    const { event, emailInput, tokenInputs } = buildVerifySubmitEvent(
      "jane@gym.com",
      "ABC123",
    );

    result.current.handleSubmit(event);

    const toast = await screen.findByRole("status");
    expect(toast).toHaveTextContent(
      "Cannot succeed verification operation: Invalid verification code",
    );

    expect(navigateMock).not.toHaveBeenCalled();
    expect(result.current.error).toMatchObject({
      message: "Invalid verification code",
    });
    expect(emailInput.value).toBe("jane@gym.com");
    expect(tokenInputs.map((cell) => cell.value).join("")).toBe("ABC123");
  });

  it("Should fail fast without mutating when the email entry is missing", () => {
    const { result } = renderVerifyHandler();
    const form = document.createElement("form");
    const cell = document.createElement("input");
    cell.name = "token";
    cell.value = "A";
    form.append(cell);
    const event = {
      preventDefault: vi.fn(),
      currentTarget: form,
    } as unknown as React.SubmitEvent<HTMLFormElement>;

    expect(() => result.current.handleSubmit(event)).toThrow(
      "Email is required to verify the account",
    );
    expect(recordedVerifies).toHaveLength(0);
    expect(navigateMock).not.toHaveBeenCalled();
  });

  it("Should ignore a second submit while the verify request is pending", async () => {
    verifyDelayMs = 50;
    const { result } = renderVerifyHandler();
    const { event } = buildVerifySubmitEvent("jane@gym.com", "ABC123");

    result.current.handleSubmit(event);

    await waitFor(() => expect(result.current.isPending).toBe(true));
    result.current.handleSubmit(event);

    await waitFor(() =>
      expect(navigateMock).toHaveBeenCalledWith(LOGIN_ROUTE),
    );

    expect(recordedVerifies).toHaveLength(1);
  });
});
