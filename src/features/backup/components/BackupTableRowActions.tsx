import { DatabaseBackup, Download, History, Trash2 } from "lucide-react";
import { lazy } from "react";
import { TableRowActions } from "@/components/table/TableRowActions";
import { useDownloadBackupHandler } from "@/features/backup/hooks/handlers/useDownloadBackupHandler";
import type { BackupResponse } from "@/features/backup/types";
import { useEntityDomainContext } from "@/context/useEntityDomainContext";
import { useModalContext } from "@/context/useModalContext";
import type { RowAction } from "@/types/Types";

const LazyMakeBackupDialog = lazy(() =>
  import("@/features/backup/components/MakeBackupDialog").then((mod) => ({
    default: mod.MakeBackupDialog,
  })),
);

const LazyRestoreBackupDialog = lazy(() =>
  import("@/features/backup/components/RestoreBackupDialog").then((mod) => ({
    default: mod.RestoreBackupDialog,
  })),
);

const LazyDeleteBackupDialog = lazy(() =>
  import("@/features/backup/components/DeleteBackupDialog").then((mod) => ({
    default: mod.DeleteBackupDialog,
  })),
);

export const BackupTableRowActions = ({ row }: { row: BackupResponse }) => {
  const { entity } = useEntityDomainContext();
  const { isOpen: isModalOpen, openModal } = useModalContext();
  const { handleDownload, isDownloading } = useDownloadBackupHandler(row.id);

  if (entity !== "dump" && entity !== "backup") {
    throw new Error(
      "BackupTableRowActions can only be used in dump or backup entity context",
    );
  }

  const actions: RowAction<BackupResponse>[] = [
    {
      id: "make-backup",
      label: "Make backup",
      Icon: DatabaseBackup,
      disabled: isModalOpen,
      onSelect: (backup) => {
        openModal({
          title: "Create backup",
          description: "Create a new backup snapshot of the current data.",
          size: "sm",
          data: backup,
          render: () => <LazyMakeBackupDialog />,
        });
      },
    },
    {
      id: "restore-backup",
      label: "Restore backup",
      Icon: History,
      disabled: isModalOpen,
      onSelect: (backup) => {
        openModal({
          title: "Restore backup",
          description: `Restore the application data from ${backup.fileName}.`,
          size: "sm",
          data: backup,
          render: (current) => (
            <LazyRestoreBackupDialog
              backupId={current.id}
              fileName={current.fileName}
            />
          ),
        });
      },
    },
    {
      id: "download-backup",
      label: "Download backup",
      Icon: Download,
      disabled: isDownloading,
      onSelect: () => {
        void handleDownload();
      },
    },
    {
      id: "delete-backup",
      label: "Delete backup",
      Icon: Trash2,
      destructive: true,
      disabled: isModalOpen,
      onSelect: (backup) => {
        openModal({
          title: "Delete backup",
          description: `Remove ${backup.fileName} from the stored backups.`,
          size: "sm",
          data: backup,
          render: (current) => (
            <LazyDeleteBackupDialog
              backupId={current.id}
              fileName={current.fileName}
            />
          ),
        });
      },
    },
  ];

  return <TableRowActions row={row} actions={actions} />;
};
