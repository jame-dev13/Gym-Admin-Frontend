import { getBackupQueryKeys } from "@/features/backup/services/backup-query-keys";
import type { BackupResponse } from "@/features/backup/types";
import { useFetchMapping, usePageFetchMapping } from "@/hooks/useClientFetcher";
import { useDownloadAttachment } from "@/hooks/useDownloadAttachment";
import { pathBuilder } from "@/services/path-builder";
import type { Identifiable } from "@/types/Types";

const BASE: string = `${import.meta.env.VITE_ADMINISTRATION_V1}/backups`;

const { administration } = getBackupQueryKeys();

export const useGetPageBackup = (params?: Record<string, unknown>) =>
  usePageFetchMapping<BackupResponse>({
    uri: BASE,
    queryKey: [...administration.page(params)],
    params,
  });

export const useGetBackup = ({ id }: Identifiable) =>
  useFetchMapping<BackupResponse>({
    uri: pathBuilder.detail(BASE, id),
    queryKey: [...administration.detail({ id })],
    options: { enabled: !!id },
  });

export const useDownloadBackup = ({ id }: Identifiable) =>
  useDownloadAttachment({
    uri: pathBuilder.action(BASE, id, "download"),
    queryKey: [...administration.detail({ id }), "download"],
  });
