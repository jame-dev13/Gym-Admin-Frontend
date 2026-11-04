import { getQueryKeyProvider } from "@/services/query-key-provider";
import type { Identifiable } from "@/types/Types";

const { administration } = getQueryKeyProvider();

const PAYMENT_DOMAIN_KEY = ["payments"] as const;

export const getQueryDomainKey = () => PAYMENT_DOMAIN_KEY;

const paymentQueryKeys = {
  administration: {
    all: () => [...administration, ...getQueryDomainKey()] as const,
    detail: ({ id }: Identifiable) =>
      [...paymentQueryKeys.administration.all(), "detail", id] as const,
    page: (params?: Record<string, unknown>) =>
      [
        ...paymentQueryKeys.administration.all(),
        "page",
        { ...params },
      ] as const,
    metrics: () =>
      [...paymentQueryKeys.administration.all(), "metrics"] as const,
    annualResume: () =>
      [...paymentQueryKeys.administration.metrics(), "resume"] as const,
    investmentEvolution: () =>
      [...paymentQueryKeys.administration.metrics(), "evolution"] as const,
  },
};

export const getPaymentQueryKeys = () => paymentQueryKeys;
