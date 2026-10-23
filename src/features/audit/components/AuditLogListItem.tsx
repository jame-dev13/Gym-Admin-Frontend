import { Box, CalendarClock, UserRound } from "lucide-react";
import { Badge } from "@/components/badge/Badge";
import { AuditLogDetailsButton } from "@/features/audit/components/AuditLogDetailsButton";
import { useAuditLogSections } from "@/features/audit/hooks/useAuditLogSections";
import { AUDIT_EMPTY_VALUE } from "@/features/audit/services/audit-log-normalizer";
import type { AuditLogResponse } from "@/features/audit/types";

const joinDisplayValues = (...values: Array<string | undefined>): string => {
  const visible = values.filter(
    (value): value is string =>
      value !== undefined && value !== "" && value !== AUDIT_EMPTY_VALUE,
  );

  return visible.join(" ") || AUDIT_EMPTY_VALUE;
};

export const AuditLogListItem = ({ data }: { data: AuditLogResponse }) => {
  const sections = useAuditLogSections(data);

  const actionSection = sections.find(({ id }) => id === "action");
  const entitySection = sections.find(({ id }) => id === "entity");
  const metadataSection = sections.find(({ id }) => id === "metadata");
  const payloadSections = sections.filter(
    ({ id }) => id !== "action" && id !== "entity" && id !== "metadata",
  );

  const action = actionSection?.data.action ?? AUDIT_EMPTY_VALUE;
  const result = actionSection?.data.result ?? AUDIT_EMPTY_VALUE;
  const entity = joinDisplayValues(
    entitySection?.data.type,
    entitySection?.data.id,
  );
  const performedBy =
    metadataSection?.data.performedBy ?? AUDIT_EMPTY_VALUE;
  const performedAt =
    metadataSection?.data.performedAt ?? AUDIT_EMPTY_VALUE;
  const isCrud = payloadSections.some(({ id }) => id === "before");
  const payloadLabel = isCrud
    ? "Changes"
    : (payloadSections[0]?.label ?? "Details");
  const payloadVariant = isCrud
    ? "purple"
    : (payloadSections[0]?.badgeVariant ?? "slate");

  return (
    <li className="rounded-xl border border-border bg-surface-raised p-3.5 shadow-sm transition-colors hover:border-border-emphasis sm:p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="blue" leading="dot" title={`Action: ${action}`}>
              {action}
            </Badge>
            <Badge
              variant={actionSection?.badgeVariant ?? "slate"}
              leading="dot"
              title={`Result: ${result}`}
            >
              {result}
            </Badge>
            <Badge
              variant={payloadVariant}
              leading="dot"
              title={`Payload: ${payloadLabel}`}
            >
              {payloadLabel}
            </Badge>
          </div>

          <dl className="grid grid-cols-1 gap-x-4 gap-y-1.5 text-sm text-text-secondary sm:grid-cols-2 tab:grid-cols-3">
            <div className="flex min-w-0 items-center gap-1.5">
              <Box size={15} aria-hidden="true" className="shrink-0" />
              <dt className="sr-only">Entity</dt>
              <dd className="min-w-0 truncate" title={entity}>
                {entity}
              </dd>
            </div>

            <div className="flex min-w-0 items-center gap-1.5">
              <UserRound size={15} aria-hidden="true" className="shrink-0" />
              <dt className="sr-only">Performed by</dt>
              <dd className="min-w-0 truncate" title={performedBy}>
                {performedBy}
              </dd>
            </div>

            <div className="flex min-w-0 items-center gap-1.5">
              <CalendarClock
                size={15}
                aria-hidden="true"
                className="shrink-0"
              />
              <dt className="sr-only">Performed at</dt>
              <dd className="min-w-0 truncate" title={performedAt}>
                {performedAt}
              </dd>
            </div>
          </dl>
        </div>

        <div className="shrink-0 sm:self-center">
          <AuditLogDetailsButton data={data} />
        </div>
      </div>
    </li>
  );
};
