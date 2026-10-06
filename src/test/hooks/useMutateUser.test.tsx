import {
  useCreateUser,
  useDeleteUser,
  useHardDeleteUser,
  useRecoverUser,
  useUpdateUser,
} from "@/features/user/hooks/useMutateUser";
import type {
  UserRequest,
  UserResponse,
  UserUpdateRequest,
} from "@/features/user/types";
import { server } from "@/test/mocks/server";
import type { Query } from "@tanstack/react-query";
import { waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { API_BASE_URL, renderClientHook } from "./test-utils";

const USER_BASE = `${import.meta.env.VITE_ADMINISTRATION_V1 as string}/users`;

const createdUser: UserResponse = {
  id: "u1",
  name: "Ada Admin",
  email: "ada@gym.test",
  authProvider: "LOCAL",
  roles: ["ADMIN"],
  isCustomer: false,
  customerId: null,
};

const createBody: UserRequest = {
  name: "Ada Admin",
  email: "ada@gym.test",
  password: "secret",
  authProvider: "LOCAL",
  roles: ["ADMIN"],
};

const updateBody: UserUpdateRequest = {
  name: "Ada Updated",
  email: "ada@gym.test",
  roles: ["ADMIN"],
};

const errorBody = { message: "Users could not be saved", status: 500 };

type RecordedMutation = { method: string; path: string; body: unknown };

const recordedMutations: RecordedMutation[] = [];

const mutationHandler =
  (method: string, status: number) =>
  async ({ request }: { request: Request }) => {
    const url = new URL(request.url);
    const body = await request.json().catch(() => undefined);
    recordedMutations.push({ method, path: url.pathname, body });
    return HttpResponse.json(createdUser, { status });
  };

const voidHandler =
  (method: string) =>
  async ({ request }: { request: Request }) => {
    const url = new URL(request.url);
    recordedMutations.push({ method, path: url.pathname, body: undefined });
    return new HttpResponse(null, { status: 200 });
  };

const fakeQuery = (queryKey: ReadonlyArray<unknown>) =>
  ({ queryKey }) as unknown as Query;

beforeEach(() => {
  recordedMutations.length = 0;
  server.use(
    http.post(`${API_BASE_URL}${USER_BASE}`, mutationHandler("post", 201)),
    http.put(`${API_BASE_URL}${USER_BASE}/u1`, mutationHandler("put", 200)),
    http.patch(
      `${API_BASE_URL}${USER_BASE}/u1/recover`,
      voidHandler("patch"),
    ),
    http.delete(`${API_BASE_URL}${USER_BASE}/u1`, voidHandler("delete")),
    http.delete(
      `${API_BASE_URL}${USER_BASE}/u1/hard`,
      voidHandler("delete"),
    ),
  );
});

describe("useCreateUser", () => {
  it("posts the request body and resolves { payload, status }", async () => {
    const { result } = renderClientHook(() => useCreateUser());

    result.current.mutate(createBody);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual({ payload: createdUser, status: 201 });
    expect(recordedMutations).toHaveLength(1);
    expect(recordedMutations[0]).toMatchObject({
      method: "post",
      path: USER_BASE,
      body: createBody,
    });
  });

  it("invalidates audit queries and the user key on success", async () => {
    const { client, result } = renderClientHook(() => useCreateUser());
    const invalidateSpy = vi.spyOn(client, "invalidateQueries");

    result.current.mutate(createBody);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(invalidateSpy).toHaveBeenCalledTimes(2);
    const auditCall = invalidateSpy.mock.calls[0]?.[0] as {
      predicate?: (query: Query) => boolean;
    };
    expect(auditCall?.predicate).toBeTypeOf("function");
    expect(auditCall.predicate?.(fakeQuery(["audit", "events"]))).toBe(true);
    expect(auditCall.predicate?.(fakeQuery(["administration", "user"]))).toBe(
      false,
    );
    expect(invalidateSpy.mock.calls[1]?.[0]).toEqual({
      queryKey: ["administration", "user"],
      exact: false,
    });
  });

  it("does not invalidate anything when the request fails", async () => {
    server.use(
      http.post(`${API_BASE_URL}${USER_BASE}`, () =>
        HttpResponse.json(errorBody, { status: 500 }),
      ),
    );
    const { client, result } = renderClientHook(() => useCreateUser());
    const invalidateSpy = vi.spyOn(client, "invalidateQueries");

    result.current.mutate(createBody);

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toMatchObject(errorBody);
    expect(invalidateSpy).not.toHaveBeenCalled();
  });
});

describe("useUpdateUser", () => {
  it("puts the update body on the user detail uri", async () => {
    const { result } = renderClientHook(() => useUpdateUser({ id: "u1" }));

    result.current.mutate(updateBody);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual({ payload: createdUser, status: 200 });
    expect(recordedMutations).toHaveLength(1);
    expect(recordedMutations[0]).toMatchObject({
      method: "put",
      path: `${USER_BASE}/u1`,
      body: updateBody,
    });
  });
});

describe("useRecoverUser", () => {
  it("patches the recover action uri without a body", async () => {
    const { result } = renderClientHook(() => useRecoverUser({ id: "u1" }));

    result.current.mutate(undefined);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.status).toBe(200);
    expect(recordedMutations).toHaveLength(1);
    expect(recordedMutations[0]).toMatchObject({
      method: "patch",
      path: `${USER_BASE}/u1/recover`,
      body: undefined,
    });
  });
});

describe("useDeleteUser", () => {
  it("deletes the user detail uri without a body", async () => {
    const { result } = renderClientHook(() => useDeleteUser({ id: "u1" }));

    result.current.mutate(undefined);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.status).toBe(200);
    expect(recordedMutations).toHaveLength(1);
    expect(recordedMutations[0]).toMatchObject({
      method: "delete",
      path: `${USER_BASE}/u1`,
      body: undefined,
    });
  });
});

describe("useHardDeleteUser", () => {
  it("deletes the hard action uri without a body", async () => {
    const { result } = renderClientHook(() => useHardDeleteUser({ id: "u1" }));

    result.current.mutate(undefined);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.status).toBe(200);
    expect(recordedMutations).toHaveLength(1);
    expect(recordedMutations[0]).toMatchObject({
      method: "delete",
      path: `${USER_BASE}/u1/hard`,
      body: undefined,
    });
  });
});
