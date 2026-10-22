import { useModalContext } from "@/context/useModalContext";
import { useDeleteSubscription } from "@/features/subscription/hooks/useMutateSubscription";
import { useMutationHandler } from "@/hooks/useMutationHandler";
import { useToastFactory } from "@/hooks/useToastFactory";
import type { Identifiable } from "@/types/Types";
import { requireId } from "@/utils/utils";

export const useDeleteSubscriptionHandler = (
  subscriptionId: Identifiable["id"],
) => {
  const { closeModal } = useModalContext();
  const { showSuccess, showError } = useToastFactory();

  const id: Identifiable = { id: subscriptionId };
  void requireId(id);

  const mutation = useDeleteSubscription(id);

  return useMutationHandler({
    id,
    mutationHook: () => mutation,
    payloadBuilder: () => undefined,
    resultHandlers: {
      onSuccess: () => showSuccess("Subscription deleted with success."),
      onError: (err) =>
        showError(`Cannot delete subscription: ${err?.message}`),
      onSettled: closeModal,
    },
  });
};
