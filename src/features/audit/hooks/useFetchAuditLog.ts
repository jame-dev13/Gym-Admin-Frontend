import { getAuditQueryKeys } from "@/features/audit/services/audit-query-keys";
import type { AuditLogResponse } from "@/features/audit/types";
import { usePageFetchMapping } from "@/hooks/useClientFetcher";

const BASE: string = `${import.meta.env.VITE_ADMINISTRATION_V1}/logs`;

const { administration } = getAuditQueryKeys();

export const useGetPageAuditLog = (params?: Record<string, unknown>) =>
  usePageFetchMapping<AuditLogResponse>({
    uri: BASE,
    queryKey: [...administration.page(params)],
    params,
  });
