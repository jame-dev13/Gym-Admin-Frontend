import { useDrawerContext } from "@/context/useDrawerContext";
import { useCreateSubscription } from "@/features/subscription/hooks/useMutateSubscription";
import type { Membership } from "@/features/subscription/types";
import { useMutationHandler } from "@/hooks/useMutationHandler";
import { useToastFactory } from "@/hooks/useToastFactory";

export const useCreateSubscriptionHandler = () => {
  const { closeDrawer } = useDrawerContext();
  const { showSuccess, showError } = useToastFactory();

  return useMutationHandler({
    mutationHook: useCreateSubscription,
    payloadBuilder: (fd) => ({
      customerEmail: String(fd?.get("customerEmail")),
      membership: String(fd?.get("membership")) as Membership,
    }),
    resultHandlers: {
      onSuccess: () => showSuccess("Subscription successfully created."),
      onError: (err) =>
        showError(`Cannot create subscription: ${err?.message}`),
      onSettled: closeDrawer,
    },
  });
};
