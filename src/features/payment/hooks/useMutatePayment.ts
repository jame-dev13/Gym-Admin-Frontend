import { getPaymentQueryKeys } from "@/features/payment/services/payment-query-keys";
import { getSubscriptionQueryKeys } from "@/features/subscription/services/subscription-query-keys";
import { useMutationMapping } from "@/hooks/useClientMutator";
import { getQueryAppClient } from "@/services/query-client";

const BASE: string = import.meta.env.VITE_CURRENT_PAYMENTS_V1;

const { current: subscriptionCurr } = getSubscriptionQueryKeys();
const { current: paymentCurr } = getPaymentQueryKeys();

export const useRetryCurrentPayment = () =>
  useMutationMapping<undefined, { sessionUrl?: string }>({
    uri: `${BASE}/retry`,
    invalidateKey: [...paymentCurr.all()],
    method: "post",
    options: {
      meta: { clearAudit: true },
      onSettled: () =>
        getQueryAppClient().invalidateQueries({
          queryKey: subscriptionCurr.all(),
          exact: true,
        }),
    },
  });
