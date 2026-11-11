import type { Identifiable } from "@/types/Types";

export type BackupResponse = Identifiable & {
  fileName: string;
  size: number;
  backupStatus:
    | "SUCCESS"
    | "FAILURE"
    | "PROGRESS"
    | "RESTORED"
    | "RESTORED_FAIL";
  createdBy: string;
  createdAt: string;
};

export type BackupDialogProps = {
  backupId: Identifiable["id"];
  fileName?: string;
};