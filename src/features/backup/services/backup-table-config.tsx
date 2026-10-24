import { Badge } from "@/components/badge/Badge";
import type { BadgeVariant } from "@/components/badge/BadgeTypes";
import type { TableRendererConfig } from "@/components/table/tableRendererConfig";
import { BackupTableRowActions } from "@/features/backup/components/BackupTableRowActions";
import { useGetPageBackup } from "@/features/backup/hooks/useFetchBackup";
import type { BackupResponse } from "@/features/backup/types";
import type { Column } from "@/types/Types";

type BackupStatus = BackupResponse["backupStatus"];

const SIZE_UNITS = ["B", "KB", "MB", "GB", "TB"] as const;

const formatFileSize = (size: number) => {
  if (!Number.isFinite(size) || size <= 0) return "0 B";

  const exponent = Math.min(
    Math.floor(Math.log(size) / Math.log(1024)),
    SIZE_UNITS.length - 1,
  );
  const value = size / 1024 ** exponent;

  return `${value.toFixed(exponent === 0 ? 0 : 1)} ${SIZE_UNITS[exponent]}`;
};

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
});

const formatDate = (createdAt: string) => {
  const date = new Date(createdAt);

  return Number.isNaN(date.getTime()) ? createdAt : dateFormatter.format(date);
};

const STATUS_LABEL: Record<BackupStatus, string> = {
  SUCCESS: "Success",
  FAILURE: "Failure",
  PROGRESS: "In progress",
  RESTORED: "Restored",
  RESTORED_FAIL: "Restore failed",
};

const STATUS_VARIANT: Record<BackupStatus, BadgeVariant> = {
  SUCCESS: "emerald",
  FAILURE: "rose",
  PROGRESS: "amber",
  RESTORED: "blue",
  RESTORED_FAIL: "purple",
};

const columns: Column<BackupResponse>[] = [
  {
    key: "fileName",
    header: "File name",
    render: (_, { fileName }) => (
      <Badge variant="blue" mono title={`Backup file: ${fileName}`}>
        {fileName}
      </Badge>
    ),
  },
  {
    key: "size",
    header: "Size",
    render: (_, { size }) => (
      <Badge variant="emerald" mono title={`Backup size: ${size} bytes`}>
        {formatFileSize(size)}
      </Badge>
    ),
  },
  {
    key: "backupStatus",
    header: "Status",
    render: (_, { backupStatus }) => (
      <Badge
        variant={STATUS_VARIANT[backupStatus]}
        title={`Backup status: ${backupStatus}`}
      >
        {STATUS_LABEL[backupStatus]}
      </Badge>
    ),
  },
  {
    key: "createdBy",
    header: "Created by",
    render: (_, { createdBy }) => (
      <Badge variant="indigo" leading="initial" title={`Created by: ${createdBy}`}>
        {createdBy}
      </Badge>
    ),
  },
  {
    key: "createdAt",
    header: "Created at",
    render: (_, { createdAt }) => (
      <time dateTime={createdAt} className="text-sm text-text-secondary">
        {formatDate(createdAt)}
      </time>
    ),
  },
  {
    key: "Actions",
    kind: "action",
    header: "Actions",
    renderActions: (row) => <BackupTableRowActions row={row} />,
  },
];

const backupTableConfig: TableRendererConfig<BackupResponse> = {
  usePage: useGetPageBackup,
  columns,
  title: "Backups",
  tableOptions: {
    "aria-label": "Backup's data Table",
    cardTitleKey: "fileName",
    emptyMessage: "Backups not found..",
    size: "sm",
    striped: true,
    responsive: "cards",
  },
  loadingMessage: "Loading backup's data",
  search: {
    enabled: true,
    placeholder: "Search in backups....",
  },
  sort: {
    properties: ["id", "fileName", "size", "backupStatus", "createdAt"],
    initialSortBy: "createdAt",
    labels: {
      id: "Id",
      fileName: "File name",
      size: "Size",
      backupStatus: "Status",
      createdAt: "Created at",
    },
    initialDirection: "desc",
  },
};

export const getBackupTableConfig = () => backupTableConfig;
