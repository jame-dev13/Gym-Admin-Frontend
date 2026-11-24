import type { NotificationRangeSelection } from "@/features/notification/types";

/**
 * Backend contract for the notification range: the range must be a whole
 * number of days between `MIN` and `MAX`.
 */
export const NOTIFICATION_RANGE_MIN = 3;
export const NOTIFICATION_RANGE_MAX = 7;

/**
 * Values surfaced as quick choices. Any other value between the backend
 * bounds has to be typed through the custom input.
 */
export const NOTIFICATION_RANGE_PRESETS: ReadonlyArray<number> = [3, 4, 5];

export const isValidNotificationRange = (
  days: number | null,
): days is number =>
  days !== null &&
  Number.isInteger(days) &&
  days >= NOTIFICATION_RANGE_MIN &&
  days <= NOTIFICATION_RANGE_MAX;

export const clampNotificationRange = (days: number): number => {
  if (!Number.isFinite(days)) return NOTIFICATION_RANGE_MIN;

  return Math.min(
    NOTIFICATION_RANGE_MAX,
    Math.max(NOTIFICATION_RANGE_MIN, Math.round(days)),
  );
};

/**
 * Maps a backend value to the selector state. Preset values keep the preset
 * choice active; anything else (6 or 7) opens the custom input.
 */
export const toNotificationRangeSelection = (
  days: number,
): NotificationRangeSelection => {
  const clamped = clampNotificationRange(days);
  return {
    mode: NOTIFICATION_RANGE_PRESETS.includes(clamped) ? "preset" : "custom",
    days: clamped,
  };
};
