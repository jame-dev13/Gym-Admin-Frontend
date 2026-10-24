import { useAuditLogSections } from "@/features/audit/hooks/useAuditLogSections";
import {
  AUDIT_EMPTY_VALUE,
  formatAuditFieldLabel,
} from "@/features/audit/services/audit-log-normalizer";
import type {
  AuditLogFieldChange,
  AuditLogSection,
} from "@/features/audit/services/audit-log-sections";
import type { AuditLogResponse } from "@/features/audit/types";

const joinValues = (...values: Array<string | undefined>): string => {
  const visible = values.filter(
    (value): value is string =>
      value !== undefined && value !== "" && value !== AUDIT_EMPTY_VALUE,
  );

  return visible.join(" ") || AUDIT_EMPTY_VALUE;
};

const DetailItem = ({
  label,
  value,
  className = "",
}: {
  label: string;
  value: string;
  className?: string;
}) => (
  <div className={`min-w-0 ${className}`}>
    <dt className="text-[0.7rem] font-semibold uppercase tracking-wider text-text-tertiary">
      {label}
    </dt>
    <dd className="mt-0.5 min-w-0 whitespace-pre-line wrap-break-word text-sm text-text-primary">
      {value}
    </dd>
  </div>
);

const AuditSummary = ({
  action,
  entity,
  metadata,
  success,
}: {
  action?: AuditLogSection;
  entity?: AuditLogSection;
  metadata?: AuditLogSection;
  success: boolean;
}) => {
  const actionValue = action?.data.action ?? AUDIT_EMPTY_VALUE;
  const resultValue = action?.data.result ?? AUDIT_EMPTY_VALUE;
  const entityValue = joinValues(entity?.data.type, entity?.data.id);
  const performedBy = metadata?.data.performedBy ?? AUDIT_EMPTY_VALUE;
  const actorId = metadata?.data.actorId;
  const performedByValue =
    performedBy === AUDIT_EMPTY_VALUE
      ? performedBy
      : actorId && actorId !== AUDIT_EMPTY_VALUE
        ? `${performedBy} (#${actorId})`
        : performedBy;
  const performedAt = metadata?.data.performedAt ?? AUDIT_EMPTY_VALUE;
  const ipAddress = metadata?.data.ipAddress ?? AUDIT_EMPTY_VALUE;
  const userAgent = metadata?.data.userAgent ?? AUDIT_EMPTY_VALUE;
  const resultTone = success ? "text-success" : "text-danger";

  return (
    <section aria-label="Summary" className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border pb-3">
        <div className="min-w-0">
          <p className="text-[0.7rem] font-semibold uppercase tracking-wider text-text-tertiary">
            Action
          </p>
          <p className="mt-0.5 truncate text-base font-semibold text-text-primary">
            {actionValue}
          </p>
        </div>

        <span
          className={`inline-flex shrink-0 items-center gap-1.5 text-sm font-medium ${resultTone}`}
        >
          <span className="size-2 rounded-full bg-current" aria-hidden="true" />
          {resultValue}
        </span>
      </div>

      <dl className="grid gap-x-4 gap-y-3 sm:grid-cols-2">
        <DetailItem label="Entity" value={entityValue} />
        <DetailItem label="Performed by" value={performedByValue} />
        <DetailItem label="Performed at" value={performedAt} />
        <DetailItem label="IP address" value={ipAddress} />
        {userAgent !== AUDIT_EMPTY_VALUE && (
          <DetailItem
            label="User agent"
            value={userAgent}
            className="sm:col-span-2"
          />
        )}
      </dl>
    </section>
  );
};

const ChangeRow = ({ change }: { change: AuditLogFieldChange }) => {
  const isAdded = change.kind === "added";
  const isRemoved = change.kind === "removed";
  const isUnchanged = change.kind === "unchanged";

  return (
    <div
      role="row"
      className="grid gap-2 border-t border-border/60 px-3 py-3 first:border-t-0 sm:grid-cols-[minmax(7rem,0.35fr)_1fr_1fr] sm:gap-3"
    >
      <div role="cell" className="flex min-w-0 flex-wrap items-center gap-2">
        <span
          className={`text-sm font-medium ${
            isUnchanged ? "text-text-secondary" : "text-text-primary"
          }`}
        >
          {change.label}
        </span>
        {change.kind === "added" && (
          <span className="text-[0.65rem] font-semibold uppercase tracking-wide text-success">
            Added
          </span>
        )}
        {change.kind === "removed" && (
          <span className="text-[0.65rem] font-semibold uppercase tracking-wide text-danger">
            Removed
          </span>
        )}
      </div>

      <div role="cell" className="min-w-0">
        <span className="mr-1.5 text-xs text-text-tertiary sm:hidden">
          Before
        </span>
        <span
          className={`whitespace-pre-line wrap-break-word text-sm ${
            isAdded || isUnchanged ? "text-text-tertiary" : "text-text-primary"
          }`}
        >
          {change.before}
        </span>
      </div>

      <div role="cell" className="min-w-0">
        <span className="mr-1.5 text-xs text-text-tertiary sm:hidden">
          After
        </span>
        <span
          className={`whitespace-pre-line wrap-break-word text-sm ${
            isRemoved || isUnchanged
              ? "text-text-tertiary"
              : "text-text-primary"
          }`}
        >
          {change.after}
        </span>
      </div>
    </div>
  );
};

