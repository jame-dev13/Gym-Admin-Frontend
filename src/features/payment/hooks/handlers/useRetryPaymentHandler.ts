import { useRetryCurrentPayment } from "@/features/payment/hooks/useMutatePayment";
import { useMutationHandler } from "@/hooks/useMutationHandler";
import { useToastFactory } from "@/hooks/useToastFactory";

export const useRetryPaymentHandler = () => {
  const { showSuccess, showError } = useToastFactory();
  return useMutationHandler({
    mutationHook: useRetryCurrentPayment,
    payloadBuilder: () => undefined,
    resultHandlers: {
      onSuccess: (data) => {
        showSuccess("Payment retry process completed with success.");
        if (data && data.sessionUrl) {
          window.location.assign(data.sessionUrl);
        }
      },
      onError: (err) =>
        showError(`Could not complete 'retry' action now: ${err?.message}`),
    },
  });
};
