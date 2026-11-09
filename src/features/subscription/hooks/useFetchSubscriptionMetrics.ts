import { getSubscriptionQueryKeys } from "@/features/subscription/services/subscription-query-keys";
import type { SubscriptionAnnualResumeModel } from "@/features/subscription/types";
import { useFetchMapping } from "@/hooks/useClientFetcher";

const BASE: string = `${import.meta.env.VITE_ADMINISTRATION_V2}/metrics/subs`;

const { administration } = getSubscriptionQueryKeys();

export const useGetSubscriptionsAnnualResume = () =>
  useFetchMapping<SubscriptionAnnualResumeModel>({
    uri: `${BASE}/resume`,
    queryKey: [...administration.annualResume()],
  });

/** Alias matching the singular hook name used in some references. */
export const useGetSubscriptionAnnualResume =
  useGetSubscriptionsAnnualResume;
