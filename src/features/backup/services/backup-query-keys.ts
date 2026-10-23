import { getQueryKeyProvider } from "@/services/query-key-provider";
import type { Identifiable } from "@/types/Types";

const { administration } = getQueryKeyProvider();

const BACKUP_DOMAIN_KEY = ["backups"] as const;

export const getQueryDomainKey = () => BACKUP_DOMAIN_KEY;

const backupQueryKeys = {
  administration: {
    all: () => [...administration, ...getQueryDomainKey()] as const,
    detail: ({ id }: Identifiable) =>
      [...backupQueryKeys.administration.all(), "detail", id] as const,
    page: (params?: Record<string, unknown>) =>
      [...backupQueryKeys.administration.all(), "page", { ...params }] as const,
  },
};

export const getBackupQueryKeys = () => backupQueryKeys;
