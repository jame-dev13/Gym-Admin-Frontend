import { useDrawerContext } from "@/context/useDrawerContext";
import { useUpdateCurrentCustomer } from "@/features/customer/hooks/api/useMutateCurrentCustomer";
import { useUpdateCustomer } from "@/features/customer/hooks/api/useMutateCustomer";
import { useMutationHandler } from "@/hooks/useMutationHandler";
import { useToastFactory } from "@/hooks/useToastFactory";
import type { Identifiable } from "@/types/Types";
import { requireId } from "@/utils/utils";

export const useUpdateCustomerHandler = (
  customerId: Identifiable["id"],
) => {
  const { closeDrawer } = useDrawerContext();
  const { showSuccess, showError } = useToastFactory();

  const id: Identifiable = { id: customerId };
  void requireId(id);

  const mutate = useUpdateCustomer(id);

  return useMutationHandler({
    id,
    mutationHook: () => mutate,
    payloadBuilder: (fd) => ({
      phoneContact: String(fd?.get("phoneContact")).split(" ").join(""),
      addressInfo: {
        city: String(fd?.get("city") ?? ""),
        locality: String(fd?.get("locality") ?? ""),
        colony: String(fd?.get("colony") ?? ""),
        street: String(fd?.get("street") ?? ""),
        homeNumber: String(fd?.get("homeNumber") ?? ""),
        cp: String(fd?.get("cp") ?? "" ),
      },
    }),
    resultHandlers: {
      onSuccess: () => showSuccess("Customer updated with success."),
      onError: (err) =>
        showError(`Cannot update customer info: ${err?.message}`),
      onSettled: closeDrawer,
    },
  });
};

export const useUpdateCurrentCustomerHandler = () => {
  const { showSuccess, showError } = useToastFactory();

  return useMutationHandler({
    mutationHook: useUpdateCurrentCustomer,
    payloadBuilder: (fd) => ({
      phoneContact: String(fd?.get("phoneContact")),
      addressInfo: {
        city: String(fd?.get("city") ),
        locality: String(fd?.get("locality") ),
        colony: String(fd?.get("colony") ),
        street: String(fd?.get("street") ),
        homeNumber: String(fd?.get("homeNumber")?.toString()),
        cp: String(fd?.get("cp")?.toString()),
      },
    }),
    resultHandlers: {
      onSuccess: () => showSuccess("Customer updated with success."),
      onError: (err) =>
        showError(`Cannot update customer info: ${err?.message}`),
    },
  });
};
