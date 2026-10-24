import { DatabaseBackup } from "lucide-react";
import { ConfirmDialog } from "@/components/confirm-dialog/ConfirmDialog";
import { useModalContext } from "@/context/useModalContext";
import { useMakeBackupHandler } from "@/features/backup/hooks/handlers/useMakeBackupHandler";

export const MakeBackupDialog = () => {
  const { closeModal } = useModalContext();
  const { submit, isPending, error } = useMakeBackupHandler();

  return (
    <ConfirmDialog
      title="Create backup"
      description="Create a new backup snapshot of the current application data?"
      confirmLabel="Create backup"
      pendingLabel="Creating…"
      tone="default"
      Icon={DatabaseBackup}
      isPending={isPending}
      error={error?.message ?? null}
      onCancel={closeModal}
      onConfirmSubmit={submit}
      confirmAriaLabel="Create backup confirm button."
    />
  );
};
