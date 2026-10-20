import { useDrawerContext } from "@/context/useDrawerContext";
import { useSelectionContext } from "@/context/useSelectionContext";
import { useUpdateCurrentCustomer } from "@/features/customer/hooks/api/useMutateCurrentCustomer";
import { useUpdateCustomer } from "@/features/customer/hooks/api/useMutateCustomer";
import { useMutationHandler } from "@/hooks/useMutationHandler";
import { useToastFactory } from "@/hooks/useToastFactory";
import { pipeVoid, requireId } from "@/utils/utils";

export const useUpdateCustomerHandler = () => {
  const { closeDrawer } = useDrawerContext();
  const { clearSelection, currentSelection: id } = useSelectionContext();
  const { showSuccess, showError } = useToastFactory();

  void requireId(id);

  const mutate = useUpdateCustomer(id!);

  return useMutationHandler({
    id: id!,
    mutationHook: () => mutate,
    payloadBuilder: (fd) => ({
      phoneContact: String(fd?.get("phoneContact")),
      addressInfo: {
        city: String(fd?.get("city") ?? ""),
        locality: String(fd?.get("locality") ?? ""),
        colony: String(fd?.get("colony") ?? ""),
        street: String(fd?.get("street") ?? ""),
        homeNumber: String(fd?.get("homeNumber") ?? ""),
        cp: String(fd?.get("cp") ?? ""),
      },
    }),
    resultHandlers: {
      onSuccess: () => showSuccess("Customer updated with success."),
      onError: (err) =>
        showError(`Cannot update customer info: ${err?.message}`),
      onSettled: pipeVoid(clearSelection, closeDrawer),
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
        city: String(fd?.get("city") ?? ""),
        locality: String(fd?.get("locality") ?? ""),
        colony: String(fd?.get("colony") ?? ""),
        street: String(fd?.get("street") ?? ""),
        homeNumber: String(fd?.get("homeNumber") ?? ""),
        cp: String(fd?.get("cp") ?? ""),
      },
    }),
    resultHandlers: {
      onSuccess: () => showSuccess("Customer updated with success."),
      onError: (err) =>
        showError(`Cannot update customer info: ${err?.message}`),
    },
  });
};
