import { Trash2 } from "lucide-react";
import { ConfirmDialog } from "@/components/confirm-dialog/ConfirmDialog";
import { useModalContext } from "@/context/useModalContext";
import { useDeleteBackupHandler } from "@/features/backup/hooks/handlers/useDeleteBackupHandler";
import type { BackupResponse } from "@/features/backup/types";
import type { Identifiable } from "@/types/Types";

export type DeleteBackupDialogProps = {
  backupId: Identifiable["id"];
  fileName?: BackupResponse["fileName"];
};

export const DeleteBackupDialog = ({
  backupId,
  fileName,
}: DeleteBackupDialogProps) => {
  const { closeModal } = useModalContext();
  const { submit, isPending, error } = useDeleteBackupHandler(backupId);

  return (
    <ConfirmDialog
      title="Delete backup"
      description={
        fileName
          ? `Permanently delete ${fileName}? This action cannot be undone.`
          : "Permanently delete this backup? This action cannot be undone."
      }
      confirmLabel="Delete backup"
      pendingLabel="Deleting…"
      tone="destructive"
      Icon={Trash2}
      isPending={isPending}
      error={error?.message ?? null}
      onCancel={closeModal}
      onConfirmSubmit={submit}
      confirmAriaLabel="Delete backup confirm button."
    />
  );
};
