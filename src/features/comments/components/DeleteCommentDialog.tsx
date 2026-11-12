import { Trash2 } from "lucide-react";
import { ConfirmDialog } from "@/components/confirm-dialog/ConfirmDialog";
import { useModalContext } from "@/context/useModalContext";
import { useDeleteCommentHandler } from "@/features/comments/hooks/handlers/useDeleteCommentHandler";
import type { CommentResponse } from "@/features/comments/types";
import type { Identifiable } from "@/types/Types";

export type DeleteCommentDialogProps = {
  commentId: Identifiable["id"];
  from: CommentResponse["from"];
};

export const DeleteCommentDialog = ({
  commentId,
  from,
}: DeleteCommentDialogProps) => {
  const { closeModal } = useModalContext();
  const { submit, isPending, error } = useDeleteCommentHandler(commentId);

  return (
    <ConfirmDialog
      title="Delete comment"
      description={`Proceed to remove the comment from ${from} from the application?`}
      confirmLabel="Delete comment"
      pendingLabel="Deleting…"
      tone="destructive"
      Icon={Trash2}
      isPending={isPending}
      error={error?.message ?? null}
      onCancel={closeModal}
      onConfirmSubmit={submit}
      confirmAriaLabel="Delete comment confirm button."
    />
  );
};
