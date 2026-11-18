import { getSubscriptionQueryKeys } from "@/features/subscription/services/subscription-query-keys";
import type { SubscriptionResponse } from "@/features/subscription/types";
import { useFetchMapping } from "@/hooks/useClientFetcher";

const BASE: string = import.meta.env.VITE_SUBSCRIPTION_CURRENT_V1;

const { current } = getSubscriptionQueryKeys();

export const useGetSubscription = () =>
  useFetchMapping<SubscriptionResponse>({
    uri: BASE,
    queryKey: [...current.all()],
  });
