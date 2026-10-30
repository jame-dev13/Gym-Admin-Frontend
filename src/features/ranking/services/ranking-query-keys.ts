import { getQueryDomainKey as getSubscriptionDomainKey } from "@/features/subscription/services/subscription-query-keys";
import { getQueryKeyProvider } from "@/services/query-key-provider";

const { administration: administrationRoot } = getQueryKeyProvider();

const RANKING_DOMAIN_KEY = ["ranking"] as const;

/**
 * Rankings are derived from subscriptions, so their domain key is nested
 * under the subscription key. Invalidating `["administration", "subscriptions"]`
 * (for example after a subscription mutation) also invalidates every ranking.
 */
export const getQueryDomainKey = () =>
  [...getSubscriptionDomainKey(), ...RANKING_DOMAIN_KEY] as const;

const rankingQueryKeys = {
  administration: {
    all: () => [...administrationRoot, ...getQueryDomainKey()] as const,
    membership: () =>
      [...rankingQueryKeys.administration.all(), "memberships"] as const,
    period: () =>
      [...rankingQueryKeys.administration.all(), "periods"] as const,
  },
};

export const getRankingQueryKeys = () => rankingQueryKeys;
