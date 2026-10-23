import { getBackupQueryKeys } from "@/features/backup/services/backup-query-keys";
import { useMutationMapping } from "@/hooks/useClientMutator";
import { pathBuilder } from "@/services/path-builder";
import type { Identifiable } from "@/types/Types";

const BASE: string = `${import.meta.env.VITE_ADMINISTRATION_V1}/backups`;

const { administration } = getBackupQueryKeys();

const backupMutationBase = {
  invalidateKey: [...administration.all()],
};

export const useMakeBackup = () =>
  useMutationMapping<undefined, void>({
    uri: BASE,
    method: "post",
    ...backupMutationBase,
  });

export const useRestoreBackup = ({ id }: Identifiable) =>
  useMutationMapping<undefined, void>({
    uri: pathBuilder.action(BASE, id, "restore"),
    method: "post",
    ...backupMutationBase,
  });

export const useDeleteBackup = ({ id }: Identifiable) =>
  useMutationMapping<undefined, void>({
    uri: pathBuilder.detail(BASE, id),
    method: "delete",
    ...backupMutationBase,
  });
