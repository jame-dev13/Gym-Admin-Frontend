import type { BadgeVariant } from "@/components/badge/BadgeTypes";
import {
  AUDIT_EMPTY_VALUE,
  extractChanges,
  formatAuditFieldLabel,
  formatAuditValue,
  formatIdentifier,
  mapAuditLogMetadata,
  type ExtractedChanges,
  type NormalizedRecord,
} from "@/features/audit/services/audit-log-normalizer";
import type { AuditLogResponse } from "@/features/audit/types";

export type AuditLogSectionTone =
  | "neutral"
  | "info"
  | "accent"
  | "purple"
  | "success"
  | "danger";

export type AuditLogSectionId =
  | "action"
  | "entity"
  | "changes"
  | "authentication"
  | "verification"
  | "error"
  | "details"
  | "metadata";

export type AuditLogChangeKind =
  | "added"
  | "removed"
  | "changed"
  | "unchanged";

export type AuditLogFieldChange = Readonly<{
  field: string;
  label: string;
  before: string;
  after: string;
  kind: AuditLogChangeKind;
}>;

type AuditLogSectionStyle = Readonly<{
  badgeVariant: BadgeVariant;
  accentClassName: string;
}>;

export type AuditLogSection = Readonly<{
  id: AuditLogSectionId;
  label: string;
  tone: AuditLogSectionTone;
  badgeVariant: BadgeVariant;
  accentClassName: string;
  data: NormalizedRecord;
  changes?: readonly AuditLogFieldChange[];
}>;

export const AUDIT_SECTION_STYLES = {
  neutral: {
    badgeVariant: "slate",
    accentClassName: "bg-border-emphasis",
  },
  info: {
    badgeVariant: "blue",
    accentClassName: "bg-popover-blue",
  },
  accent: {
    badgeVariant: "accent",
    accentClassName: "bg-accent",
  },
  purple: {
    badgeVariant: "purple",
    accentClassName: "bg-purple-600",
  },
  success: {
    badgeVariant: "emerald",
    accentClassName: "bg-success",
  },
  danger: {
    badgeVariant: "rose",
    accentClassName: "bg-danger",
  },
} as const satisfies Record<AuditLogSectionTone, AuditLogSectionStyle>;

const createSection = (
  id: AuditLogSectionId,
  label: string,
  tone: AuditLogSectionTone,
  data: NormalizedRecord,
  changes?: readonly AuditLogFieldChange[],
): AuditLogSection => ({
  id,
  label,
  tone,
  ...AUDIT_SECTION_STYLES[tone],
  data,
  ...(changes ? { changes } : {}),
});

const formatResult = (success: unknown): string => {
  if (success === true) return "Succeeded";
  if (success === false) return "Failed";

  return AUDIT_EMPTY_VALUE;
};

const resolveResultTone = (success: unknown): AuditLogSectionTone => {
  if (success === true) return "success";
  if (success === false) return "danger";

  return "neutral";
};

const formatEntityId = (entityId: unknown): string => {
  const value = formatIdentifier(entityId);

  if (value === AUDIT_EMPTY_VALUE || value === "") return AUDIT_EMPTY_VALUE;

  return `#${value}`;
};

const CHANGE_ORDER: Record<AuditLogChangeKind, number> = {
  changed: 0,
  added: 1,
  removed: 2,
  unchanged: 3,
};

const resolveChangeKind = (
  before: string | undefined,
  after: string | undefined,
): AuditLogChangeKind => {
  if (before === undefined) return "added";
  if (after === undefined) return "removed";
  return before === after ? "unchanged" : "changed";
};

export const buildAuditLogChanges = (
  before: NormalizedRecord,
  after: NormalizedRecord,
): readonly AuditLogFieldChange[] => {
  const fields = Array.from(
    new Set([...Object.keys(before), ...Object.keys(after)]),
  );

  return fields
    .map((field) => {
      const beforeValue = before[field];
      const afterValue = after[field];

      return {
        field,
        label: formatAuditFieldLabel(field),
        before: beforeValue ?? AUDIT_EMPTY_VALUE,
        after: afterValue ?? AUDIT_EMPTY_VALUE,
        kind: resolveChangeKind(beforeValue, afterValue),
      };
    })
    .sort(
      (a, b) =>
        CHANGE_ORDER[a.kind] - CHANGE_ORDER[b.kind] ||
        a.label.localeCompare(b.label),
    );
};

const resolvePayloadSections = (
  payload: ExtractedChanges,
): readonly AuditLogSection[] => {
  switch (payload.type) {
    case "CRUD":
      return [
        createSection(
          "changes",
          "Changes",
          "purple",
          {},
          buildAuditLogChanges(payload.before, payload.after),
        ),
      ];
    case "ERROR":
      return [createSection("error", "Error", "danger", payload.error)];
    case "AUTHENTICATION":
      return [
        createSection(
          "authentication",
          "Authentication",
          "purple",
          payload.info,
        ),
      ];
    case "VERIFICATION":
      return [
        createSection("verification", "Verification", "info", payload.info),
      ];
    case "UNKNOWN":
      return [createSection("details", "Details", "neutral", payload.info)];
  }
};

export const buildAuditLogSections = (
  data: AuditLogResponse,
): readonly AuditLogSection[] => {
  const actionSection = createSection(
    "action",
    "Action",
    resolveResultTone(data.success),
    {
      action: formatAuditValue(data.action),
      result: formatResult(data.success),
    },
  );

  const entitySection = createSection("entity", "Entity", "info", {
    type: formatAuditValue(data.entity?.type),
    id: formatEntityId(data.entity?.entityId),
  });

  return [
    actionSection,
    entitySection,
    ...resolvePayloadSections(extractChanges(data.payload)),
    createSection("metadata", "Metadata", "accent", mapAuditLogMetadata(data)),
  ];
};
