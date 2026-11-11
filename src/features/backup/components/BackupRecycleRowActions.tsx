import { TableRowActions } from "@/components/table/TableRowActions";
import { useModalContext } from "@/context/useModalContext";
import type { BackupResponse } from "@/features/backup/types";
import type { RowAction } from "@/types/Types";
import { Flame, Recycle } from "lucide-react";
import { lazy, useMemo, type FC } from "react";

const LazyRecoverBackupDialog = lazy(
  () => import("@/features/backup/components/RecoverBackupDialog"),
);

const LazyEraseBackupDialog = lazy(
  () => import("@/features/backup/components/EraseBackupDialog"),
);

const ALLOWING_RECOVER_STATUS: BackupResponse["backupStatus"][] = [
  "RESTORED",
  "SUCCESS",
];

const isValidBackupStatus = (
  backup: BackupResponse,
  statuses: Array<BackupResponse["backupStatus"]>,
) => statuses.includes(backup.backupStatus);

export const BackupRecycleRowActions: FC<{ backup: BackupResponse }> = ({
  backup,
}) => {
  const { openModal, isOpen } = useModalContext();

  const disables = useMemo(() => ({
    disableRecover: isOpen || !isValidBackupStatus(backup, ALLOWING_RECOVER_STATUS),
    disableErase: isOpen
  }), [isOpen, backup]) 

  const actions: RowAction<BackupResponse>[] = [
    {
      id: "recover",
      label: "Recover",
      Icon: Recycle,
      disabled: disables.disableRecover,
      hidden: (row) => !ALLOWING_RECOVER_STATUS.includes(row.backupStatus),
      onSelect: (row) => {
        openModal({
          data: row,
          title: "Recover Backup",
          description: "Recovering backup record confirmation.",
          size: "sm",
          render: (row) => (
            <LazyRecoverBackupDialog
              backupId={row.id}
              fileName={row.fileName}
            />
          ),
        });
      },
    },
    {
      id: "Erase",
      label: "Erase",
      Icon: Flame,
      disabled: disables.disableErase,
      destructive: true,
      onSelect: (row) => {
        openModal({
          data: row,
          title: "Erase Backup",
          description: "Erasing backup record confirmation.",
          size: "sm",
          render: (row) => (
            <LazyEraseBackupDialog backupId={row.id} fileName={row.fileName} />
          ),
        });
      },
    },
  ];

  return (
    <TableRowActions
      aria-label={"Backup action's row"}
      row={backup}
      actions={actions}
    />
  );
};
