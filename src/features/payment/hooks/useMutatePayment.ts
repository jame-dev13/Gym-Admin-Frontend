import { getPaymentQueryKeys } from "@/features/payment/services/payment-query-keys";
import { useMutationMapping } from "@/hooks/useClientMutator";

const BASE: string = import.meta.env.VITE_CURRENT_PAYMENTS_V1;

const { current } = getPaymentQueryKeys();

export const useRetryCurrentPayment = () =>
  useMutationMapping<undefined, { sessionUrl?: string }>({
    uri: `${BASE}/retry`,
    invalidateKey: [...current.all()],
    method: "post",
    options: { meta: { clearAudit: true } },
  });
