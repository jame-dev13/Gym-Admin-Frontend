const queryKeyProvider = {
  administration: ["administration"] as const,
  subscriber: ["subscriber"] as const,
} as const;

export const getQueryKeyProvider = () => queryKeyProvider;