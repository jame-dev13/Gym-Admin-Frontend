import { TableRenderer } from "@/components/table/TableRenderer";
import { getBackupTableConfig } from "@/features/backup/services/backup-table-config";

export const BackupLayout = () => (
  <TableRenderer config={getBackupTableConfig()} />
);
