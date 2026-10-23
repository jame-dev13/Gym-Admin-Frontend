import { useModalContext } from "@/context/useModalContext";
import { useMakeBackup } from "@/features/backup/hooks/useMutateBackup";
import { useMutationHandler } from "@/hooks/useMutationHandler";
import { useToastFactory } from "@/hooks/useToastFactory";

export const useMakeBackupHandler = () => {
  const { closeModal } = useModalContext();
  const { showSuccess, showError } = useToastFactory();

  return useMutationHandler({
    mutationHook: useMakeBackup,
    payloadBuilder: () => undefined,
    resultHandlers: {
      onSuccess: () => showSuccess("Backup successfully created."),
      onError: (err) => showError(`Cannot create backup: ${err?.message}`),
      onSettled: closeModal,
    },
  });
};
