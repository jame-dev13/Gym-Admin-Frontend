import { useDrawerContext } from "@/context/useDrawerContext";
import { useEditSubscription } from "@/features/subscription/hooks/useMutateSubscription";
import type { Membership } from "@/features/subscription/types";
import { useMutationHandler } from "@/hooks/useMutationHandler";
import { useToastFactory } from "@/hooks/useToastFactory";
import type { Identifiable } from "@/types/Types";
import { requireId } from "@/utils/utils";

export const useEditSubscriptionHandler = (
  subscriptionId: Identifiable["id"],
) => {
  const { closeDrawer } = useDrawerContext();
  const { showSuccess, showError } = useToastFactory();

  const id: Identifiable = { id: subscriptionId };
  void requireId(id);

  const mutation = useEditSubscription(id);

  return useMutationHandler({
    id,
    mutationHook: () => mutation,
    payloadBuilder: (fd) => ({
      customerEmail: String(fd?.get("customerEmail")),
      membership: String(fd?.get("membership")) as Membership,
    }),
    resultHandlers: {
      onSuccess: () => showSuccess("Subscription successfully updated."),
      onError: (err) => showError(`Cannot update subscription: ${err?.message}`),
      onSettled: closeDrawer,
    },
  });
};
