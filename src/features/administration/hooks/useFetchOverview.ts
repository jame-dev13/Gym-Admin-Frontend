import { getAdminQueryKeys } from "@/features/administration/services/admin-query-keys";
import type { OverviewInsightsResponse } from "@/features/administration/types";
import { getQueryDomainKey as getCustomerKey } from "@/features/customer/services/customer-query-keys";
import { getQueryDomainKey as getSubscriptionKey } from "@/features/subscription";
import { getQueryDomainKey as getUserKey } from "@/features/user/services/UserQueryKeyProvider";
import { useFetchMapping } from "@/hooks/useClientFetcher";

const BASE: string = `${import.meta.env.VITE_ADMINISTRATION_V1}/overview`;

const { overview, insights } = getAdminQueryKeys();
const userKey = getUserKey();
const subscriptionKey = getSubscriptionKey();
const customerKey = getCustomerKey();
const QUERY_KEY = [
  ...overview(),
  ...insights(),
  userKey,
  subscriptionKey,
  customerKey,
] as const;

export const useGetOverviewInsights = () =>
  useFetchMapping<OverviewInsightsResponse>({
    uri: BASE,
    queryKey: QUERY_KEY,
  });
