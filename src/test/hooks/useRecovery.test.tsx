import {
  useRecover,
  useRequestRecovery,
} from "@/features/auth/hooks/useRecovery";
import { server } from "@/test/mocks/server";
import { http, HttpResponse } from "msw";
import { beforeEach, describe, expect, it } from "vitest";
import { API_BASE_URL, renderClientHook } from "./test-utils";

const RECOVERY_URI = import.meta.env.VITE_RECOVERY as string;
const EMAIL = "jane@gym.com";
const TOKEN = "ABC123";

type RecordedRecovery = { path: string; body: unknown };

const recordedRecoveries: RecordedRecovery[] = [];

beforeEach(() => {
  recordedRecoveries.length = 0;
  server.use(
    http.post(`${API_BASE_URL}${RECOVERY_URI}/recover`, async ({ request }) => {
      const url = new URL(request.url);
      const body = await request.json().catch(() => undefined);
      recordedRecoveries.push({ path: url.pathname, body });
      return HttpResponse.json({}, { status: 200 });
    }),
    http.post(
      `${API_BASE_URL}${RECOVERY_URI}/activate`,
      async ({ request }) => {
        const url = new URL(request.url);
        const body = await request.json().catch(() => undefined);
        recordedRecoveries.push({ path: url.pathname, body });
        return HttpResponse.json({}, { status: 200 });
      },
    ),
  );
});

describe("useRecovery suite", () => {
  it("Should post only the email to the recover resource", async () => {
    const { result } = renderClientHook(() => useRequestRecovery());

    await result.current.mutateAsync({ email: EMAIL });

    expect(recordedRecoveries).toEqual([
      { path: `${RECOVERY_URI}/recover`, body: { email: EMAIL } },
    ]);
  });

  it("Should keep posting the email and token to the activate resource", async () => {
    const { result } = renderClientHook(() => useRecover());

    await result.current.mutateAsync({ email: EMAIL, token: TOKEN });

    expect(recordedRecoveries).toEqual([
      {
        path: `${RECOVERY_URI}/activate`,
        body: { email: EMAIL, token: TOKEN },
      },
    ]);
  });
});
