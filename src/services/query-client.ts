import { QueryClient } from "@tanstack/react-query";

export const getQueryAppClient = () => queryClient;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30_000),
      refetchInterval: 5_000,
      gcTime: 1000 * 60 * 10,
    },
    mutations: {
      meta: { clearAll: false, clearAudit: false },
    },
  },
});
