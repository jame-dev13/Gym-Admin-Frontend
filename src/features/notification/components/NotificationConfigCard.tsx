import { SectionCard } from "@/components/card/SectionCard";
import { NotificationEnablerSection } from "@/features/notification/components/NotificationEnablerSection";
import { NotificationInfoSection } from "@/features/notification/components/NotificationInfoSection";
import { NotificationSetupForm } from "@/features/notification/components/NotificationSetupForm";
import { useGetNotificationCurrentConfig } from "@/features/notification/hooks/useNotification";
import { AlertTriangle, RefreshCw, Settings } from "lucide-react";
import { useMemo } from "react";

const sectionCardConfig = {
  heading: "Preferences",
  Icon: Settings,
  description: "Manage reminders about payments and renewals",
};

export const NotificationConfigCard = () => {
  const {
    data: notification,
    isPending,
    isFetching,
    isError,
    error,
    refetch,
  } = useGetNotificationCurrentConfig();

  const isNotifiable = useMemo(
    () => notification?.data?.notifiable ?? false,
    [notification],
  );

  if (isPending || (isFetching && !notification)) {
    return (
      <SectionCard {...sectionCardConfig} className="animate-fade-in-scale">
        <div
          role="status"
          aria-live="polite"
          aria-busy="true"
          className="flex flex-col gap-4"
        >
          <span className="sr-only">Loading notification preferences…</span>
          <div className="h-14 animate-pulse rounded-xl bg-surface-over/70" />
          <div className="h-28 animate-pulse rounded-xl bg-surface-over/50" />
        </div>
      </SectionCard>
    );
  }

  if (isError) {
    return (
      <SectionCard {...sectionCardConfig} className="animate-fade-in-scale">
        <div
          role="alert"
          className="flex flex-col gap-4 rounded-xl border border-danger/40 bg-danger/10 p-4 sm:flex-row sm:items-start"
        >
          <span
            aria-hidden="true"
            className="flex size-10 shrink-0 items-center justify-center rounded-full bg-danger/15 text-danger"
          >
            <AlertTriangle size={20} />
          </span>

          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <p className="text-sm font-semibold text-text-primary">
              We couldn't load your notification preferences
            </p>
            <p className="break-words text-sm text-text-secondary">
              {error?.message ?? "Please try again in a moment."}
            </p>
          </div>

          <button
            type="button"
            onClick={() => void refetch()}
            className="inline-flex w-fit shrink-0 items-center gap-2 rounded-lg border border-border bg-surface-over px-3 py-2 text-xs font-semibold text-text-primary transition-colors hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface-raised"
          >
            <RefreshCw size={14} aria-hidden="true" />
            Try again
          </button>
        </div>
      </SectionCard>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {isNotifiable && (
        <NotificationInfoSection notification={notification.data} />
      )}

      <SectionCard {...sectionCardConfig} className="animate-fade-in-scale">
        <NotificationEnablerSection isNotifiable={isNotifiable} />
        <NotificationSetupForm
          isNotifiable={isNotifiable}
          currentDayRange={notification.data.rangeDaysNotification}
        />
      </SectionCard>
    </div>
  );
};

export default NotificationConfigCard;
