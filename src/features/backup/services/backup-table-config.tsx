import type { BadgeVariant } from "@/components/badge/BadgeTypes";
import {
  TableField,
  TableFieldGroup,
  type TableFieldIndicator,
} from "@/components/table/TableField";
import type { TableRendererConfig } from "@/components/table/tableRendererConfig";
import { BackupTableRowActions } from "@/features/backup/components/BackupTableRowActions";
import { MakeBackupLink } from "@/features/backup/components/MakeBackupLink";
import { useGetPageBackup } from "@/features/backup/hooks/useFetchBackup";
import type { BackupResponse } from "@/features/backup/types";
import type { Column } from "@/types/Types";
import type { LucideIcon } from "lucide-react";
import {
  CircleCheck,
  CircleX,
  Database,
  FileText,
  History,
  LoaderCircle,
  Timer,
  TriangleAlert,
  UserCheck,
} from "lucide-react";

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

const STATUS_ICON: Record<BackupStatus, LucideIcon> = {
  SUCCESS: CircleCheck,
  FAILURE: CircleX,
  PROGRESS: LoaderCircle,
  RESTORED: History,
  RESTORED_FAIL: TriangleAlert,
};

const STATUS_INDICATOR: Record<BackupStatus, TableFieldIndicator> = {
  SUCCESS: "success",
  FAILURE: "danger",
  PROGRESS: "warning",
  RESTORED: "info",
  RESTORED_FAIL: "purple",
};

const columns: Column<BackupResponse>[] = [
  {
    kind: "data",
    key: "fileName",
    header: "File",
    render: (_, { fileName, size }) => (
      <TableFieldGroup>
        <TableField
          icon={FileText}
          label="File name"
          title={`Backup file: ${fileName}`}
          badge="blue"
          mono
        >
          {fileName}
        </TableField>
        <TableField
          icon={Database}
          label="Size"
          title={`Backup size: ${size} bytes`}
          badge="emerald"
          mono
        >
          {formatFileSize(size)}
        </TableField>
      </TableFieldGroup>
    ),
  },
  {
    kind: "data",
    key: "backupStatus",
    header: "Status",
    render: (_, { backupStatus, createdAt }) => (
      <TableFieldGroup>
        <TableField
          icon={STATUS_ICON[backupStatus]}
          label="Status"
          title={`Backup status: ${backupStatus}`}
          badge={STATUS_VARIANT[backupStatus]}
          leading="none"
          indicator={STATUS_INDICATOR[backupStatus]}
        >
          {STATUS_LABEL[backupStatus]}
        </TableField>
        <TableField icon={Timer} label="Created at" title={createdAt}>
          <time dateTime={createdAt}>{formatDate(createdAt)}</time>
        </TableField>
      </TableFieldGroup>
    ),
  },
  {
    kind: "data",
    key: "createdBy",
    header: "Created by",
    render: (_, { createdBy }) => (
      <TableFieldGroup>
        <TableField
          icon={UserCheck}
          label="Created by"
          title={`Created by: ${createdBy}`}
          badge="indigo"
          leading="initial"
        >
          {createdBy}
        </TableField>
      </TableFieldGroup>
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
  controls: <MakeBackupLink />,
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
