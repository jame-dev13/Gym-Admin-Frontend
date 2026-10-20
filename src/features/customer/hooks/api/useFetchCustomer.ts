import { getCustomerQueryKeys } from "@/features/customer/services/customer-query-keys";
import type { CustomerResponse } from "@/features/customer/types";
import { useFetchMapping, usePageFetchMapping } from "@/hooks/useClientFetcher";
import { pathBuilder } from "@/services/path-builder";
import type { Identifiable } from "@/types/Types";

const BASE: string = `${import.meta.env.VITE_ADMINISTRATION_V1}/customers`;

const { administration } = getCustomerQueryKeys();

export const useGetCustomerPage = (params?: Record<string, unknown>) =>
  usePageFetchMapping<CustomerResponse>({
    uri: BASE,
    queryKey: [...administration.page(params)],
    params,
  });

export const useGetCustomer = ({ id }: Identifiable) =>
  useFetchMapping({
    uri: pathBuilder.detail(BASE, id),
    queryKey: [...administration.detail({ id })],
    options: { enabled: !!id },
  });
