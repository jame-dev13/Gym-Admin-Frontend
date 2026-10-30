import { getRankingQueryKeys } from "@/features/ranking/services/ranking-query-keys";
import type {
  MembershipRankingResponse,
  PeriodRankingResponse,
} from "@/features/ranking/types";
import { useFetchMapping } from "@/hooks/useClientFetcher";

const BASE: string = `${import.meta.env.VITE_ADMINISTRATION_V1}/metrics/subs/rankings`;

const { administration } = getRankingQueryKeys();

export const useGetMembershipRanking = () =>
  useFetchMapping<MembershipRankingResponse>({
    uri: `${BASE}/memberships`,
    queryKey: [...administration.membership()],
  });

export const useGetPeriodRanking = () =>
  useFetchMapping<PeriodRankingResponse>({
    uri: `${BASE}/periods`,
    queryKey: [...administration.period()],
  });
