import type { BadgeVariant } from "@/components/badge/BadgeTypes";
import {
  AUDIT_EMPTY_VALUE,
  extractChanges,
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
  | "before"
  | "after"
  | "authentication"
  | "verification"
  | "error"
  | "details"
  | "metadata";

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
): AuditLogSection => ({
  id,
  label,
  tone,
  ...AUDIT_SECTION_STYLES[tone],
  data,
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

const resolvePayloadSections = (
  payload: ExtractedChanges,
): readonly AuditLogSection[] => {
  switch (payload.type) {
    case "CRUD":
      return [
        createSection("before", "Before", "danger", payload.before),
        createSection("after", "After", "success", payload.after),
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
