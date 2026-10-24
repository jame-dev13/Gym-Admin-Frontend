import { TableRenderer } from "@/components/table/TableRenderer";
import { getAuditLogTableConfig } from "@/features/audit/services/auditlog-table-config";

export const AuditLogLayout = () => (
  <TableRenderer config={getAuditLogTableConfig()} />
);
