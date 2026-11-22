import { TableRenderer } from "@/components/table/TableRenderer";
import { getCurrentAuditLogTableConfig } from "@/features/audit/services/auditlog-table-config";

export const AuditLogCurrentLayout = () => (
  <TableRenderer config={getCurrentAuditLogTableConfig()} />
);

export default AuditLogCurrentLayout;
