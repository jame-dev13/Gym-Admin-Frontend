import { BellRing, LockKeyhole } from "lucide-react";
import { useEffect } from "react";
import { SubmitBtn } from "@/components/buttons/Buttons";
import { AppForm } from "@/components/form/AppForm";
import { useNotifyAllHandler } from "@/features/notification/hooks/useNotifyAllHandler";
import { useGetNotificationAvailability } from "@/features/notification/hooks/useNotification";
import { useCountdown } from "@/hooks/useCountdown";

const statusBadgeStyles =
  "inline-flex w-fit items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold tracking-wide";

export const NotificationAllPanel = () => {
  const availabilityQuery = useGetNotificationAvailability();
  const { submit, isPending: isSubmitting, error: submitError } =
    useNotifyAllHandler();

  const isPending = availabilityQuery.isPending || availabilityQuery.isLoading;
  const summary = availabilityQuery.data?.data;
  const availability = summary?.availability;
  const isLocked = availability === "UNDER_LOCK";
  const countdown = useCountdown(isLocked ? summary?.ttl : 0);
  const refetchAvailability = availabilityQuery.refetch;

  useEffect(() => {
    if (!isLocked || countdown.remainingMs > 0) return;

    void refetchAvailability?.();
  }, [countdown.remainingMs, isLocked, refetchAvailability]);

  return (
    <section
      aria-labelledby="notification-all-heading"
      className="flex w-full flex-col gap-4 rounded-2xl border border-border bg-surface-raised p-4"
    >
      <div className="flex flex-col gap-1">
        <h2
          id="notification-all-heading"
          className="text-lg font-semibold tracking-tight text-text-primary"
        >
          Notify everyone
        </h2>
        <p className="text-sm text-text-secondary">
          Start a notification process for every customer in the gym.
        </p>
      </div>

      {isPending ? (
        <p role="status" className="text-sm text-text-secondary">
          Checking notification availability…
        </p>
      ) : availabilityQuery.isError ? (
        <p role="alert" className="text-sm text-danger">
          {availabilityQuery.error?.message ??
            "Notification availability could not be loaded."}
        </p>
      ) : isLocked ? (
        <div
          role="status"
          aria-live="polite"
          className="flex flex-col gap-3 rounded-xl border border-warning/40 bg-warning/10 p-3"
        >
          <span className={`${statusBadgeStyles} border-warning/40 text-warning`}>
            {availability}
          </span>
          <div className="flex items-start gap-2">
            <LockKeyhole
              size={18}
              aria-hidden="true"
              className="mt-0.5 shrink-0 text-warning"
            />
            <p className="text-sm text-text-secondary">
              A notification process is already running. Another notification
              can be sent in{" "}
              <span className="font-semibold tabular-nums text-text-primary">
                {countdown.formatted}
              </span>
              .
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <span
            className={`${statusBadgeStyles} border-success/40 text-success`}
          >
            {availability}
          </span>

          <AppForm onSubmit={submit}>
            <SubmitBtn
              Icon={BellRing}
              isPending={isSubmitting}
              pendingLabel="Starting…"
              aria-label="Notify all customers"
            >
              Notify all customers
            </SubmitBtn>
          </AppForm>

          {submitError?.message && (
            <p role="alert" className="text-sm text-danger">
              {submitError.message}
            </p>
          )}
        </div>
      )}
    </section>
  );
};
