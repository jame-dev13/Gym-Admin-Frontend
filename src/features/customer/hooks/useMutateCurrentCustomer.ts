import { getCustomerQueryKeys } from "@/features/customer/services/customer-query-keys";
import type { CustomerUpdateRequest } from "@/features/customer/types";
import { useMutationMapping } from "@/hooks/useClientMutator";

const V1: string = import.meta.env.VITE_CUSTOMER_CURRENT_V1;
const V2: string = import.meta.env.VITE_CUSTOMER_CURRENT_V2;

const { current } = getCustomerQueryKeys();
const INVALIDATE_KEY = current.all();

const customerMutationBase = {
  invalidateKey: [...INVALIDATE_KEY],
  options: { meta: { clearAudit: true } },
};

export const useCreateCurrentCustomer = () =>
  useMutationMapping<undefined, void>({
    uri: V2,
    method: "post",
    ...customerMutationBase,
  });

export const useUpdateCurrentCustomer = () =>
  useMutationMapping<CustomerUpdateRequest, void>({
    uri: V2,
    method: "put",
    ...customerMutationBase,
  });

export const useDeleteCurrentCustomer = () =>
  useMutationMapping({
    uri: V1,
    method: "delete",
    ...customerMutationBase,
  });
