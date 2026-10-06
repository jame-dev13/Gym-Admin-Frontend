import { useGetUser, useGetUserPage } from "@/features/user/hooks/useFetchUser";
import { userQueryKeyProvider } from "@/features/user/services/UserQueryKeyProvider";
import type { UserResponse } from "@/features/user/types";
import { server } from "@/test/mocks/server";
import type { Page } from "@/types/Types";
import { waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { beforeEach, describe, expect, it } from "vitest";
import { API_BASE_URL, renderClientHook } from "./test-utils";

const USER_BASE = `${import.meta.env.VITE_ADMINISTRATION_V1}/users`;

const users: UserResponse[] = [
  {
    id: "u1",
    name: "Ada Admin",
    email: "ada@gym.test",
    authProvider: "LOCAL",
    roles: ["ADMIN"],
    isCustomer: false,
    customerId: null,
  },
  {
    id: "u2",
    name: "Ben Customer",
    email: "ben@gym.test",
    authProvider: "GOOGLE",
    roles: ["CUSTOMER"],
    isCustomer: true,
    customerId: "c1",
  },
];

const userPage: Page<UserResponse> = {
  content: users,
  page: { size: 2, number: 0, totalElements: 2, totalPages: 1 },
};

type RecordedRequest = { path: string; page: string | null; size: string | null };

const recordedRequests: RecordedRequest[] = [];

const record = (request: Request) => {
  const url = new URL(request.url);
  recordedRequests.push({
    path: url.pathname,
    page: url.searchParams.get("page"),
    size: url.searchParams.get("size"),
  });
};

const errorBody = { message: "Users could not be loaded", status: 500 };

beforeEach(() => {
  recordedRequests.length = 0;
  server.use(
    http.get(`${API_BASE_URL}${USER_BASE}`, ({ request }) => {
      record(request);
      return HttpResponse.json(userPage);
    }),
    http.get(`${API_BASE_URL}${USER_BASE}/u1`, ({ request }) => {
      record(request);
      return HttpResponse.json(users[0]);
    }),
    http.get(`${API_BASE_URL}${USER_BASE}/boom`, ({ request }) => {
      record(request);
      return HttpResponse.json(errorBody, { status: 500 });
    }),
  );
});

describe("useGetUserPage", () => {
  it("returns the user page payload", async () => {
    const { result } = renderClientHook(() => useGetUserPage());

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(userPage);
  });

  it("sends params as query string and bakes them into the key once", async () => {
    const params = { page: "0", size: "10" };
    const { client, result } = renderClientHook(() => useGetUserPage(params));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(recordedRequests[0].page).toBe("0");
    expect(recordedRequests[0].size).toBe("10");
    expect(client.getQueryCache().getAll()[0]?.queryKey).toEqual([
      ...userQueryKeyProvider.administration.all(),
      "page",
      params,
    ]);
  });

  it("surfaces the API error response on failed requests", async () => {
    server.use(
      http.get(`${API_BASE_URL}${USER_BASE}`, () =>
        HttpResponse.json(errorBody, { status: 500 }),
      ),
    );
    const { result } = renderClientHook(() => useGetUserPage());

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toMatchObject(errorBody);
  });
});

describe("useGetUser", () => {
  it("returns the user wrapped with its HTTP status", async () => {
    const { client, result } = renderClientHook(() => useGetUser({ id: "u1" }));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual({ data: users[0], status: 200 });
    expect(recordedRequests[0].path).toBe(`${USER_BASE}/u1`);
    expect(client.getQueryCache().getAll()[0]?.queryKey).toEqual([
      ...userQueryKeyProvider.administration.all(),
      "detail",
      "u1",
    ]);
  });

  it("stays idle without an id and fetches once it arrives", async () => {
    const { result, rerender } = renderClientHook(
      ({ id }: { id: string | number | null }) => useGetUser({ id }),
      { initialProps: { id: "" as string | number | null } },
    );

    expect(recordedRequests).toHaveLength(0);

    rerender({ id: "u1" });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(recordedRequests).toHaveLength(1);
    expect(result.current.data).toEqual({ data: users[0], status: 200 });
  });

  it("surfaces the API error response on failed requests", async () => {
    const { result } = renderClientHook(() => useGetUser({ id: "boom" }));

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toMatchObject(errorBody);
  });
});
