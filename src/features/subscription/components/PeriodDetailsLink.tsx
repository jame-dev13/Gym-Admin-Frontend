import { PopoverLink } from "@/components/popover";
import type { SubscriptionResponse } from "@/features/subscription/types";
import { CircleQuestionMark } from "lucide-react";
import type { FC } from "react";

export const PeriodDetailsLink: FC<{ subscription: SubscriptionResponse }> = ({
  subscription,
}) => {
  if (subscription.periods.length === 0) {
    return (
      <CircleQuestionMark
        aria-label="No period details available"
        className="rounded-full bg-amber-400 p-2 text-amber-700"
      />
    );
  }

  return (
    <PopoverLink
      label="Subscription period details"
      data={subscription.periods}
      color="blue"
      render={(periods) => (
        <ul className="flex list-none flex-col gap-1 rounded-2xl bg-surface-secondary p-1">
          {periods.map((period) => (
            <li
              key={`${period.periodType}-${period.periodStr}`}
              className="inline-flex items-center-safe gap-2 p-2 italic"
            >
              <span className="capitalize">
                {period.periodType}
                {": "}
              </span>
              <strong>{period.periodStr}</strong>
            </li>
          ))}
        </ul>
      )}
    >
      <p>See period details</p>
    </PopoverLink>
  );
};
