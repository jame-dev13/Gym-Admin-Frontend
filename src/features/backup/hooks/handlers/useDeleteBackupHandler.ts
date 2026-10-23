import { useModalContext } from "@/context/useModalContext";
import { useDeleteBackup } from "@/features/backup/hooks/useMutateBackup";
import { useMutationHandler } from "@/hooks/useMutationHandler";
import { useToastFactory } from "@/hooks/useToastFactory";
import type { Identifiable } from "@/types/Types";
import { requireId } from "@/utils/utils";

export const useDeleteBackupHandler = (backupId: Identifiable["id"]) => {
  const { closeModal } = useModalContext();
  const { showSuccess, showError } = useToastFactory();

  const id: Identifiable = { id: backupId };
  void requireId(id);

  const mutation = useDeleteBackup(id);

  return useMutationHandler({
    id,
    mutationHook: () => mutation,
    payloadBuilder: () => undefined,
    resultHandlers: {
      onSuccess: () => showSuccess("Backup deleted with success."),
      onError: (err) => showError(`Cannot delete backup: ${err?.message}`),
      onSettled: closeModal,
    },
  });
};
