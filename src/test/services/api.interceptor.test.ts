import { server } from "@/test/mocks/server";
import { delay, http, HttpResponse } from "msw";
import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";

const API_BASE = "http://api.test";
const PROTECTED_PATH = "/protected";
const REFRESH_PATH = "/auth/refresh";
const LOGOUT_PATH = "/auth/logout";

vi.stubEnv("VITE_BASE", API_BASE);
vi.stubEnv("VITE_AUTH_REFRESH", REFRESH_PATH);
vi.stubEnv("VITE_AUTH_LOGOUT", LOGOUT_PATH);

type ApiModule = typeof import("@/services/api");

const accessError = {
  status: 401,
  code: "ACCESS_OPERATION",
  message: "Access token expired",
};

let api: ApiModule["api"];
let refreshCalls = 0;
let logoutCalls = 0;
let protectedCalls = 0;
let refreshCredentials: RequestCredentials[] = [];

const unauthorized = () => HttpResponse.json(accessError, { status: 401 });

beforeEach(async () => {
  refreshCalls = 0;
  logoutCalls = 0;
  protectedCalls = 0;
  refreshCredentials = [];

  vi.resetModules();

  server.use(
    http.post(`${API_BASE}${REFRESH_PATH}`, async ({ request }) => {
      refreshCalls += 1;
      refreshCredentials.push(request.credentials);
      await delay(20);
      return HttpResponse.json({ refreshed: true });
    }),
    http.post(`${API_BASE}${LOGOUT_PATH}`, () => {
      logoutCalls += 1;
      return new HttpResponse(null, { status: 204 });
    }),
  );

  ({ api } = await import("@/services/api"));
});

describe("api response interceptor", () => {
  it("refreshes the session and retries the original request", async () => {
    server.use(
      http.get(`${API_BASE}${PROTECTED_PATH}`, () => {
        protectedCalls += 1;
        return protectedCalls === 1
          ? unauthorized()
          : HttpResponse.json({ ok: true });
      }),
    );

    const response = await api.get(PROTECTED_PATH);

    expect(response.data).toEqual({ ok: true });
    expect(refreshCalls).toBe(1);
    expect(refreshCredentials).toEqual(["include"]);
    expect(protectedCalls).toBe(2);
    expect(logoutCalls).toBe(0);
  });

  it("performs a single refresh for concurrent failed requests", async () => {
    server.use(
      http.get(`${API_BASE}${PROTECTED_PATH}/:id`, () => {
        protectedCalls += 1;
        return protectedCalls <= 2
          ? unauthorized()
          : HttpResponse.json({ ok: true });
      }),
    );

    const responses = await Promise.all([
      api.get(`${PROTECTED_PATH}/one`),
      api.get(`${PROTECTED_PATH}/two`),
    ]);

    expect(responses.map(({ data }) => data)).toEqual([
      { ok: true },
      { ok: true },
    ]);
    expect(refreshCalls).toBe(1);
    expect(protectedCalls).toBe(4);
    expect(logoutCalls).toBe(0);
  });

  it("logs out and rejects when the refresh fails", async () => {
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => undefined);

    server.use(
      http.get(`${API_BASE}${PROTECTED_PATH}`, () => {
        protectedCalls += 1;
        return unauthorized();
      }),
      http.post(`${API_BASE}${REFRESH_PATH}`, () => {
        refreshCalls += 1;
        return HttpResponse.json(
          { ...accessError, message: "Refresh token expired" },
          { status: 401 },
        );
      }),
    );

    await expect(api.get(PROTECTED_PATH)).rejects.toMatchObject({
      status: 401,
      code: "ACCESS_OPERATION",
      message: "Refresh token expired",
    });

    expect(refreshCalls).toBe(1);
    expect(protectedCalls).toBe(1);
    expect(logoutCalls).toBe(1);

    consoleError.mockRestore();
  });

  it("does not refresh again when the retried request fails", async () => {
    server.use(
      http.get(`${API_BASE}${PROTECTED_PATH}`, () => {
        protectedCalls += 1;
        return unauthorized();
      }),
    );

    await expect(
      api.get(PROTECTED_PATH, {
        headers: { "x-test-retry": "true" },
      }),
    ).rejects.toMatchObject(accessError);

    // The first failure triggers a refresh, the retry is rejected without
    // starting a second refresh or logging the user out.
    expect(refreshCalls).toBe(1);
    expect(protectedCalls).toBe(2);
    expect(logoutCalls).toBe(0);
  });
});

afterAll(() => {
  vi.unstubAllEnvs();
});
