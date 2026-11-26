import { useModalContext } from "@/context/useModalContext";
import { useUpdateCurrentComment } from "@/features/comments/hooks/api/useMutateCurrentComments";
import type {
  CommentRequest,
  CommentResponse,
} from "@/features/comments/types";
import { useMutationHandler } from "@/hooks/useMutationHandler";
import { useToastFactory } from "@/hooks/useToastFactory";
import type { Identifiable } from "@/types/Types";
import { requireId } from "@/utils/utils";

export const useEditCurrentCommentHandler = (commentId: Identifiable["id"]) => {
  const { closeModal } = useModalContext();
  const { showSuccess, showError } = useToastFactory();

  const id: Identifiable = { id: commentId };
  void requireId(id);

  const mutation = useUpdateCurrentComment(id);

  return useMutationHandler<CommentRequest, CommentResponse>({
    id,
    mutationHook: () => mutation,
    payloadBuilder: (fd) => {
      const rawRate = fd?.get("rate");

      return {
        comment: String(fd?.get("comment") ?? ""),
        commentType: String(
          fd?.get("commentType"),
        ) as CommentRequest["commentType"],
        rate: rawRate === null || rawRate === "" ? null : Number(rawRate),
      };
    },
    resultHandlers: {
      onSuccess: () => showSuccess("Comment updated with success."),
      onError: (err) => showError(`Cannot update comment: ${err?.message}`),
      onSettled: closeModal,
    },
  });
};
