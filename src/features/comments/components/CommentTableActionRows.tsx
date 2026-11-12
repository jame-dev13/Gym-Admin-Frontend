import { Trash2 } from "lucide-react";
import { lazy } from "react";
import { TableRowActions } from "@/components/table/TableRowActions";
import { useModalContext } from "@/context/useModalContext";
import type { CommentTableRow } from "@/features/comments/types";
import type { RowAction } from "@/types/Types";

const LazyDeleteCommentDialog = lazy(() =>
  import("@/features/comments/components/DeleteCommentDialog").then((mod) => ({
    default: mod.DeleteCommentDialog,
  })),
);

export const CommentTableActionRows = ({
  row,
}: {
  row: CommentTableRow;
}) => {
  const { isOpen: isModalOpen, openModal } = useModalContext();

  const actions: RowAction<CommentTableRow>[] = [
    {
      id: "delete-comment",
      label: "Delete comment",
      Icon: Trash2,
      destructive: true,
      disabled: isModalOpen,
      onSelect: (comment) => {
        openModal({
          title: "Delete comment",
          description: `Remove the comment from ${comment.from}.`,
          size: "sm",
          data: comment,
          render: (current) => (
            <LazyDeleteCommentDialog
              commentId={current.commentId}
              from={current.from}
            />
          ),
        });
      },
    },
  ];

  return <TableRowActions row={row} actions={actions} />;
};
