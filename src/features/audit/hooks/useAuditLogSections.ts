import { useMemo } from "react";
import {
  buildAuditLogSections,
  type AuditLogSection,
} from "@/features/audit/services/audit-log-sections";
import type { AuditLogResponse } from "@/features/audit/types";

export const useAuditLogSections = (
  data: AuditLogResponse,
): readonly AuditLogSection[] =>
  useMemo<readonly AuditLogSection[]>(
    () => buildAuditLogSections(data),
    [data],
  );
