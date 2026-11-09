import { getEvolutionQueryKeys } from "@/features/evolution/services/evolution-query-keys";
import type {
  BillingEvolution,
  CustomerEvolution,
  SubscriberEvolution,
} from "@/features/evolution/types";
import { useFetchMapping } from "@/hooks/useClientFetcher";
import { pathBuilder } from "@/services/path-builder";

const BASE: string = `${import.meta.env.VITE_ADMINISTRATION_V1}/metrics/evolutions`;

const { administration } = getEvolutionQueryKeys();

export const useGetCustomerEvolution = (year: number) =>
  useFetchMapping<CustomerEvolution>({
    uri: pathBuilder.action(BASE, year, "customers"),
    queryKey: [...administration.customers.year(year)],
    options: { enabled: !!year }
  });

export const useGetSubscriberEvolution = (year: number) =>
  useFetchMapping<SubscriberEvolution>({
    uri: pathBuilder.action(BASE, year, "subscribers"),
    queryKey: [...administration.subscribers.year(year)],
    options: { enabled: !!year },
  });

export const useGetBillingEvolution = (year: number) =>
  useFetchMapping<BillingEvolution>({
    uri: pathBuilder.action(BASE, year, "billings"),
    queryKey: [...administration.billing.year(year)],
    options: { enabled: !!year },
  });
