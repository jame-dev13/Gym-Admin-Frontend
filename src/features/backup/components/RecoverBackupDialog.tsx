import { ConfirmDialog } from "@/components/confirm-dialog/ConfirmDialog";
import { useModalContext } from "@/context/useModalContext";
import { useRecoverBackupHandler } from "@/features/backup/hooks/handlers/useRecoverBackupHandler";
import type { BackupDialogProps } from "@/features/backup/types";
import { Recycle } from "lucide-react";

const RecoverBackupDialog = ({
  backupId,
  fileName,
}: BackupDialogProps) => {
  const { closeModal } = useModalContext();
  const { submit, isPending, error } = useRecoverBackupHandler(backupId);

  return (
    <ConfirmDialog
      title="Recover backup"
      description={`Recover the application data from ${fileName ?? "backup"}?.`}
      confirmLabel="Recover backup"
      pendingLabel="Recovering..."
      tone="default"
      Icon={Recycle}
      isPending={isPending}
      error={error?.message ?? null}
      onCancel={closeModal}
      onConfirmSubmit={submit}
      confirmAriaLabel="Recover backup confirm button."
    />
  );
};

export default RecoverBackupDialog;