import { lazy } from "react";

const AuditRouter = {
  AuditLogPreview: lazy(() =>
    import("@/features/audit/layouts/AuditLogPreviewLayout").then((mod) => ({
      default: mod.AuditLogPreviewLayout,
    })),
  ),
};

export const getAuditRouter = () => AuditRouter;
