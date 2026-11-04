import { getPaymentQueryKeys } from "@/features/payment/services/payment-query-keys";
import type {
  AnnualResumeResponse,
  InvestmentEvolution,
} from "@/features/payment/types";
import { useFetchMapping } from "@/hooks/useClientFetcher";

const BASE: string = `${import.meta.env.VITE_ADMINISTRATION_V1}/metrics/payments`;

const { administration } = getPaymentQueryKeys();

export const useGetInvestmentEvolution = () =>
  useFetchMapping<InvestmentEvolution>({
    uri: `${BASE}/evolution`,
    queryKey: [...administration.investmentEvolution()],
  });

export const useGetAnnualResume = () =>
  useFetchMapping<AnnualResumeResponse>({
    uri: `${BASE}/resume`,
    queryKey: [...administration.annualResume()],
  });

/** Alias matching the hook name used in the payment domain specification. */
export const useGetAnnualresume = useGetAnnualResume;
