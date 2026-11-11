import { TableRenderer } from '@/components/table/TableRenderer';
import { getBackupRecycleTableConfig } from '@/features/backup/services/backup-table-config';

const BackupRecycleLayout = () => (
  <TableRenderer config={getBackupRecycleTableConfig()} />
);

export default BackupRecycleLayout;