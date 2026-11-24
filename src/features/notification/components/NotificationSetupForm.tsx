import { memo, useState } from "react";
import { useNotificationRangeSetterHandler } from "@/features/notification/hooks/handlers/useNotificationConfigHandler";
import { AppForm } from "@/components/form/AppForm";
import { LockKeyhole, Pen, Save } from "lucide-react";
import SelectableItem from "@/components/SelectableItem";
import { SubmitBtn } from "@/components/buttons/Buttons";

const cardValueItems = [
  { key: "minimum-value", value: 3 },
  { key: "normal-value", value: 4 },
  { key: "intermediate-value", value: 5 },
  { key: "2th-intermediate-value", value: 6 },
  { key: "maximum-value", value: 7 },
];

const NOTIFICATION_NAME = "numberOfDays";
const RANGE_HINT_ID = "notification-range-hint";
const RANGE_DISABLED_ID = "notification-range-disabled";

export type NotificationSetupFormProps = {
  isNotifiable: boolean;
  currentDayRange: number;
};

export const NotificationSetupForm = memo(
  ({ isNotifiable, currentDayRange }: NotificationSetupFormProps) => {
    const [value, setValue] = useState(() => currentDayRange);
    const { submit, isPending } = useNotificationRangeSetterHandler();

    return (
      <section
        aria-labelledby="notification-range-heading"
        className="flex flex-col gap-4 border-t border-border-emphasis/50 pt-5"
      >
        <header className="flex items-start gap-3">
          <span
            aria-hidden="true"
            className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent"
          >
            <Pen size={16} />
          </span>
          <div className="flex flex-col gap-0.5">
            <h3
              id="notification-range-heading"
              className="text-sm font-semibold text-text-primary"
            >
              Notification range
            </h3>
            <p id={RANGE_HINT_ID} className="text-xs text-text-secondary">
              Choose how many days in advance you want to be reminded.
            </p>
          </div>
        </header>

        <AppForm onSubmit={submit} className="gap-4">
          <fieldset
            disabled={!isNotifiable || isPending}
            aria-describedby={`${RANGE_HINT_ID}${
              isNotifiable ? "" : ` ${RANGE_DISABLED_ID}`
            }`}
            className="m-0 flex min-w-0 flex-col gap-4 p-0"
          >
            <legend className="sr-only">Notification day range</legend>

            <div className="flex flex-wrap items-center gap-2">
              {cardValueItems.map((item) => (
                <SelectableItem
                  size="lg"
                  key={item.key}
                  name={NOTIFICATION_NAME}
                  value={item.value}
                  checked={value === item.value}
                  disabled={!isNotifiable}
                  onChange={(_, next) => setValue(next)}
                >
                  <span className="flex flex-col items-center leading-none">
                    <span className="text-base font-bold">{item.value}</span>
                    <span className="mt-1 text-[9px] font-medium tracking-normal">
                      days
                    </span>
                  </span>
                </SelectableItem>
              ))}
            </div>

            {!isNotifiable && (
              <p
                id={RANGE_DISABLED_ID}
                className="flex items-start gap-2 rounded-lg border border-warning/30 bg-warning/10 px-3 py-2 text-xs leading-relaxed text-warning"
              >
                <LockKeyhole
                  size={14}
                  aria-hidden="true"
                  className="mt-0.5 shrink-0"
                />
                Enable notifications first to change the reminder range.
              </p>
            )}

            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs text-text-tertiary">
                Current range:{" "}
                <span className="font-semibold text-text-secondary">
                  {currentDayRange}{" "}
                  {currentDayRange === 1 ? "day" : "days"}
                </span>
              </p>
              <SubmitBtn
                Icon={Save}
                isPending={isPending}
                pendingLabel="Saving…"
                disabled={!isNotifiable}
                className="max-sm:px-3 max-sm:py-1.5 max-sm:text-xs"
              >
                Save range
              </SubmitBtn>
            </div>
          </fieldset>
        </AppForm>
      </section>
    );
  },
);
