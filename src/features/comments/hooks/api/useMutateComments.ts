import { getCommentQueryKeys } from "@/features/comments/services/comments-query-key";
import { useMutationMapping } from "@/hooks/useClientMutator";
import { pathBuilder } from "@/services/path-builder";
import type { Identifiable } from "@/types/Types";

const BASE_URI: string = `${import.meta.env.VITE_ADMINISTRATION_V1}/comments`;

const { administration } = getCommentQueryKeys();

const commentMutationBase = {
  invalidateKey: [...administration.all()],
  options: { meta: { clearAudit: true } },
};

export const useDeleteComment = ({ id }: Identifiable) =>
  useMutationMapping<undefined, void>({
    uri: pathBuilder.detail(BASE_URI, id),
    method: "delete",
    ...commentMutationBase,
  });
