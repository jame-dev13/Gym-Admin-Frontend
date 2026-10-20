import { getQueryKeyProvider } from "@/services/query-key-provider";
import type { Identifiable } from "@/types/Types";

const { administration, current } = getQueryKeyProvider();

const CUSTOMER_DOMAIN_KEY = ["customers"] as const;

export const getQueryDomainKey = () => CUSTOMER_DOMAIN_KEY;

const customerQueryKeys = {
  current: {
    all: () => [...current, ...getQueryDomainKey()] as const,
  },
  administration: {
    all: () => [...administration, ...getQueryDomainKey()] as const,
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
