import { getCommentQueryKeys } from "@/features/comments/services/comments-query-key";
import type {
  CommentRequest,
  CommentResponse,
} from "@/features/comments/types";
import { useMutationMapping } from "@/hooks/useClientMutator";
import { pathBuilder } from "@/services/path-builder";
import type { Identifiable } from "@/types/Types";

const BASE_URI: string = import.meta.env.VITE_COMMENTS_CURRENT_V1;

const { current } = getCommentQueryKeys();

const commentMutationBase = {
  invalidateKey: [...current.all()],
  options: { meta: { clearAudit: true } },
};

export const useCreateCurrentComment = () =>
  useMutationMapping<CommentRequest, CommentResponse>({
    uri: BASE_URI,
    method: "post",
    ...commentMutationBase,
  });

export const useUpdateCurrentComment = ({ id }: Identifiable) =>
  useMutationMapping<CommentRequest, CommentResponse>({
    uri: pathBuilder.detail(BASE_URI, id),
    method: "put",
    ...commentMutationBase,
  });

export const useDeleteCurrentComment = ({ id }: Identifiable) =>
  useMutationMapping<undefined, void>({
    uri: pathBuilder.detail(BASE_URI, id),
    method: "delete",
    ...commentMutationBase,
  });
