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

export const useGetCustomerJoiningEvo = (year: number) =>
  useFetchMapping<CustomerEvolution>({
    uri: pathBuilder.action(BASE, year, "customers/joins"),
    queryKey: [...administration.customers.joins(year)],
  });

export const useGetCustomerDowningEvo = (year: number) =>
  useFetchMapping<CustomerEvolution>({
    uri: pathBuilder.action(BASE, year, "customers/downs"),
    queryKey: [...administration.customers.downs(year)],
  });

export const useGetSubscriberJoiningEvo = (year: number) =>
  useFetchMapping<SubscriberEvolution>({
    uri: pathBuilder.action(BASE, year, "subscribers/joins"),
    queryKey: [...administration.subscribers.joins(year)],
  });

export const useGetSubscriberDowningEvo = (year: number) =>
  useFetchMapping<SubscriberEvolution>({
    uri: pathBuilder.action(BASE, year, "subscribers/downs"),
    queryKey: [...administration.subscribers.downs(year)],
  });

export const useGetBillingEvolution = (year: number) =>
  useFetchMapping<BillingEvolution>({
    uri: pathBuilder.action(BASE, year, "billings"),
    queryKey: [...administration.billing.year(year)],
  });
