import { getCustomerQueryKeys } from "@/features/customer/services/customer-query-keys";
import type { CustomerResponse } from "@/features/customer/types";
import { useFetchMapping } from "@/hooks/useClientFetcher";

const BASE: string = import.meta.env.VITE_CUSTOMER_CURRENT_V1;

const { current } = getCustomerQueryKeys();

export const useGetCurrentCustomer = () => useFetchMapping<CustomerResponse>({
  uri: BASE,
  queryKey: [...current.all()],
})