import type { Identifiable } from "@/types/Types";

export type AuditLogResponse = Readonly<AuditLog>;

type AuditLog = {
  entity: AuditLogEntity;
  action: string;
  actor: AuditLogActor;
  payload: AuditPayload;
  metadata: AuditLogMetadata;
  success: boolean;
  createdAt: string;
};

type AuditLogEntity = {
  type: string;
  entityId: Identifiable;
};

type AuditLogActor = {
  userId: Identifiable;
  username: string;
};

type AuditLogMetadata = {
  ip: string;
  userAgent: string;
};

type AuditPayload =
  | AuditCrudPayload
  | AuditLogPlainPayload
  | AuditLogErrorPayload;

type AuditCrudPayload = {
  type: "CRUD";
  before: Record<string, unknown>;
  after: Record<string, unknown>;
};

type AuditLogPlainPayload = {
  type: "AUTHENTICATION" | "VERIFICATION";
  info: Record<string, unknown>;
};

type AuditLogErrorPayload = {
  type: "ERROR";
  error: Record<string, unknown>;
};
