import { getCommentQueryKeys } from "@/features/comments/services/comments-query-key";
import type {
  CommentResponse,
  CommentTableRow,
} from "@/features/comments/types";
import { useFetchMapping, usePageFetchMapping } from "@/hooks/useClientFetcher";
import { pathBuilder } from "@/services/path-builder";
import type { Identifiable } from "@/types/Types";

const BASE_URI: string = `${import.meta.env.VITE_ADMINISTRATION_V1}/comments`;

const { administration } = getCommentQueryKeys();

export const useGetCommentPage = (params?: Record<string, unknown>) =>
  usePageFetchMapping<CommentResponse, CommentTableRow>({
    uri: BASE_URI,
    queryKey: [...administration.page(params)],
    params,
    select: (page) => ({
      ...page,
      content: page.content.map((comment) => ({
        ...comment,
        id: comment.commentId,
      })),
    }),
  });

export const useGetComment = ({ id }: Identifiable) =>
  useFetchMapping<CommentResponse>({
    uri: pathBuilder.detail(BASE_URI, id),
    queryKey: [...administration.detail({ id })],
    options: { enabled: !!id },
  });
