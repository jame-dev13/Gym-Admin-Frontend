import { getQueryKeyProvider } from "@/services/query-key-provider";
import type { Identifiable } from "@/types/Types";

const { administration, current } = getQueryKeyProvider();

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
  current: {
    all: () => [...current, ...getQueryDomainKey()] as const,
    page: (params?: Record<string, unknown>) =>
      [
        ...commentQueryKeys.current.all(),
        "page",
        { ...params },
      ] as const,
  },
};

export const getCommentQueryKeys = () => commentQueryKeys;
