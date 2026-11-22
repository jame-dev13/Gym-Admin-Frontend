import { getQueryKeyProvider } from "@/services/query-key-provider";
import type { Identifiable } from "@/types/Types";

const { administration, current } = getQueryKeyProvider();

const AUDIT_DOMAIN_KEY = ["audit"] as const;

export const getQueryDomainKey = () => AUDIT_DOMAIN_KEY;

const auditQueryKeys = {
  administration: {
    all: () => [...administration, ...getQueryDomainKey()] as const,
    detail: ({ id }: Identifiable) =>
      [...auditQueryKeys.administration.all(), "detail", id] as const,
    page: (params?: Record<string, unknown>) =>
      [...auditQueryKeys.administration.all(), "page", { ...params }] as const,
  },
  current: {
    all: () => [...current, ...getQueryDomainKey()] as const,
    page: (params?: Record<string, unknown>) =>
      [...auditQueryKeys.current.all(), "page", { ...params }] as const,
  },
};

export const getAuditQueryKeys = () => auditQueryKeys;
