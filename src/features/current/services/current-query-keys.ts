export const getDomainKeyCurrent = () => "user-current";

export const getCurrentQueryKeys = () => currentQueryKeys;

const currentQueryKeys = {
  all: () => [...getDomainKeyCurrent()] as const,
  overview: () => [...currentQueryKeys.all(), "overview"] as const,
  info: () => [...currentQueryKeys.all(), "user-info"] as const,
};
