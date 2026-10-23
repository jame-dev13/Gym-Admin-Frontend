import { useGetPageAuditLog } from "@/features/audit/hooks/useFetchAuditLog";
import type { AuditLogResponse } from "@/features/audit/types";
import { useTableRenderer } from "@/hooks/useTableRenderer";

const DEFAULT_PAGE_SIZE = 10;

const AUDIT_LOG_SORT_PROPERTIES = [
  "createdAt",
  "action",
  "success",
] as const;

const AUDIT_LOG_SORT_LABELS: Record<
  (typeof AUDIT_LOG_SORT_PROPERTIES)[number],
  string
> = {
  createdAt: "Date",
  action: "Action",
  success: "Result",
};

export const useAuditLogList = (pageSize = DEFAULT_PAGE_SIZE) =>
  useTableRenderer<AuditLogResponse>({
    queryFn: useGetPageAuditLog,
    pageSize,
    sortProperties: AUDIT_LOG_SORT_PROPERTIES,
    labels: AUDIT_LOG_SORT_LABELS,
    initialSortBy: "createdAt",
    initialDirection: "desc",
    initialSortActive: true,
  });
