import { getAuditQueryKeys } from "@/features/audit/services/audit-query-keys";
import type { AuditLogResponse } from "@/features/audit/types";
import { usePageFetchMapping } from "@/hooks/useClientFetcher";

const BASE: string = `${import.meta.env.VITE_ADMINISTRATION_V1}/logs`;
const BASE_CURRENT: string = `${import.meta.env.VITE_LOGS_V1}`;

const { administration, current } = getAuditQueryKeys();

export const useGetPageAuditLog = (params?: Record<string, unknown>) =>
  usePageFetchMapping<AuditLogResponse>({
    uri: BASE,
    queryKey: [...administration.page(params)],
    params,
  });

export const useGetCurrentPageAuditLog = (params?: Record<string, unknown>) =>
  usePageFetchMapping<AuditLogResponse>({
    uri: BASE_CURRENT,
    queryKey: [...current.page(params)],
    params,
  });
