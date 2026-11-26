import { useModalContext } from "@/context/useModalContext";
import { useCreateCurrentComment } from "@/features/comments/hooks/api/useMutateCurrentComments";
import type { CommentRequest } from "@/features/comments/types";
import { useMutationHandler } from "@/hooks/useMutationHandler";
import { useToastFactory } from "@/hooks/useToastFactory";

export const useCreateCurrentCommentHandler = () => {
  const { closeModal } = useModalContext();
  const { showSuccess, showError } = useToastFactory();

  return useMutationHandler({
    mutationHook: useCreateCurrentComment,
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
      onSuccess: () => showSuccess("Comment created with success."),
      onError: (err) => showError(`Cannot create comment: ${err?.message}`),
      onSettled: closeModal,
    },
  });
};
