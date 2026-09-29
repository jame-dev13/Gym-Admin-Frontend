import { useLogin } from "@/features/auth/hooks/useLogin";
import type { LoginResponse } from "@/features/auth/types";
import { server } from "@/test/mocks/server";
import { waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { beforeEach, describe, expect, it } from "vitest";
import { API_BASE_URL, renderClientHook } from "./test-utils";

const LOGIN_URI = import.meta.env.VITE_LOGIN as string;
const loginResponse: LoginResponse = { isUser: true, email: "user@gym.com" };
const errorBody = { message: "Invalid credentials", status: 401 };

type RecordedLogin = { path: string; body: unknown };

const recordedLogins: RecordedLogin[] = [];

beforeEach(() => {
  recordedLogins.length = 0;
  server.use(
    http.post(`${API_BASE_URL}${LOGIN_URI}`, async ({ request }) => {
      const url = new URL(request.url);
      const body = await request.json().catch(() => undefined);
      recordedLogins.push({ path: url.pathname, body });
      return HttpResponse.json(loginResponse, { status: 200 });
    }),
  );
});

describe("useLogin suite", () => {
  it("Shouldn't be undefined", () => {
    const { result } = renderClientHook(() => useLogin());

    expect(result).toBeDefined();
    expect(result.current).toBeDefined();
  });

  it("Should post the credentials and resolve the login payload", async () => {
    const { result } = renderClientHook(() => useLogin());

    const response = await result.current.mutateAsync({
      email: "user@gym.com",
      password: "secret",
    });

    expect(response.payload).toEqual(loginResponse);
    expect(recordedLogins).toHaveLength(1);
    expect(recordedLogins[0]).toEqual({
      path: LOGIN_URI,
      body: { email: "user@gym.com", password: "secret" },
    });
  });

  it("Should surface the ApiErrorResponse when credentials are rejected", async () => {
    server.use(
      http.post(`${API_BASE_URL}${LOGIN_URI}`, () =>
        HttpResponse.json(errorBody, { status: 401 }),
      ),
    );
    const { result } = renderClientHook(() => useLogin());

    const failure = await result.current
      .mutateAsync({ email: "user@gym.com", password: "wrong" })
      .then(
        () => undefined,
        (error: unknown) => error,
      );

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(failure).toMatchObject({ message: errorBody.message });
    expect(result.current.error).toMatchObject({ message: errorBody.message });
  });
});
