import { getQueryKeyProvider } from "@/services/query-key-provider";
import type { Identifiable } from "@/types/Types";

const { administration } = getQueryKeyProvider();

const SUBSCRIPTION_DOMAIN_KEY = ["subscriptions"] as const;

export const getQueryDomainKey = () => SUBSCRIPTION_DOMAIN_KEY;

const subscriptionQueryKeys = {
  administration: {
    all: () => [...administration, ...getQueryDomainKey()] as const,
    detail: ({ id }: Identifiable) =>
      [...subscriptionQueryKeys.administration.all(), "detail", id] as const,
    page: (params?: Record<string, unknown>) =>
      [
        ...subscriptionQueryKeys.administration.all(),
        "page",
        { ...params },
      ] as const,
  },
};

export const getSubscriptionQueryKeys = () => subscriptionQueryKeys;
