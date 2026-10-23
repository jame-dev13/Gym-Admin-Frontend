import { useModalContext } from "@/context/useModalContext";
import { useRestoreBackup } from "@/features/backup/hooks/useMutateBackup";
import { useMutationHandler } from "@/hooks/useMutationHandler";
import { useToastFactory } from "@/hooks/useToastFactory";
import type { Identifiable } from "@/types/Types";
import { requireId } from "@/utils/utils";

export const useRestoreBackupHandler = (backupId: Identifiable["id"]) => {
  const { closeModal } = useModalContext();
  const { showSuccess, showError } = useToastFactory();

  const id: Identifiable = { id: backupId };
  void requireId(id);

  const mutation = useRestoreBackup(id);

  return useMutationHandler({
    id,
    mutationHook: () => mutation,
    payloadBuilder: () => undefined,
    resultHandlers: {
      onSuccess: () => showSuccess("Backup restored with success."),
      onError: (err) => showError(`Cannot restore backup: ${err?.message}`),
      onSettled: closeModal,
    },
  });
};
