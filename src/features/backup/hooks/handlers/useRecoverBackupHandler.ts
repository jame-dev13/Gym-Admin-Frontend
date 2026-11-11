import { useModalContext } from "@/context/useModalContext";
import { useRecoverBackup } from "@/features/backup/hooks/useMutateBackup";
import { useMutationHandler } from "@/hooks/useMutationHandler";
import { useToastFactory } from "@/hooks/useToastFactory";
import type { Identifiable } from "@/types/Types";
import { requireId } from "@/utils/utils";

export const useRecoverBackupHandler = (backupId: Identifiable["id"]) => {
  const { closeModal } = useModalContext();
  const { showSuccess, showError } = useToastFactory();

  const id: Identifiable = { id: backupId };
  void requireId(id);

  const mutation = useRecoverBackup(id);

  return useMutationHandler({
    id,
    mutationHook: () => mutation,
    payloadBuilder: () => undefined,
    resultHandlers: {
      onSuccess: () => showSuccess("Backup successfully recovered."),
      onError: (err) =>
        showError(`Could not recover backup now: ${err?.message}`),
      onSettled: closeModal,
    },
  });
};
