export type NotificationSummary = Readonly<{
  availability: "AVAILABLE" | "UNDER_LOCK";
  ttl: number;
}>;

export type NotificationConfigResponse = Readonly<{
  rangeDaysNotification: number;
  nextNotificationDate: string;
  notifiable: boolean;
}>;

export type NotificationRangeMode = "preset" | "custom";

export type NotificationRangeSelection = Readonly<{
  mode: NotificationRangeMode;
  days: number | null;
}>;

export type NotificationConfigUpdate = Readonly<{
  notifiable: boolean;
  numberOfDays: number;
}>;
