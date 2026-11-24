import { AppForm } from "@/components/form/AppForm";
import { Toggler } from "@/components/toggler/Toggler";
import { useNotificationEnablerHandler } from "@/features/notification/hooks/handlers/useNotificationConfigHandler";
import { Loader2 } from "lucide-react";
import { useRef, type FC } from "react";

export type NotificationEnablerSectionProps = {
  isNotifiable: boolean;
};

export const NotificationEnablerSection: FC<
  NotificationEnablerSectionProps
> = ({ isNotifiable }) => {
  const { isPending, submit } = useNotificationEnablerHandler(isNotifiable);

  const ref = useRef<HTMLButtonElement>(null);
  const handleChange = () => {
    if (isPending) return;
    ref.current?.click();
  };

  const pendingLabel = isNotifiable
    ? "Disabling notifications…"
    : "Enabling notifications…";

  return (
    <section className="w-full" aria-busy={isPending}>
      <AppForm onSubmit={submit}>
        <div className="relative">
          <Toggler
            className="w-full"
            label="Enable notifications"
            hint={
              isPending
                ? pendingLabel
                : "Receive reminders about payments and renewals"
            }
            checked={isNotifiable}
            disabled={isPending}
            onToggle={handleChange}
          />
          {isPending && (
            <span
              role="status"
              aria-live="polite"
              className="pointer-events-none absolute inset-y-0 right-14 flex items-center"
            >
              <Loader2
                size={16}
                aria-hidden="true"
                className="animate-spin text-accent"
              />
              <span className="sr-only">{pendingLabel}</span>
            </span>
          )}
        </div>
        <button
          ref={ref}
          type="submit"
          aria-hidden="true"
          disabled={isPending}
          tabIndex={-1}
          className="hidden"
        />
      </AppForm>
    </section>
  );
};
