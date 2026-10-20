import { getCustomerQueryKeys } from "@/features/customer/services/customer-query-keys";
import type {
  CustomerCreateRequest,
  CustomerUpdateRequest,
} from "@/features/customer/types";
import { useMutationMapping } from "@/hooks/useClientMutator";
import { pathBuilder } from "@/services/path-builder";
import type { Identifiable } from "@/types/Types";

const V1: string = `${import.meta.env.VITE_ADMINISTRATION_V1}/customers`;
const V2: string = `${import.meta.env.VITE_ADMINISTRATION_V2}/customers`;

const { administration } = getCustomerQueryKeys();
const INVALIDATE_KEY = administration.all();

const customerMutationBase = {
  invalidateKey: [...INVALIDATE_KEY],
  options: { meta: { clearAudit: true } },
};

export const useCreateCustomer = () =>
  useMutationMapping<CustomerCreateRequest, void>({
    uri: V2,
    method: "post",
    ...customerMutationBase,
  });

export const useUpdateCustomer = ({ id }: Identifiable) =>
  useMutationMapping<CustomerUpdateRequest, void>({
    uri: pathBuilder.detail(V2, id),
    method: "put",
    ...customerMutationBase,
  });

export const useDeleteCustomer = ({ id }: Identifiable) =>
  useMutationMapping<undefined, void>({
    uri: pathBuilder.detail(V1, id),
    method: "delete",
    ...customerMutationBase,
  });

export const useRecoverCustomer = () =>
  useMutationMapping<{ email: string }, void>({
    uri: `${V1}/recover`,
    method: "post",
    ...customerMutationBase,
  });
