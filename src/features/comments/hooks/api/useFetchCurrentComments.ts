import { getCommentReplyQueryKeys } from "@/features/comments/services/comment-reply-query-keys";
import { getCommentQueryKeys } from "@/features/comments/services/comments-query-key";
import type { CommentResponse, CommunityCommentResponse, ReplyResponse } from "@/features/comments/types";
import {
  usePageFetchMapping,
  useSliceFetchMapping,
} from "@/hooks/useClientFetcher";
import { pathBuilder } from "@/services/path-builder";

const BASE_URI: string = import.meta.env.VITE_COMMENTS_CURRENT_V1;
const BASE_URI_COMMUNITY: string = import.meta.env.VITE_COMMUNITY_COMMENTS_V1;

const { current } = getCommentQueryKeys();
const { current: replyCurrent } = getCommentReplyQueryKeys();

export const useGetCurrentCommentPage = (params?: Record<string, unknown>) =>
  usePageFetchMapping<CommentResponse>({
    uri: BASE_URI,
    queryKey: [...current.page(params)],
    params,
  });

export const useGetCommentReplySlice = (
  commentId: string,
  params?: Record<string, unknown>,
) =>
  useSliceFetchMapping<ReplyResponse>({
    uri: pathBuilder.action(BASE_URI, commentId, "replies"),
    queryKey: [...replyCurrent.slice(commentId, params)],
    params,
  });

export const useGetCommunityCommentPage = (params?: Record<string, unknown>) =>
  usePageFetchMapping<CommunityCommentResponse>({
    uri: BASE_URI_COMMUNITY,
    queryKey: [...current.page(params), "community"],
    params,
  });