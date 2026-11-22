import { getSubscriptionQueryKeys } from "@/features/subscription/services/subscription-query-keys";
import { useFetchMapping } from "@/hooks/useClientFetcher";

const BASE = `${import.meta.env.VITE_SUBSCRIPTION_CURRENT_V1}`;

const { current } = getSubscriptionQueryKeys();

export const useExistsCurrentSubscription = () =>
  useFetchMapping<{ exists: boolean }>({
    uri: `${BASE}/exists`,
    queryKey: [...current.all(), "exists"],
  });
