import { ListRenderer } from "@/components/list/ListRenderer";
import { getCommentListConfig } from "@/features/comments/services/comments-list-config";

export const CommentListLayout = () => (
  <ListRenderer config={getCommentListConfig()} />
);
