import { useDownloadBackup } from "@/features/backup/hooks/useFetchBackup";
import type { Identifiable } from "@/types/Types";
import { requireId } from "@/utils/utils";
import { useCallback } from "react";

const DEFAULT_FILE_NAME = "backup";

const resolveFileName = (contentDisposition?: string): string => {
  if (!contentDisposition) return DEFAULT_FILE_NAME;

  const encodedMatch = contentDisposition.match(
    /filename\*\s*=\s*(?:UTF-8|utf-8)''([^;]+)/,
  );

  if (encodedMatch) {
    const encodedName = encodedMatch[1].trim().replace(/^["']|["']$/g, "");
    if (encodedName) {
      try {
        return decodeURIComponent(encodedName);
      } catch {
        return encodedName;
      }
    }
  }

  const plainMatch = contentDisposition.match(/filename\s*=\s*"?([^";]+)"?/i);
  const plainName = plainMatch?.[1]?.trim();

  return plainName || DEFAULT_FILE_NAME;
};

export const useDownloadBackupHandler = (backupId: Identifiable["id"]) => {
  const id: Identifiable = { id: backupId };
  void requireId(id);

  const { download, isDownloading } = useDownloadBackup(id);

  const handleDownload = useCallback(async () => {
    if (isDownloading) return;

    const { data } = await download();
    if (!data?.blob) return;

    const url = URL.createObjectURL(data.blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = resolveFileName(data.contentDisposition);
    anchor.style.display = "none";

    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  }, [download, isDownloading]);

  return { handleDownload, isDownloading };
};
