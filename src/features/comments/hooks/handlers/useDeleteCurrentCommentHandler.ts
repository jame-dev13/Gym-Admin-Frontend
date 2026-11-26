import { useModalContext } from "@/context/useModalContext";
import { useDeleteCurrentComment } from "@/features/comments/hooks/api/useMutateCurrentComments";
import { useMutationHandler } from "@/hooks/useMutationHandler";
import { useToastFactory } from "@/hooks/useToastFactory";
import type { Identifiable } from "@/types/Types";
import { requireId } from "@/utils/utils";

export const useDeleteCurrentCommentHandler = (
  commentId: Identifiable["id"],
) => {
  const { closeModal } = useModalContext();
  const { showSuccess, showError } = useToastFactory();

  const id: Identifiable = { id: commentId };
  void requireId(id);

  const mutation = useDeleteCurrentComment(id);

  return useMutationHandler({
    id,
    mutationHook: () => mutation,
    payloadBuilder: () => undefined,
    resultHandlers: {
      onSuccess: () => showSuccess("Comment removed with success."),
      onError: (err) => showError(`Cannot remove comment: ${err?.message}`),
      onSettled: closeModal,
    },
  });
};
