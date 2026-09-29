import { useMutationMapping } from "@/hooks/useClientMutator";
import { useMutationHandler } from "@/hooks/useMutationHandler";
import { server } from "@/test/mocks/server";
import { waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { API_BASE_URL, renderClientHook, type Show } from "./test-utils";
import type React from "react";

const CREATE_URI = "/handler-shows";
const FAIL_URI = "/handler-shows/fail";
const createdShow: Show = { id: 9, title: "Created Show" };
const errorBody = { message: "Mutation failed", status: 500 };

type RecordedMutation = { path: string; body: unknown };

const recordedMutations: RecordedMutation[] = [];

beforeEach(() => {
  recordedMutations.length = 0;
  server.use(
    http.post(`${API_BASE_URL}${CREATE_URI}`, async ({ request }) => {
      const url = new URL(request.url);
      const body = await request.json().catch(() => undefined);
      recordedMutations.push({ path: url.pathname, body });
      return HttpResponse.json(createdShow, { status: 201 });
    }),
    http.patch(`${API_BASE_URL}${CREATE_URI}`, async ({ request }) => {
      const url = new URL(request.url);
      const body = await request.json().catch(() => undefined);
      recordedMutations.push({ path: url.pathname, body });
      return HttpResponse.json(createdShow, { status: 200 });
    }),
    http.post(`${API_BASE_URL}${FAIL_URI}`, () =>
      HttpResponse.json(errorBody, { status: 500 }),
    ),
  );
});

const buildSubmitEvent = (title: string) => {
  const form = document.createElement("form");
  const input = document.createElement("input");
  input.name = "title";
  input.value = title;
  form.append(input);
  return {
    event: {
      preventDefault: vi.fn(),
      currentTarget: form,
    } as unknown as React.SubmitEvent<HTMLFormElement>,
    form,
    input,
  };
};

describe("useMutationHandler", () => {
  it("builds the payload from the form, posts it, and resets the form on success", async () => {
    const onSuccess = vi.fn();
    const onSettled = vi.fn();

    const { result } = renderClientHook(() => {
      const mutation = useMutationMapping<Show, Show>({
        uri: CREATE_URI,
        method: "post",
        invalidateKey: ["handler-shows"],
      });
      return useMutationHandler<Show, Show>({
        mutationHook: () => mutation,
        payloadBuilder: (formData) => ({
          id: 0,
          title: String(formData?.get("title") ?? ""),
        }),
        resultHandlers: { onSuccess, onSettled },
      });
    });

    const { event, input } = buildSubmitEvent("Fresh Show");
    result.current.submit(event);

    await waitFor(() => expect(onSuccess).toHaveBeenCalledTimes(1));

    expect(onSuccess).toHaveBeenCalledWith(createdShow);
    expect(recordedMutations).toHaveLength(1);
    expect(recordedMutations[0]).toEqual({
      path: CREATE_URI,
      body: { id: 0, title: "Fresh Show" },
    });
    expect(onSettled).toHaveBeenCalledTimes(1);
    expect(input.value).toBe("");
  });

  it("supports bodiless mutations without a payload builder", async () => {
    const onSuccess = vi.fn();

    const { result } = renderClientHook(() => {
      const mutation = useMutationMapping<void, Show>({
        uri: CREATE_URI,
        method: "patch",
        invalidateKey: ["handler-shows"],
      });
      return useMutationHandler<void, Show>({
        mutationHook: () => mutation,
        resultHandlers: { onSuccess },
      });
    });

    const { event } = buildSubmitEvent("Ignored");
    result.current.submit(event);

    await waitFor(() => expect(onSuccess).toHaveBeenCalledTimes(1));

    expect(onSuccess).toHaveBeenCalledWith(createdShow);
    expect(recordedMutations).toHaveLength(1);
    expect(recordedMutations[0]?.path).toBe(CREATE_URI);
    expect(recordedMutations[0]?.body).toBeUndefined();
  });

  it("fires onError and preserves the user input when the request fails", async () => {
    const onSuccess = vi.fn();
    const onError = vi.fn();

    const { result } = renderClientHook(() => {
      const mutation = useMutationMapping<Show, Show>({
        uri: FAIL_URI,
        method: "post",
        invalidateKey: ["handler-shows"],
      });
      return useMutationHandler<Show, Show>({
        mutationHook: () => mutation,
        payloadBuilder: (formData) => ({
          id: 0,
          title: String(formData?.get("title") ?? ""),
        }),
        resultHandlers: { onSuccess, onError },
      });
    });

    const { event, input } = buildSubmitEvent("Keep Me");
    result.current.submit(event);

    await waitFor(() => expect(onError).toHaveBeenCalledTimes(1));

    expect(onSuccess).not.toHaveBeenCalled();
    expect(onError).toHaveBeenCalledWith(
      expect.objectContaining({ message: errorBody.message }),
    );
    expect(result.current.error).toMatchObject({ message: errorBody.message });
    expect(input.value).toBe("Keep Me");
  });
});
