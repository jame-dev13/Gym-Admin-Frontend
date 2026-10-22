import { useModalContext } from "@/context/useModalContext";
import { useFinalizeSubscription } from "@/features/subscription/hooks/useMutateSubscription";
import { useMutationHandler } from "@/hooks/useMutationHandler";
import { useToastFactory } from "@/hooks/useToastFactory";
import type { Identifiable } from "@/types/Types";
import { requireId } from "@/utils/utils";

export const useFinalizeSubscriptionHandler = (
  subscriptionId: Identifiable["id"],
) => {
  const { closeModal } = useModalContext();
  const { showSuccess, showError } = useToastFactory();

  const id: Identifiable = { id: subscriptionId };
  void requireId(id);

  const mutation = useFinalizeSubscription(id);

  return useMutationHandler({
    id,
    mutationHook: () => mutation,
    payloadBuilder: () => undefined,
    resultHandlers: {
      onSuccess: () => showSuccess("Subscription finalized with success."),
      onError: (err) =>
        showError(`Cannot finalize subscription: ${err?.message}`),
      onSettled: closeModal,
    },
  });
};
