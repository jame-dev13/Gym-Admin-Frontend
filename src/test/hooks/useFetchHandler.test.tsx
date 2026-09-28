import { useFetchMapping, usePageFetchMapping } from "@/hooks/useClientFetcher";
import { useFetchHandler, usePageFetchHandler } from "@/hooks/useFetchHandler";
import { server } from "@/test/mocks/server";
import { waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  API_BASE_URL,
  renderClientHook,
  shows,
  showPage,
  type Show,
} from "./test-utils";

const errorBody = { message: "Shows could not be loaded", status: 500 };

const requests: string[] = [];

beforeEach(() => {
  requests.length = 0;
  const record = ({ request }: { request: Request }) => {
    requests.push(new URL(request.url).pathname);
  };
  server.use(
    http.get(`${API_BASE_URL}/handler-shows`, ({ request }) => {
      record({ request });
      return HttpResponse.json(shows);
    }),
    http.get(`${API_BASE_URL}/handler-shows/error`, () =>
      HttpResponse.json(errorBody, { status: 500 }),
    ),
    http.get(`${API_BASE_URL}/handler-shows/page`, ({ request }) => {
      record({ request });
      return HttpResponse.json(showPage);
    }),
    http.get(`${API_BASE_URL}/handler-shows/page/error`, () =>
      HttpResponse.json(errorBody, { status: 500 }),
    ),
  );
});

describe("useFetchHandler", () => {
  it("exposes the fetched payload and fires onSuccess and onSettled", async () => {
    const onSuccess = vi.fn();
    const onError = vi.fn();
    const onSettled = vi.fn();

    const { result } = renderClientHook(() => {
      const query = useFetchMapping<Show>({
        uri: "/handler-shows",
        queryKey: ["handler-shows"],
      });
      return useFetchHandler<Show>({
        fetchHook: () => query,
        resultHandlers: { onSuccess, onError, onSettled },
      });
    });

    await waitFor(() => expect(result.current.fetch.isPending).toBe(false));

    expect(result.current.fetch.payload).toEqual(shows);
    expect(onSuccess).toHaveBeenCalledTimes(1);
    expect(onSuccess).toHaveBeenCalledWith({ data: shows, status: 200 });
    expect(onError).not.toHaveBeenCalled();
    expect(onSettled).toHaveBeenCalledTimes(1);
    expect(onSettled).toHaveBeenCalledWith(
      { data: shows, status: 200 },
      undefined,
    );
  });

  it("fires onError and onSettled with the API error on failure", async () => {
    const onSuccess = vi.fn();
    const onError = vi.fn();
    const onSettled = vi.fn();

    const { result } = renderClientHook(() => {
      const query = useFetchMapping<Show>({
        uri: "/handler-shows/error",
        queryKey: ["handler-shows-error"],
      });
      return useFetchHandler<Show>({
        fetchHook: () => query,
        resultHandlers: { onSuccess, onError, onSettled },
      });
    });

    await waitFor(() => expect(result.current.error).toBeDefined());
    await waitFor(() => expect(onError).toHaveBeenCalledTimes(1));

    expect(result.current.fetch.payload).toBeUndefined();
    expect(onSuccess).not.toHaveBeenCalled();
    expect(onError).toHaveBeenCalledWith(
      expect.objectContaining({ message: errorBody.message }),
    );
    expect(onSettled).toHaveBeenCalledTimes(1);
    expect(onSettled).toHaveBeenCalledWith(
      undefined,
      expect.objectContaining({ message: errorBody.message }),
    );
  });

  it("skips every result handler while the abort expression holds", async () => {
    const onSuccess = vi.fn();
    const onError = vi.fn();
    const onSettled = vi.fn();

    const { result } = renderClientHook(() => {
      const query = useFetchMapping<Show>({
        uri: "/handler-shows",
        queryKey: ["handler-shows-aborted"],
      });
      return useFetchHandler<Show>({
        fetchHook: () => query,
        abortExpression: true,
        resultHandlers: { onSuccess, onError, onSettled },
      });
    });

    await waitFor(() => expect(result.current.fetch.isPending).toBe(false));

    expect(result.current.fetch.payload).toEqual(shows);
    expect(onSuccess).not.toHaveBeenCalled();
    expect(onError).not.toHaveBeenCalled();
    expect(onSettled).not.toHaveBeenCalled();
  });

  it("performRefetch issues a new request once settled", async () => {
    const { result } = renderClientHook(() => {
      const query = useFetchMapping<Show>({
        uri: "/handler-shows",
        queryKey: ["handler-shows-refetch"],
      });
      return useFetchHandler<Show>({ fetchHook: () => query });
    });

    await waitFor(() => expect(result.current.fetch.isPending).toBe(false));
    expect(requests).toHaveLength(1);

    await result.current.refetch.performRefetch();

    await waitFor(() => expect(requests).toHaveLength(2));
  });
});

describe("usePageFetchHandler", () => {
  it("exposes content and page info and fires onSuccess and onSettled", async () => {
    const onSuccess = vi.fn();
    const onError = vi.fn();
    const onSettled = vi.fn();

    const { result } = renderClientHook(() => {
      const query = usePageFetchMapping<Show>({
        uri: "/handler-shows/page",
        queryKey: ["handler-shows-page"],
      });
      return usePageFetchHandler<Show>({
        pageFetchHook: () => query,
        resultHandlers: { onSuccess, onError, onSettled },
      });
    });

    await waitFor(() => expect(result.current.page.isPending).toBe(false));

    expect(result.current.page.content).toEqual(shows);
    expect(result.current.page.pageInfo).toEqual(showPage.page);
    expect(onSuccess).toHaveBeenCalledTimes(1);
    expect(onSuccess).toHaveBeenCalledWith(showPage);
    expect(onError).not.toHaveBeenCalled();
    expect(onSettled).toHaveBeenCalledTimes(1);
    expect(onSettled).toHaveBeenCalledWith(showPage, undefined);
  });

  it("fires onError and onSettled with the API error on failure", async () => {
    const onSuccess = vi.fn();
    const onError = vi.fn();
    const onSettled = vi.fn();

    const { result } = renderClientHook(() => {
      const query = usePageFetchMapping<Show>({
        uri: "/handler-shows/page/error",
        queryKey: ["handler-shows-page-error"],
      });
      return usePageFetchHandler<Show>({
        pageFetchHook: () => query,
        resultHandlers: { onSuccess, onError, onSettled },
      });
    });

    await waitFor(() => expect(result.current.error).toBeDefined());
    await waitFor(() => expect(onError).toHaveBeenCalledTimes(1));

    expect(result.current.page.content).toBeUndefined();
    expect(onSuccess).not.toHaveBeenCalled();
    expect(onSettled).toHaveBeenCalledTimes(1);
    expect(onSettled).toHaveBeenCalledWith(
      undefined,
      expect.objectContaining({ message: errorBody.message }),
    );
  });

  it("skips every result handler while the abort expression holds", async () => {
    const onSuccess = vi.fn();
    const onSettled = vi.fn();

    const { result } = renderClientHook(() => {
      const query = usePageFetchMapping<Show>({
        uri: "/handler-shows/page",
        queryKey: ["handler-shows-page-aborted"],
      });
      return usePageFetchHandler<Show>({
        pageFetchHook: () => query,
        abortExpression: true,
        resultHandlers: { onSuccess, onSettled },
      });
    });

    await waitFor(() => expect(result.current.page.isPending).toBe(false));

    expect(result.current.page.content).toEqual(shows);
    expect(onSuccess).not.toHaveBeenCalled();
    expect(onSettled).not.toHaveBeenCalled();
  });
});
