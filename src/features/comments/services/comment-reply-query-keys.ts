import { getCommentQueryKeys } from "@/features/comments/services/comments-query-key";

const { current } = getCommentQueryKeys();

const commentReplyQueryKeys = {
  current: {
    all: (commentId: string) =>
      [...current.all(), "replies", commentId] as const,
    slice: (commentId: string, params?: Record<string, unknown>) =>
      [
        ...commentReplyQueryKeys.current.all(commentId),
        "slice",
        { ...params },
      ] as const,
  },
};

export const getCommentReplyQueryKeys = () => commentReplyQueryKeys;
