import "@testing-library/jest-dom/vitest";
import { afterAll, afterEach, beforeAll } from "vitest";
import { server } from "@/test/mocks/server";

if (!Blob.prototype.stream) {
  Blob.prototype.stream = function (this: Blob): ReadableStream<Uint8Array<ArrayBuffer>> {
    return new ReadableStream<Uint8Array<ArrayBuffer>>({
      async start(controller) {
        const buffer = await Blob.prototype.arrayBuffer();
        controller.enqueue(new Uint8Array(buffer));
        controller.close();
      },
    });
  };
}

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
