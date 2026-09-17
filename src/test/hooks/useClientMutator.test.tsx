import { useMutationMapping } from "@/hooks/useClientMutator";
import { server } from "@/test/mocks/server";
import { waitFor } from "@testing-library/react";
import type { Query } from "@tanstack/react-query";
import { http, HttpResponse } from "msw";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  API_BASE_URL,
  renderClientHook,
  type Show,
} from "./test-utils";

const CREATE_URI = "/shows";
const FAIL_URI = "/shows/fail";
const createdShow: Show = { id: 4, title: "New Show" };
const errorBody = { message: "Mutation failed", status: 500 };

type RecordedMutation = { method: string; path: string; body: unknown };

const recordedMutations: RecordedMutation[] = [];

const mutationHandler =
  (method: string, status: number) =>
  async ({ request }: { request: Request }) => {
    const url = new URL(request.url);
    const body = await request.json().catch(() => undefined);
    recordedMutations.push({ method, path: url.pathname, body });
    return HttpResponse.json(createdShow, { status });
  };

beforeEach(() => {
  recordedMutations.length = 0;
  server.use(
    http.post(`${API_BASE_URL}${CREATE_URI}`, mutationHandler("post", 201)),
    http.put(`${API_BASE_URL}${CREATE_URI}`, mutationHandler("put", 200)),
    http.patch(`${API_BASE_URL}${CREATE_URI}`, mutationHandler("patch", 200)),
    http.delete(`${API_BASE_URL}${CREATE_URI}`, mutationHandler("delete", 200)),
    http.post(`${API_BASE_URL}${FAIL_URI}`, () =>
      HttpResponse.json(errorBody, { status: 500 }),
    ),
  );
});

const fakeQuery = (queryKey: ReadonlyArray<unknown>) =>
  ({ queryKey }) as unknown as Query;

const methods = [
  { method: "post", status: 201 },
  { method: "put", status: 200 },
  { method: "patch", status: 200 },
  { method: "delete", status: 200 },
] as const;

describe("useMutationMapping", () => {
  it.each(methods)(
    "performs a $method request and resolves { payload, status }",
    async ({ method, status }) => {
      const { result } = renderClientHook(() =>
        useMutationMapping<Show, Show>({
          uri: CREATE_URI,
          method,
          invalidateKey: ["shows"],
        }),
      );

      const body: Show = { id: 1, title: "Updated Show" };
      result.current.mutate(body);

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual({ payload: createdShow, status });
      expect(recordedMutations).toHaveLength(1);
      expect(recordedMutations[0].method).toBe(method);
      expect(recordedMutations[0].path).toBe(CREATE_URI);
      expect(recordedMutations[0].body).toEqual(body);
    },
  );

  describe("cache invalidation", () => {
    it("invalidates the provided key on success", async () => {
      const { client, result } = renderClientHook(() =>
        useMutationMapping<Show, Show>({
          uri: CREATE_URI,
          method: "post",
          invalidateKey: ["shows"],
        }),
      );
      const invalidateSpy = vi.spyOn(client, "invalidateQueries");

      result.current.mutate(createdShow);

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(invalidateSpy).toHaveBeenCalledTimes(1);
      expect(invalidateSpy).toHaveBeenCalledWith({
        queryKey: ["shows"],
        exact: false,
      });
    });

    it("invalidates the whole cache when meta.clearAll is set", async () => {
      const { client, result } = renderClientHook(() =>
        useMutationMapping<Show, Show>({
          uri: CREATE_URI,
          method: "post",
          invalidateKey: ["shows"],
          options: { meta: { clearAll: true } },
        }),
      );
      const invalidateSpy = vi.spyOn(client, "invalidateQueries");

      result.current.mutate(createdShow);

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(invalidateSpy).toHaveBeenCalledTimes(1);
      expect(invalidateSpy).toHaveBeenCalledWith();
    });

    it("invalidates only audit queries when meta.clearAudit is set", async () => {
      const { client, result } = renderClientHook(() =>
        useMutationMapping<Show, Show>({
          uri: CREATE_URI,
          method: "post",
          invalidateKey: ["shows"],
          options: { meta: { clearAudit: true } },
        }),
      );
      const invalidateSpy = vi.spyOn(client, "invalidateQueries");

      result.current.mutate(createdShow);

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      const call = invalidateSpy.mock.calls[0]?.[0] as {
        predicate?: (query: Query) => boolean;
      };
      expect(call?.predicate).toBeTypeOf("function");
      expect(call.predicate?.(fakeQuery(["audit", "events"]))).toBe(true);
      expect(call.predicate?.(fakeQuery(["shows"]))).toBe(false);
    });

    it("does not invalidate anything when the request fails", async () => {
      const { client, result } = renderClientHook(() =>
        useMutationMapping<Show, Show>({
          uri: FAIL_URI,
          method: "post",
          invalidateKey: ["shows"],
        }),
      );
      const invalidateSpy = vi.spyOn(client, "invalidateQueries");

      result.current.mutate(createdShow);

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(invalidateSpy).not.toHaveBeenCalled();
    });
  });

  describe("options", () => {
    it("merges custom options and invokes the user onSettled callback", async () => {
      const onSuccess = vi.fn();
      const onSettled = vi.fn();

      const { result } = renderClientHook(() =>
        useMutationMapping<Show, Show>({
          uri: CREATE_URI,
          method: "post",
          invalidateKey: ["shows"],
          options: { onSuccess, onSettled },
        }),
      );

      result.current.mutate(createdShow);

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(onSuccess).toHaveBeenCalledTimes(1);
      expect(onSettled).toHaveBeenCalledTimes(1);
    });
  });
});