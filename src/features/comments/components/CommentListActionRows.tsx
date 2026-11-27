import { PencilLine, Trash2 } from "lucide-react";
import { lazy } from "react";
import { ListRowActions } from "@/components/list/ListRowActions";
import { useModalContext } from "@/context/useModalContext";
import type { CommentRow } from "@/features/comments/types";
import type { RowAction } from "@/types/Types";

const LazyEditCurrentCommentForm = lazy(() =>
  import("@/features/comments/components/EditCurrentCommentForm").then(
    (mod) => ({
      default: mod.EditCurrentCommentForm,
    }),
  ),
);

const LazyDeleteCurrentCommentDialog = lazy(() =>
  import("@/features/comments/components/DeleteCurrentCommentDialog").then(
    (mod) => ({
      default: mod.DeleteCurrentCommentDialog,
    }),
  ),
);

const belongsToCurrentUser = (comment: CommentRow): boolean =>
  !("isOwner" in comment) || comment.isOwner;

export const CommentListActionRows = ({ row }: { row: CommentRow }) => {
  const { isOpen: isModalOpen, openModal } = useModalContext();

  if (!belongsToCurrentUser(row)) {
    return null;
  }

  const actions: RowAction<CommentRow>[] = [
    {
      id: "edit-comment",
      label: "Edit comment",
      Icon: PencilLine,
      disabled: isModalOpen || !row.commentId,
      onSelect: (comment) => {
        openModal({
          title: "Edit comment",
          description: `Update the comment from ${comment.from}.`,
          size: "md",
          data: comment,
          render: (current) => (
            <LazyEditCurrentCommentForm comment={current} />
          ),
        });
      },
    },
    {
      id: "remove-comment",
      label: "Remove comment",
      Icon: Trash2,
      destructive: true,
      disabled: isModalOpen || !row.commentId,
      onSelect: (comment) => {
        openModal({
          title: "Remove comment",
          description: `Remove the comment from ${comment.from}.`,
          size: "sm",
          data: comment,
          render: (current) => (
            <LazyDeleteCurrentCommentDialog
              commentId={current.commentId}
              from={current.from}
            />
          ),
        });
      },
    },
  ];

  return <ListRowActions row={row} actions={actions} />;
};
