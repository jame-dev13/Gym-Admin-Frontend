import { Badge } from "@/components/badge/Badge";
import { useAuditLogSections } from "@/features/audit/hooks/useAuditLogSections";
import { formatAuditFieldLabel } from "@/features/audit/services/audit-log-normalizer";
import type { AuditLogSection } from "@/features/audit/services/audit-log-sections";
import type { AuditLogResponse } from "@/features/audit/types";

const isWideSection = (id: AuditLogSection["id"]) => id === "metadata";

const AuditLogSectionCard = ({ section }: { section: AuditLogSection }) => {
  const entries = Object.entries(section.data);

  return (
    <section
      aria-label={`${section.label} section`}
      className={`overflow-hidden rounded-xl border border-border bg-surface-over/20 ${
        isWideSection(section.id) ? "tab:col-span-2" : ""
      }`}
    >
      <div
        aria-hidden="true"
        className={`h-1 w-full ${section.accentClassName}`}
      />

      <div className="p-3.5 sm:p-4">
        <h3>
          <Badge
            variant={section.badgeVariant}
            leading="dot"
            title={`${section.label} section`}
          >
            {section.label}
          </Badge>
        </h3>

        {entries.length === 0 ? (
          <p className="mt-3 text-sm text-text-tertiary">
            No details available.
          </p>
        ) : (
          <dl className="mt-3 flex flex-col gap-2.5">
            {entries.map(([key, value]) => (
              <div
                key={key}
                className="grid gap-0.5 sm:grid-cols-[minmax(7rem,0.45fr)_1fr] sm:gap-3"
              >
                <dt className="text-[0.7rem] font-semibold uppercase tracking-wider text-text-tertiary">
                  {formatAuditFieldLabel(key)}
                </dt>
                <dd className="min-w-0 whitespace-pre-line break-words text-sm leading-relaxed text-text-primary">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </section>
  );
};

export const AuditLogDetails = ({ data }: { data: AuditLogResponse }) => {
  const sections = useAuditLogSections(data);

  return (
    <div className="grid gap-3 tab:grid-cols-2">
      {sections.map((section) => (
        <AuditLogSectionCard key={section.id} section={section} />
      ))}
    </div>
  );
};
