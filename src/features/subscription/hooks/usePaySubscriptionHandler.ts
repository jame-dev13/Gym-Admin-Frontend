import { useModalContext } from "@/context/useModalContext";
import {
  useCreateCurrentSubscription,
  useRenewSubscription,
} from "@/features/subscription/hooks/useMutateCurrentSubscription";
import type { Membership } from "@/features/subscription/types";
import { useMutationHandler } from "@/hooks/useMutationHandler";
import { useToastFactory } from "@/hooks/useToastFactory";

type usePaySubscriptionHandlerArgs = {
  subscriptionHook:
    | typeof useCreateCurrentSubscription
    | typeof useRenewSubscription;
};

export const usePaySubscriptionHandler = ({
  subscriptionHook,
}: usePaySubscriptionHandlerArgs) => {
  const { closeModal } = useModalContext();
  const { showSuccess, showError } = useToastFactory();

  return useMutationHandler({
    mutationHook: subscriptionHook,
    payloadBuilder: (fd) => ({
      membership: String(fd?.get("membership")) as Membership,
    }),
    resultHandlers: {
      onSuccess: (data) => {
        if (!data)
          throw new Error("Something went wrong: response body empty.");

        showSuccess(
          "Subscribed with success, you are being redirected to payment page.",
        );
        window.location.assign(data.checkout.sessionUrl);
      },
      onError: (err) =>
        showError(
          `Could not complete subscription process at this moment: ${err?.message}`,
        ),
      onSettled: closeModal,
    },
  });
};
