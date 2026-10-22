import { getSubscriptionQueryKeys } from "@/features/subscription/services/subscription-query-keys";
import type { SubscriptionResponse } from "@/features/subscription/types";
import { useFetchMapping, usePageFetchMapping } from "@/hooks/useClientFetcher";
import { pathBuilder } from "@/services/path-builder";
import type { Identifiable } from "@/types/Types";

const BASE: string = `${import.meta.env.VITE_ADMINISTRATION_V1}/subs`;

const { administration } = getSubscriptionQueryKeys();

export const useGetSubscriptionPage = (params?: Record<string, unknown>) =>
  usePageFetchMapping<SubscriptionResponse>({
    uri: BASE,
    queryKey: [...administration.page(params)],
    params,
  });

export const useGetSubscription = ({ id }: Identifiable) =>
  useFetchMapping<SubscriptionResponse>({
    uri: pathBuilder.detail(BASE, id),
    queryKey: [...administration.detail({ id })],
    options: { enabled: !!id },
  });
