import { ConfirmDialog } from "@/components/confirm-dialog/ConfirmDialog";
import { useModalContext } from "@/context/useModalContext";
import { useHardDeleteBackupHandler } from "@/features/backup/hooks/handlers/useHardDeleteBackupHandler";
import type { BackupDialogProps } from "@/features/backup/types";
import { Flame } from "lucide-react";

const EraseBackupDialog = ({
  backupId,
  fileName,
}: BackupDialogProps) => {
  const { closeModal } = useModalContext();
  const { submit, isPending, error } = useHardDeleteBackupHandler(backupId);

  return (
    <ConfirmDialog
      title="Erase backup"
      description={
        fileName
          ? `Erase the application data from ${fileName}? This action cannot be undone latter.`
          : "Erase the application data from this backup? This action cannot be undone letter."
      }
      confirmLabel="Erase backup"
      pendingLabel="Erasing..."
      tone="destructive"
      Icon={Flame}
      isPending={isPending}
      error={error?.message ?? null}
      onCancel={closeModal}
      onConfirmSubmit={submit}
      confirmAriaLabel="Erase backup confirm button."
    />
  );
};

export default EraseBackupDialog;