import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.polyfills.ts", "./src/test/setup.ts"],
    css: false,
    // jsdom setup dominated the suite (60 fresh environments, ~47% of run
    // time). vmThreads builds the environment once per worker while keeping
    // per-file isolation, as suggested by Vitest's own run diagnostics.
    pool: "vmThreads",
    // Persist transformed modules between runs so repeat/CI-adjacent runs
    // skip re-transforming the unchanged module graph.
    fsModuleCache: true,
    deps: {
      web: {
        // No test imports static assets; skip the Vite asset pipeline.
        transformAssets: false,
      },
    },
    restoreMocks: true,
    clearMocks: true,
    env: {
      VITE_RECOVERY: process.env.VITE_RECOVERY ?? "/auth/recover",
    },
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "src/main.tsx",
        "src/vite-env.d.ts",
        "src/test/**",
        "src/**/*.d.ts",
      ],
    },
  },
});
