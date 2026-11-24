import { SectionCard } from "@/components/card/SectionCard";
import type { NotificationConfigResponse } from "@/features/notification/types";
import { BellRing, CalendarClock, Info } from "lucide-react";
import { memo } from "react";

export type NotificationInfoSectionProps = {
  notification: NotificationConfigResponse;
};

const formatNotificationDate = (value: string) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

export const NotificationInfoSection = memo(
  ({ notification }: NotificationInfoSectionProps) => {
    const { rangeDaysNotification, nextNotificationDate } = notification;
    const dayLabel = rangeDaysNotification === 1 ? "day" : "days";

    return (
      <SectionCard
        heading="Notification info"
        Icon={Info}
        className="animate-fade-in-scale"
      >
        <dl className="grid gap-3 sm:grid-cols-2">
          <div className="flex items-center gap-3 rounded-xl border border-border/70 bg-surface-over/40 p-3">
            <span
              aria-hidden="true"
              className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent"
            >
              <CalendarClock size={18} />
            </span>
            <div className="flex min-w-0 flex-col">
              <dt className="text-[10px] font-semibold uppercase tracking-wider text-text-tertiary">
                Reminder range
              </dt>
              <dd className="text-sm font-semibold text-text-primary">
                {rangeDaysNotification} {dayLabel} in advance
              </dd>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-border/70 bg-surface-over/40 p-3">
            <span
              aria-hidden="true"
              className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent"
            >
              <BellRing size={18} />
            </span>
            <div className="flex min-w-0 flex-col">
              <dt className="text-[10px] font-semibold uppercase tracking-wider text-text-tertiary">
                Next reminder
              </dt>
              <dd className="truncate text-sm font-semibold text-text-primary">
                <time dateTime={nextNotificationDate}>
                  {formatNotificationDate(nextNotificationDate)}
                </time>
              </dd>
            </div>
          </div>
        </dl>

        <p className="flex items-start gap-2 rounded-xl bg-accent/5 px-3 py-2 text-xs leading-relaxed text-text-secondary">
          <Info
            size={14}
            aria-hidden="true"
            className="mt-0.5 shrink-0 text-accent"
          />
          You'll be reminded before your subscription expires so you can renew
          it in time.
        </p>
      </SectionCard>
    );
  },
);
