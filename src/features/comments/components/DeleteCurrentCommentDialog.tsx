import { Trash2 } from "lucide-react";
import { ConfirmDialog } from "@/components/confirm-dialog/ConfirmDialog";
import { useModalContext } from "@/context/useModalContext";
import { useDeleteCurrentCommentHandler } from "@/features/comments/hooks/handlers/useDeleteCurrentCommentHandler";
import type { CommentResponse } from "@/features/comments/types";
import type { Identifiable } from "@/types/Types";

export type DeleteCurrentCommentDialogProps = {
  commentId: Identifiable["id"];
  from: CommentResponse["from"];
};

export const DeleteCurrentCommentDialog = ({
  commentId,
  from,
}: DeleteCurrentCommentDialogProps) => {
  const { closeModal } = useModalContext();
  const { submit, isPending, error } = useDeleteCurrentCommentHandler(commentId);

  return (
    <ConfirmDialog
      title="Remove comment"
      description={`Proceed to remove the comment from ${from} from the application?`}
      confirmLabel="Remove comment"
      pendingLabel="Removing…"
      tone="destructive"
      Icon={Trash2}
      isPending={isPending}
      error={error?.message ?? null}
      onCancel={closeModal}
      onConfirmSubmit={submit}
      confirmAriaLabel="Remove comment confirm button."
    />
  );
};
