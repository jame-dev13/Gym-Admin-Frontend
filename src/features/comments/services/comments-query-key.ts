import { getQueryKeyProvider } from "@/services/query-key-provider";
import type { Identifiable } from "@/types/Types";

const { administration } = getQueryKeyProvider();

const COMMENT_DOMAIN_KEY = ["comments"] as const;

export const getQueryDomainKey = () => COMMENT_DOMAIN_KEY;

const commentQueryKeys = {
  administration: {
    all: () => [...administration, ...getQueryDomainKey()] as const,
    detail: ({ id }: Identifiable) =>
      [...commentQueryKeys.administration.all(), "detail", id] as const,
    page: (params?: Record<string, unknown>) =>
      [
        ...commentQueryKeys.administration.all(),
        "page",
        { ...params },
      ] as const,
  },
};

export const getCommentQueryKeys = () => commentQueryKeys;
