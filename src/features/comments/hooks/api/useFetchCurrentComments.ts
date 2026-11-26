import { getCommentQueryKeys } from "@/features/comments/services/comments-query-key";
import type { CommentResponse } from "@/features/comments/types";
import { usePageFetchMapping } from "@/hooks/useClientFetcher";

const BASE_URI: string = import.meta.env.VITE_COMMENTS_CURRENT_V1;

const { current } = getCommentQueryKeys();

export const useGetCurrentCommentPage = (params?: Record<string, unknown>) =>
  usePageFetchMapping<CommentResponse>({
    uri: BASE_URI,
    queryKey: [...current.page(params)],
    params,
  });
