import { getQueryDomainKey as getCustomerDomainKey } from "@/features/customer/services/customer-query-keys";
import { getQueryDomainKey as getSubscriptionDomainKey } from "@/features/subscription/services/subscription-query-keys";
import { getQueryKeyProvider } from "@/services/query-key-provider";

const { administration: administrationRoot } = getQueryKeyProvider();

const EVOLUTION_DOMAIN_KEY = ["evolutions"] as const;

/**
 * Billing evolution is not backed by a dedicated domain yet. The `payments`
 * key is hardcoded for now so a future payments domain can invalidate the
 * billing chart by sharing this prefix.
 */
const PAYMENT_DOMAIN_KEY = ["payments"] as const;

export const getQueryDomainKey = () => EVOLUTION_DOMAIN_KEY;

/**
 * Customer evolution is derived from customers. Nesting its key below the
 * customer domain means invalidating `["administration", "customers"]` (for
 * example after a customer mutation) also invalidates these charts.
 */
export const getCustomerEvolutionQueryKey = () =>
  [...getCustomerDomainKey(), ...getQueryDomainKey()] as const;

/**
 * Subscriber evolution mirrors the subscription dependency: a subscription
 * mutation invalidates both subscription queries and subscriber evolution.
 */
export const getSubscriberEvolutionQueryKey = () =>
  [...getSubscriptionDomainKey(), ...getQueryDomainKey()] as const;

export const getBillingEvolutionQueryKey = () =>
  [...PAYMENT_DOMAIN_KEY, ...getQueryDomainKey()] as const;

const evolutionQueryKeys = {
  administration: {
    customers: {
      all: () =>
        [...administrationRoot, ...getCustomerEvolutionQueryKey()] as const,
      joins: (year: number) =>
        [
          ...evolutionQueryKeys.administration.customers.all(),
          "joins",
          year,
        ] as const,
      downs: (year: number) =>
        [
          ...evolutionQueryKeys.administration.customers.all(),
          "downs",
          year,
        ] as const,
    },
    subscribers: {
      all: () =>
        [...administrationRoot, ...getSubscriberEvolutionQueryKey()] as const,
      joins: (year: number) =>
        [
          ...evolutionQueryKeys.administration.subscribers.all(),
          "joins",
          year,
        ] as const,
      downs: (year: number) =>
        [
          ...evolutionQueryKeys.administration.subscribers.all(),
          "downs",
          year,
        ] as const,
    },
    billing: {
      all: () =>
        [...administrationRoot, ...getBillingEvolutionQueryKey()] as const,
      year: (year: number) =>
        [
          ...evolutionQueryKeys.administration.billing.all(),
          "billings",
          year,
        ] as const,
    },
  },
};

export const getEvolutionQueryKeys = () => evolutionQueryKeys;
