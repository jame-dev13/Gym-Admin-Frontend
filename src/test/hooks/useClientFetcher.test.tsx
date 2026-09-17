import { useFetchMapping, usePageFetchMapping } from "@/hooks/useClientFetcher";
import { server } from "@/test/mocks/server";
import { waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { beforeEach, describe, expect, it } from "vitest";
import {
  API_BASE_URL,
  featuredShows,
  renderClientHook,
  shows,
  showPage,
  type Show,
} from "./test-utils";

type RecordedRequest = { path: string; page: string | null };

const recordedRequests: RecordedRequest[] = [];

const record = (request: Request) => {
  const url = new URL(request.url);
  recordedRequests.push({
    path: url.pathname,
    page: url.searchParams.get("page"),
  });
};

const errorBody = { message: "Shows could not be loaded", status: 500 };

beforeEach(() => {
  recordedRequests.length = 0;
  server.use(
    http.get(`${API_BASE_URL}/shows`, ({ request }) => {
      record(request);
      return HttpResponse.json(shows);
    }),
    http.get(`${API_BASE_URL}/shows/next`, ({ request }) => {
      record(request);
      return HttpResponse.json(featuredShows);
    }),
    http.get(`${API_BASE_URL}/shows/error`, ({ request }) => {
      record(request);
      return HttpResponse.json(errorBody, { status: 500 });
    }),
    http.get(`${API_BASE_URL}/shows/page`, ({ request }) => {
      record(request);
      return HttpResponse.json(showPage);
    }),
    http.get(`${API_BASE_URL}/shows/page/error`, ({ request }) => {
      record(request);
      return HttpResponse.json(errorBody, { status: 500 });
    }),
  );
});

describe("useFetchMapping", () => {
  it("returns the fetched payload wrapped with its HTTP status", async () => {
    const { result } = renderClientHook(() =>
      useFetchMapping<Show>({ uri: "/shows", queryKey: ["shows"] }),
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual({ data: shows, status: 200 });
    expect(recordedRequests[0].path).toBe("/shows");
  });

  it("sends the provided params as query string", async () => {
    const { result } = renderClientHook(() =>
      useFetchMapping<Show>({
        uri: "/shows",
        queryKey: ["shows"],
        params: { params: { page: "0", size: "10" } },
      }),
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(recordedRequests[0].page).toBe("0");
    expect(result.current.data).toEqual({ data: shows, status: 200 });
  });

  it("honours options such as enabled:false without firing a request", () => {
    renderClientHook(() =>
      useFetchMapping<Show>({
        uri: "/shows",
        queryKey: ["shows"],
        options: { queryKey: ["shows"], enabled: false },
      }),
    );

    expect(recordedRequests).toHaveLength(0);
  });

  it("keeps the previous data while a new query key is loading", async () => {
    const { result, rerender } = renderClientHook(
      ({ uri }: { uri: string }) =>
        useFetchMapping<Show>({ uri, queryKey: [uri] }),
      { initialProps: { uri: "/shows" } },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    const firstSnapshot = result.current.data;

    rerender({ uri: "/shows/next" });

    expect(result.current.isPlaceholderData).toBe(true);
    expect(result.current.data).toBe(firstSnapshot);

    await waitFor(() => expect(result.current.isPlaceholderData).toBe(false));
    expect(result.current.data).toEqual({
      data: featuredShows,
      status: 200,
    });
  });

  it("surfaces the API error response on failed requests", async () => {
    const { result } = renderClientHook(() =>
      useFetchMapping<Show>({
        uri: "/shows/error",
        queryKey: ["shows-error"],
      }),
    );

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toMatchObject(errorBody);
  });
});

describe("usePageFetchMapping", () => {
  it("returns the page payload as Page<T>", async () => {
    const { result } = renderClientHook(() =>
      usePageFetchMapping<Show>({
        uri: "/shows/page",
        queryKey: ["shows", "page"],
      }),
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(showPage);
  });

  it("sends params and bakes them into its query key", async () => {
    const { result, rerender } = renderClientHook(
      ({ params }: { params: Record<string, unknown> }) =>
        usePageFetchMapping<Show>({
          uri: "/shows/page",
          queryKey: ["shows", "page"],
          params,
        }),
      { initialProps: { params: { page: "0" } } },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(recordedRequests[0].page).toBe("0");

    rerender({ params: { page: "1" } });

    await waitFor(() => expect(recordedRequests).toHaveLength(2));
    expect(recordedRequests[1].page).toBe("1");
    expect(result.current.data).toEqual(showPage);
  });

  it("surfaces the API error response on failed requests", async () => {
    const { result } = renderClientHook(() =>
      usePageFetchMapping<Show>({
        uri: "/shows/page/error",
        queryKey: ["shows", "page-error"],
      }),
    );

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toMatchObject(errorBody);
  });
});