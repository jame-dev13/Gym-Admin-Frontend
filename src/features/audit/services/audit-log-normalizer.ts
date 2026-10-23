import type { AuditLogResponse } from "@/features/audit/types";

export const AUDIT_EMPTY_VALUE = "—";

export type NormalizedRecord = Readonly<Record<string, string>>;

export type ExtractedChanges =
  | { type: "CRUD"; before: NormalizedRecord; after: NormalizedRecord }
  | { type: "AUTHENTICATION"; info: NormalizedRecord }
  | { type: "VERIFICATION"; info: NormalizedRecord }
  | { type: "ERROR"; error: NormalizedRecord }
  | { type: "UNKNOWN"; info: NormalizedRecord };

export type AuditLogMetadataView = Readonly<{
  performedBy: string;
  actorId: string;
  performedAt: string;
  ipAddress: string;
  userAgent: string;
}>;

type AuditPayloadInput = Partial<{
  type: string;
  before: unknown;
  after: unknown;
  info: unknown;
  error: unknown;
}>;

type PeriodLike = {
  periodType: unknown;
  periodStr: unknown;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const isPrimitive = (value: unknown): boolean =>
  value === null || typeof value !== "object";

const isPeriod = (value: unknown): value is PeriodLike =>
  isRecord(value) && "periodType" in value && "periodStr" in value;

const formatPeriod = ({ periodType, periodStr }: PeriodLike): string =>
  `${formatAuditValue(periodType)}: ${formatAuditValue(periodStr)}`;

const formatArray = (values: readonly unknown[]): string => {
  if (values.length === 0) return AUDIT_EMPTY_VALUE;

  if (values.every(isPeriod)) {
    return values.map(formatPeriod).join("\n");
  }

  if (values.every(isPrimitive)) {
    return values.map(formatAuditValue).join(", ");
  }

  return values.map(formatAuditValue).join("\n");
};

const formatObject = (value: Record<string, unknown>): string => {
  const entries = Object.entries(value);

  if (entries.length === 0) return AUDIT_EMPTY_VALUE;

  return entries
    .map(([key, nestedValue]) => `${key}: ${formatAuditValue(nestedValue)}`)
    .join("\n");
};

export const formatAuditValue = (value: unknown): string => {
  if (value === null || value === undefined) return AUDIT_EMPTY_VALUE;
  if (Array.isArray(value)) return formatArray(value);
  if (isRecord(value)) return formatObject(value);

  return String(value);
};

export const formatIdentifier = (value: unknown): string => {
  const identifier = isRecord(value) && "id" in value ? value.id : value;

  return formatAuditValue(identifier);
};

const FIELD_LABEL_OVERRIDES: Record<string, string> = {
  id: "ID",
  userId: "User ID",
  actorId: "Actor ID",
  entityId: "Entity ID",
  ip: "IP",
  ipAddress: "IP address",
  userAgent: "User agent",
};

export const formatAuditFieldLabel = (key: string): string => {
  const override = FIELD_LABEL_OVERRIDES[key];
  if (override) return override;

  const spaced = key
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .trim();

  if (!spaced) return AUDIT_EMPTY_VALUE;

  return spaced.charAt(0).toUpperCase() + spaced.slice(1).toLowerCase();
};

export const getAuditLogKey = (data: AuditLogResponse): string =>
  [
    data.createdAt,
    data.action,
    data.payload?.type,
    data.entity?.type,
    formatIdentifier(data.entity?.entityId),
    formatIdentifier(data.actor?.userId),
  ].join("|");

export const normalizeRecord = (record: unknown): NormalizedRecord => {
  if (!isRecord(record)) return {};

  return Object.fromEntries(
    Object.entries(record).map(([key, value]) => [
      key,
      formatAuditValue(value),
    ]),
  );
};

export const extractChanges = (
  payload: AuditPayloadInput | null | undefined,
): ExtractedChanges => {
  if (!payload) return { type: "UNKNOWN", info: {} };

  switch (payload.type) {
    case "CRUD":
      return {
        type: "CRUD",
        before: normalizeRecord(payload.before),
        after: normalizeRecord(payload.after),
      };
    case "ERROR":
      return { type: "ERROR", error: normalizeRecord(payload.error) };
    case "AUTHENTICATION":
      return { type: "AUTHENTICATION", info: normalizeRecord(payload.info) };
    case "VERIFICATION":
      return { type: "VERIFICATION", info: normalizeRecord(payload.info) };
    default:
      return { type: "UNKNOWN", info: normalizeRecord(payload.info) };
  }
};

export const mapAuditLogMetadata = (
  data: AuditLogResponse,
): AuditLogMetadataView => ({
  performedBy: formatAuditValue(data.actor?.username),
  actorId: formatIdentifier(data.actor?.userId),
  performedAt: formatAuditValue(data.createdAt),
  ipAddress: formatAuditValue(data.metadata?.ip),
  userAgent: formatAuditValue(data.metadata?.userAgent),
});
