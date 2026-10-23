import { ModalHost } from "@/components/modal/ModalHost";
import { ModalProvider } from "@/context/ModalProvider";
import { AuditLogList } from "@/features/audit/components/AuditLogList";

/**
 * Temporary preview surface for the audit-log list. Remove this layout and its
 * route once the list is wired into the administration panel.
 */
export const AuditLogPreviewLayout = () => (
  <ModalProvider>
    <main className="flex h-dvh flex-col overflow-hidden bg-surface px-4 py-5 text-text-primary sm:px-6 tab:px-8 tab:py-6">
      <AuditLogList />
    </main>
    <ModalHost />
  </ModalProvider>
);
