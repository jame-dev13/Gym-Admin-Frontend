import {
  TableField,
  TableFieldGroup,
} from "@/components/table/TableField";
import type { TableRendererConfig } from "@/components/table/tableRendererConfig";
import { AuditLogDetailsButton } from "@/features/audit/components/AuditLogDetailsButton";
import { useGetPageAuditLog } from "@/features/audit/hooks/useFetchAuditLog";
import type { AuditLogResponse } from "@/features/audit/types";
import type { Column } from "@/types/Types";
import { Box, Asterisk, UserCheck, Timer, Activity } from "lucide-react";

const columns: Column<AuditLogResponse>[] = [
  {
    kind: "data",
    key: "entity",
    header: "Entity",
    render: (_, { entity, actor }) => (
      <TableFieldGroup>
        <TableField icon={Box} label="Entity" title={entity.type}>
          {entity.type}
        </TableField>
        <TableField icon={UserCheck} label="Actor" title={actor.username}>
          {actor.username}
        </TableField>
      </TableFieldGroup>
    ),
  },
  {
    kind: "data",
    key: "success",
    header: "Status",
    render: (_, { success, createdAt }) => (
      <TableFieldGroup>
        <TableField icon={Asterisk} label="Status">
          {success ? "SUCCEED" : "ERROR"}
        </TableField>
        <TableField icon={Timer} label="Created at" title={createdAt}>
          {createdAt}
        </TableField>
      </TableFieldGroup>
    ),
  },
  {
    kind: "data",
    key: "action",
    header: "Action",
    render: (_, { action }) => (
      <TableFieldGroup>
        <TableField icon={Activity} label="Action" title={action}>
          {action}
        </TableField>
      </TableFieldGroup>
    ),
  },
  {
    kind: "action",
    key: "Actions",
    header: "Actions",
    renderActions: (log) => <AuditLogDetailsButton data={log} />,
  },
];

const auditLogTableConfig: TableRendererConfig<AuditLogResponse> = {
  usePage: useGetPageAuditLog,
  columns,
  title: "AuditLogs",
  tableOptions: {
    "aria-label": "Audit log's data Table",
    cardTitleKey: "entity",
    getRowKey: (row) => row.id!,
    emptyMessage: "Audit logs not found..",
    size: "sm",
    striped: true,
    responsive: "cards",
  },
  loadingMessage: "Loading audit log's data",
  search: {
    enabled: true,
    placeholder: "Search in logs....",
  },
  sort: {
    properties: ["id", "actor", "action", "entity", "createdAt"],
    initialSortBy: "id",
    labels: {
      id: "Id",
      actor: "Actor",
      Action: "Action",
      entity: "Entity",
      createdAt: "Date",
    },
    initialDirection: "asc",
  },
};

export const getAuditLogTableConfig = () => auditLogTableConfig;
