import { TableRenderer } from "@/components/table/TableRenderer";
import { getCommentTableConfig } from "@/features/comments/services/comments-table-config";

export const CommentLayout = () => (
  <TableRenderer config={getCommentTableConfig()} />
);
