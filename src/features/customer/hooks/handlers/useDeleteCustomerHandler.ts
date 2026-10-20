import { useModalContext } from "@/context/useModalContext";
import { useSelectionContext } from "@/context/useSelectionContext";
import { useDeleteCurrentCustomer } from "@/features/customer/hooks/api/useMutateCurrentCustomer";
import { useDeleteCustomer } from "@/features/customer/hooks/api/useMutateCustomer";
import { useMutationHandler } from "@/hooks/useMutationHandler";
import { useToastFactory } from "@/hooks/useToastFactory";
import { pipeVoid, requireId } from "@/utils/utils";

const useModalActionEnvironment = () => {
  const { closeModal } = useModalContext();
  const { currentSelection: id, clearSelection } = useSelectionContext();

  return {
    settled: pipeVoid(closeModal, clearSelection),
    selectedId: id,
  };
};

export const useDeleteCustomerHandler = () => {
  const { settled, selectedId: id } = useModalActionEnvironment();
  const { showSuccess, showError } = useToastFactory();

  void requireId(id);

  const mutation = useDeleteCustomer(id!);
  return useMutationHandler({
    mutationHook: () => mutation,
    id: id!,
    payloadBuilder: () => undefined,
    resultHandlers: {
      onSuccess: () => showSuccess("Customer deleted with success."),
      onError: (err) => showError(`Cannot delete customer: ${err?.message}`),
      onSettled: settled,
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
