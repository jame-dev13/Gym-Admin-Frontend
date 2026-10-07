/**
 * Web-stream globals for the `vmThreads` pool.
 *
 * Each test file runs inside a `vm` context whose globals do not include
 * Node's web-stream classes. MSW references `TransformStream` at module
 * scope, so it must exist before `@/test/mocks/server` is imported.
 * This file therefore has to stay first in `setupFiles`.
 */
import {
  ReadableStream,
  TransformStream,
  WritableStream,
} from "node:stream/web";

const WEB_STREAMS = {
  ReadableStream,
  TransformStream,
  WritableStream,
} as const;

for (const [name, stream] of Object.entries(WEB_STREAMS)) {
  if (globalThis[name as keyof typeof globalThis] === undefined) {
    Object.defineProperty(globalThis, name, {
      value: stream,
      writable: true,
      configurable: true,
    });
  }
}