const AuditChanges = ({ section }: { section: AuditLogSection }) => {
  const changes = section.changes ?? [];
  const visibleChanges = changes.filter(({ kind }) => kind !== "unchanged");
  const unchangedChanges = changes.filter(({ kind }) => kind === "unchanged");

  return (
    <section aria-label={`${section.label} section`} className="space-y-2">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-text-tertiary">
        {section.label}
      </h3>

      {changes.length === 0 ? (
        <p className="text-sm text-text-secondary">
          No field changes were recorded.
        </p>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border">
          {visibleChanges.length > 0 ? (
            <div role="table" aria-label="Changed fields">
              <div role="rowgroup">
                <div
                  role="row"
                  className="sr-only sm:not-sr-only sm:grid sm:grid-cols-[minmax(7rem,0.35fr)_1fr_1fr] sm:gap-3 sm:border-b sm:border-border sm:bg-surface-over/40 sm:px-3 sm:py-2"
                >
                  <span
                    role="columnheader"
                    className="text-[0.65rem] font-semibold uppercase tracking-wider text-text-tertiary"
                  >
                    Field
                  </span>
                  <span
                    role="columnheader"
                    className="text-[0.65rem] font-semibold uppercase tracking-wider text-text-tertiary"
                  >
                    Before
                  </span>
                  <span
                    role="columnheader"
                    className="text-[0.65rem] font-semibold uppercase tracking-wider text-text-tertiary"
                  >
                    After
                  </span>
                </div>
              </div>

              <div role="rowgroup">
                {visibleChanges.map((change) => (
                  <ChangeRow key={change.field} change={change} />
                ))}
              </div>
            </div>
          ) : (
            <p className="px-3 py-3 text-sm text-text-secondary">
              No changed fields were recorded.
            </p>
          )}

          {unchangedChanges.length > 0 && (
            <details className="border-t border-border/60">
              <summary className="cursor-pointer px-3 py-2 text-xs font-medium text-text-tertiary transition-colors hover:text-text-secondary">
                Show {unchangedChanges.length} unchanged field
                {unchangedChanges.length === 1 ? "" : "s"}
              </summary>
              <div
                role="table"
                aria-label="Unchanged fields"
                className="border-t border-border/60"
              >
                {unchangedChanges.map((change) => (
                  <ChangeRow key={change.field} change={change} />
                ))}
              </div>
            </details>
          )}
        </div>
      )}
    </section>
  );
};

const AuditDetailSection = ({ section }: { section: AuditLogSection }) => {
  const entries = Object.entries(section.data);

  return (
    <section aria-label={`${section.label} section`} className="space-y-2">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-text-tertiary">
        {section.label}
      </h3>

      {entries.length === 0 ? (
        <p className="text-sm text-text-secondary">No details available.</p>
      ) : (
        <dl className="grid gap-x-4 gap-y-3 sm:grid-cols-2">
          {entries.map(([key, value]) => (
            <DetailItem key={key} label={formatAuditFieldLabel(key)} value={value} />
          ))}
        </dl>
      )}
    </section>
  );
};

export const AuditLogDetails = ({ data }: { data: AuditLogResponse }) => {
  const sections = useAuditLogSections(data);
  const actionSection = sections.find(({ id }) => id === "action");
  const entitySection = sections.find(({ id }) => id === "entity");
  const metadataSection = sections.find(({ id }) => id === "metadata");
  const payloadSections = sections.filter(
    ({ id }) => id !== "action" && id !== "entity" && id !== "metadata",
  );

  return (
    <div className="flex flex-col gap-5">
      <AuditSummary
        action={actionSection}
        entity={entitySection}
        metadata={metadataSection}
        success={data.success}
      />

      {payloadSections.map((section) =>
        section.changes !== undefined ? (
          <AuditChanges key={section.id} section={section} />
        ) : (
          <AuditDetailSection key={section.id} section={section} />
        ),
      )}
    </div>
  );
};
