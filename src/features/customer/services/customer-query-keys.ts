import { getQueryKeyProvider } from "@/services/query-key-provider";
import type { Identifiable } from "@/types/Types";

const { administration, current } = getQueryKeyProvider();

const customerQueryKeys = {
  current: {
    all: () => [...current, "customers"] as const,
  },
  administration: {
    all: () => [...administration, "customers"] as const,
    detail: ({ id }: Identifiable) =>
      [...customerQueryKeys.administration.all(), "detail", id] as const,
    page: (params?: Record<string, unknown>) =>
      [
        ...customerQueryKeys.administration.all(),
        "page",
        { ...params },
      ] as const,
  },
};

export const getCustomerQueryKeys = () => customerQueryKeys;
