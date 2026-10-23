import { Download } from "lucide-react";
import { CommandBtn } from "@/components/buttons/Buttons";
import { useDownloadBackupHandler } from "@/features/backup/hooks/handlers/useDownloadBackupHandler";
import type { Identifiable } from "@/types/Types";

export type DownloadBackupButtonProps = {
  backupId: Identifiable["id"];
};

export const DownloadBackupButton = ({
  backupId,
}: DownloadBackupButtonProps) => {
  const { handleDownload, isDownloading } = useDownloadBackupHandler(backupId);

  return (
    <CommandBtn
      Icon={Download}
      onClick={handleDownload}
      aria-label="Download backup"
      title="Download backup"
      disabled={isDownloading}
    >
      {isDownloading ? "Downloading…" : "Download backup"}
    </CommandBtn>
  );
};
