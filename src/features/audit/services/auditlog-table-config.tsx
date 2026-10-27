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
      <section className="grid min-w-0 grid-rows-2 gap-x-4 gap-y-1.5 text-sm text-text-secondary">
        <div className="flex min-w-0 items-center gap-1.5">
          <Box size={15} aria-hidden="true" className="shrink-0" />
          <span className="sr-only">Entity</span>
          <span className="min-w-0 truncate" title={entity.type}>
            {entity.type}
          </span>
        </div>
        <div className="flex min-w-0 items-center gap-1.5">
          <UserCheck size={15} aria-hidden="true" className="shrink-0" />
          <span className="sr-only">Actor</span>
          <span className="min-w-0 truncate" title={actor.username}>
            {actor.username}
          </span>
        </div>
      </section>
    ),
  },
  {
    kind: "data",
    key: "success",
    header: "Status",
    render: (_, { success, createdAt }) => (
      <section className="grid min-w-0 grid-rows-2 gap-x-4 gap-y-1.5 text-sm text-text-secondary">
        <div className="flex min-w-0 items-center gap-1.5">
          <Asterisk size={15} aria-hidden="true" className="shrink-0" />
          <span className="sr-only">Entity</span>
          <span className="min-w-0 truncate">
            {success ? "SUCCEED" : "ERROR"}
          </span>
        </div>
        <div className="flex min-w-0 items-center gap-1.5">
          <Timer size={15} aria-hidden="true" className="shrink-0" />
          <span className="sr-only">Actor</span>
          <span className="min-w-0 truncate" title={createdAt}>
            {createdAt}
          </span>
        </div>
      </section>
    ),
  },
  {
    kind: "data",
    key: "action",
    header: "Action",
    render: (_, { action }) => (
      <section className="grid min-w-0 grid-rows-2 gap-x-4 gap-y-1.5 text-sm text-text-secondary">
        <div className="flex min-w-0 items-center gap-1.5">
          <Activity size={15} aria-hidden="true" className="shrink-0" />
          <span className="sr-only">Entity</span>
          <span className="min-w-0 truncate" title={action}>
            {action}
          </span>
        </div>
      </section>
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
