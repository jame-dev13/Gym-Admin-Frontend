import { useModalContext } from "@/context/useModalContext";
import { useHardDeleteBackup } from "@/features/backup/hooks/useMutateBackup";
import { useMutationHandler } from "@/hooks/useMutationHandler";
import { useToastFactory } from "@/hooks/useToastFactory";
import type { Identifiable } from "@/types/Types";
import { requireId } from "@/utils/utils";

export const useHardDeleteBackupHandler = (backupId: Identifiable["id"]) => {
  const { closeModal } = useModalContext();
  const { showSuccess, showError } = useToastFactory();

  const id: Identifiable = { id: backupId };
  void requireId(id);

  const mutation = useHardDeleteBackup(id);

  return useMutationHandler({
    id,
    mutationHook: () => mutation,
    payloadBuilder: () => undefined,
    resultHandlers: {
      onSuccess: () => showSuccess("Backup successfully erased."),
      onError: (err) =>
        showError(`Could not erase backup now: ${err?.message}`),
      onSettled: closeModal,
    },
  });
};
