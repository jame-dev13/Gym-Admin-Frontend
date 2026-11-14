import { Settings2 } from "lucide-react";
import { CurrentLayout } from "@/features/current/layouts/CurrentLayout";
import { NotificationAllPanel } from "@/features/notification/components/NotificationAllPanel";

export const AdminSettingsLayout = () => {
  return (
    <section
      aria-labelledby="admin-settings-heading"
      className="flex h-full min-h-0 w-full flex-col gap-6 overflow-y-auto overscroll-contain pr-2 [scrollbar-color:var(--color-border)_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border"
    >
      <header className="flex flex-col gap-2">
        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent">
          <Settings2 size={14} aria-hidden="true" />
          Administration settings
        </span>
        <h1
          id="admin-settings-heading"
          className="text-3xl font-bold tracking-tight text-text-primary"
        >
          Settings
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-text-secondary">
          Manage your account details and control gym-wide notifications from
          one place.
        </p>
      </header>

      <div className="grid min-h-0 gap-6 pb-2 xl:grid-cols-2">
        <CurrentLayout />
        <NotificationAllPanel />
      </div>
    </section>
  );
};

export default AdminSettingsLayout;
