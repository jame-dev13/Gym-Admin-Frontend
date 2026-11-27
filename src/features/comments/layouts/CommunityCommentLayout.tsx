import { ListRenderer } from "@/components/list/ListRenderer";
import { getCommunityCommentListConfig } from "@/features/comments/services/comments-list-config";

const CommunityCommentLayout = () => (
  <ListRenderer config={getCommunityCommentListConfig()} />
);

export default CommunityCommentLayout;
