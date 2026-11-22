import type { BillingMonth } from "@/features/evolution/types";
import { getPaymentQueryKeys } from "@/features/payment/services/payment-query-keys";
import type { AnnualResumeResponse } from "@/features/payment/types";
import { useFetchMapping } from "@/hooks/useClientFetcher";
import type { Content } from "@/types/SharedTypes";

const BASE: string = import.meta.env.VITE_PAYMENT_CURRENT_METRICS_V1;
const { current } = getPaymentQueryKeys();

export const useGetAnnualCurrentResume = () =>
  useFetchMapping<AnnualResumeResponse>({
    uri: `${BASE}/resume`,
    queryKey: [...current.all(), "resume"],
  });

export const useGetCurrentEvolution = () =>
  useFetchMapping<Content<BillingMonth>>({
    uri: `${BASE}/evolution`,
    queryKey: [...current.all(), "evolution"],
  });
