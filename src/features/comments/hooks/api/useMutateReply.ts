import { getCommentReplyQueryKeys } from "@/features/comments/services/comment-reply-query-keys";
import type { ReplyRequest } from "@/features/comments/types";
import { useMutationMapping } from "@/hooks/useClientMutator";
import { pathBuilder } from "@/services/path-builder";

const BASE_URI: string = import.meta.env.VITE_COMMENTS_CURRENT_V1;

const { current } = getCommentReplyQueryKeys();

export const useCreateReply = (commentId: string) =>
  useMutationMapping<ReplyRequest, void>({
    method: "post",
    uri: pathBuilder.action(BASE_URI, commentId, "replies"),
    invalidateKey: current.all(commentId),
  });
