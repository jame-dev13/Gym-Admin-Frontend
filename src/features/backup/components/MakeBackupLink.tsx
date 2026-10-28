import { PopoverLink } from "@/components/popover/PopoverLink";
import { FormSkeleton } from "@/components/skeleton";
import { DatabaseBackup } from "lucide-react";
import { lazy, Suspense } from "react";

const MakeBackupDialog = lazy(() =>
  import("@/features/backup/components/MakeBackupDialog").then((mod) => ({
    default: mod.MakeBackupDialog,
  })),
);

export const MakeBackupLink = () => {
  return (
    <PopoverLink
      data={undefined}
      label="Make Backup"
      icon={<DatabaseBackup />}
      render={() => (
        <Suspense fallback={<FormSkeleton fields={1} />}>
          <MakeBackupDialog />
        </Suspense>
      )}
      color="blue"
      look="pill"
    >
      Make Backup
    </PopoverLink>
  );
};
