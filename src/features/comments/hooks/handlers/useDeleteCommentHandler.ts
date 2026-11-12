import { useModalContext } from "@/context/useModalContext";
import { useDeleteComment } from "@/features/comments/hooks/api/useMutateComments";
import { useMutationHandler } from "@/hooks/useMutationHandler";
import { useToastFactory } from "@/hooks/useToastFactory";
import type { Identifiable } from "@/types/Types";
import { requireId } from "@/utils/utils";

export const useDeleteCommentHandler = (commentId: Identifiable["id"]) => {
  const { closeModal } = useModalContext();
  const { showSuccess, showError } = useToastFactory();

  const id: Identifiable = { id: commentId };
  void requireId(id);

  const mutation = useDeleteComment(id);

  return useMutationHandler({
    id,
    mutationHook: () => mutation,
    payloadBuilder: () => undefined,
    resultHandlers: {
      onSuccess: () => showSuccess("Comment deleted with success."),
      onError: (err) => showError(`Cannot delete comment: ${err?.message}`),
      onSettled: closeModal,
    },
  });
};
