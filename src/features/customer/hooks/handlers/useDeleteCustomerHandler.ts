import { useModalContext } from "@/context/useModalContext";
import { useDeleteCurrentCustomer } from "@/features/customer/hooks/api/useMutateCurrentCustomer";
import { useDeleteCustomer } from "@/features/customer/hooks/api/useMutateCustomer";
import { useMutationHandler } from "@/hooks/useMutationHandler";
import { useToastFactory } from "@/hooks/useToastFactory";
import type { Identifiable } from "@/types/Types";
import { requireId } from "@/utils/utils";

export const useDeleteCustomerHandler = (
  customerId: Identifiable["id"],
) => {
  const { closeModal } = useModalContext();
  const { showSuccess, showError } = useToastFactory();

  const id: Identifiable = { id: customerId };
  void requireId(id);

  const mutation = useDeleteCustomer(id);
  return useMutationHandler({
    mutationHook: () => mutation,
    id,
    payloadBuilder: () => undefined,
    resultHandlers: {
      onSuccess: () => showSuccess("Customer deleted with success."),
      onError: (err) => showError(`Cannot delete customer: ${err?.message}`),
      onSettled: closeModal,
    },
  });
};

export const useDeleteCurrentCustomerHandler = () => {
  const { closeModal } = useModalContext();
  const { showSuccess, showError } = useToastFactory();

  return useMutationHandler({
    mutationHook: useDeleteCurrentCustomer,
    payloadBuilder: () => undefined,
    resultHandlers: {
      onSuccess: () => showSuccess("Customer deleted with success."),
      onError: (err) => showError(`Cannot delete customer: ${err?.message}`),
      onSettled: closeModal,
    },
  });
};
