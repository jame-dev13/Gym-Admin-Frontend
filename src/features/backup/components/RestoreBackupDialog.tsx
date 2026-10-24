import { History } from "lucide-react";
import { ConfirmDialog } from "@/components/confirm-dialog/ConfirmDialog";
import { useModalContext } from "@/context/useModalContext";
import { useRestoreBackupHandler } from "@/features/backup/hooks/handlers/useRestoreBackupHandler";
import type { BackupResponse } from "@/features/backup/types";
import type { Identifiable } from "@/types/Types";

export type RestoreBackupDialogProps = {
  backupId: Identifiable["id"];
  fileName?: BackupResponse["fileName"];
};

export const RestoreBackupDialog = ({
  backupId,
  fileName,
}: RestoreBackupDialogProps) => {
  const { closeModal } = useModalContext();
  const { submit, isPending, error } = useRestoreBackupHandler(backupId);

  return (
    <ConfirmDialog
      title="Restore backup"
      description={
        fileName
          ? `Restore the application data from ${fileName}? Changes made after this backup was created will be lost.`
          : "Restore the application data from this backup? Changes made after it was created will be lost."
      }
      confirmLabel="Restore backup"
      pendingLabel="Restoring…"
      tone="default"
      Icon={History}
      isPending={isPending}
      error={error?.message ?? null}
      onCancel={closeModal}
      onConfirmSubmit={submit}
      confirmAriaLabel="Restore backup confirm button."
    />
  );
};
