import { useDownloadAttachment } from "@/hooks/useDownload";
import { API_BASE_URL, renderClientHook } from "@/test/hooks/test-utils";
import { server } from "@/test/mocks/server";
import { waitFor } from "@testing-library/react";
import { delay, http, HttpResponse } from "msw";
import { beforeEach, describe, expect, it } from "vitest";

const SUCCESS_URI = "backups/download";
const NO_HEADER_URI = "backups/download-no-header";
const FAIL_URI = "backups/download-fail";
const SLOW_URI = "backups/download-slow";
const DISPOSITION = 'attachment; file="test_file.pdf"';
const errorBody = { message: "Download failed", status: 500 };

const recordedPaths: string[] = [];
const record = (request: Request) =>
  recordedPaths.push(new URL(request.url).pathname);

const pdfResponse = (disposition: string | null) =>
  new HttpResponse("test pdf content", {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      ...(disposition ? { "Content-Disposition": disposition } : {}),
    },
  });

const renderDownload = (uri: string) =>
  renderClientHook(() => useDownloadAttachment({ uri, queryKey: ["downloads"] }));

beforeEach(() => {
  recordedPaths.length = 0;
  server.use(
    http.get(`${API_BASE_URL}/${SUCCESS_URI}`, ({ request }) => {
      record(request);
      return pdfResponse(DISPOSITION);
    }),
    http.get(`${API_BASE_URL}/${NO_HEADER_URI}`, ({ request }) => {
      record(request);
      return pdfResponse(null);
    }),
    http.get(`${API_BASE_URL}/${FAIL_URI}`, () =>
      HttpResponse.json(errorBody, { status: 500 }),
    ),
    http.get(`${API_BASE_URL}/${SLOW_URI}`, async ({ request }) => {
      record(request);
      await delay(100);
      return pdfResponse(DISPOSITION);
    }),
  );
});

describe("useDownloadAttachment", () => {
  it("exposes the Content-Disposition header of the downloaded file", async () => {
    const { result } = renderDownload(SUCCESS_URI);
    await result.current.download();
    await waitFor(() => expect(result.current.content).toBe(DISPOSITION));
  });

  it("keeps content undefined when the header is missing", async () => {
    const { result } = renderDownload(NO_HEADER_URI);
    await result.current.download();
    await waitFor(() => expect(result.current.isDownloading).toBe(false));
    expect(result.current.content).toBeUndefined();
  });

  it("surfaces the error when the download fails", async () => {
    const { result } = renderDownload(FAIL_URI);
    result.current.download();
    await waitFor(() => expect(result.current.error).toBeDefined());
    expect(result.current.content).toBeUndefined();
  });

  it("does not fetch anything until download() is called", async () => {
    const { result } = renderDownload(SUCCESS_URI);
    expect(recordedPaths).toHaveLength(0);
    await result.current.download();
    await waitFor(() => expect(result.current.content).toBe(DISPOSITION));
    expect(recordedPaths).toEqual([`/${SUCCESS_URI}`]);
  });

  it("flags isDownloading while the download is in flight", async () => {
    const { result } = renderDownload(SLOW_URI);
    result.current.download();
    await waitFor(() => expect(result.current.isDownloading).toBe(true));
    await waitFor(() => expect(result.current.isDownloading).toBe(false));
  });
});