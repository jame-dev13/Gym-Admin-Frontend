import { getPaymentQueryKeys } from "@/features/payment/services/payment-query-keys";
import type { PaymentResponse } from "@/features/payment/types";
import { usePageFetchMapping } from "@/hooks/useClientFetcher";

const BASE: string = `${import.meta.env.VITE_ADMINISTRATION_V1}/payments`;

const { administration } = getPaymentQueryKeys();

export const useGetPaymentPage = (params?: Record<string, unknown>) =>
  usePageFetchMapping<PaymentResponse>({
    uri: BASE,
    queryKey: [...administration.page(params)],
    params,
  });
