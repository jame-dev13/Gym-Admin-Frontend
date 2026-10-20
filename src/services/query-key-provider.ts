const queryKeyProvider = {
  administration: ["administration"] as const,
  current: ["current"] as const,
} as const;

export const getQueryKeyProvider = () => queryKeyProvider;