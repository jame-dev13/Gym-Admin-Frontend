import { useModalContext } from "@/context/useModalContext";
import { useCreateReply } from "@/features/comments/hooks/api/useMutateReply";
import { useMutationHandler } from "@/hooks/useMutationHandler";
import { useToastFactory } from "@/hooks/useToastFactory";

export const useCreateReplyHandler = (commentId: string) => {
  const { showError, showSuccess } = useToastFactory();
  const { closeModal } = useModalContext();

  const hook = useCreateReply(commentId);

  return useMutationHandler({
    mutationHook: () => hook,
    payloadBuilder: (fd) => ({ comment: String(fd?.get("comment")) }),
    resultHandlers: {
      onSuccess: () => showSuccess("Reply created with success."),
      onError: (err) =>
        showError(`Could not make reply by now: ${err?.message}`),
      onSettled: closeModal,
    },
  });
};
