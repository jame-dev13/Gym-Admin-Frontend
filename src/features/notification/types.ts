export type NotificationSummary = Readonly<{
  availability: "AVAILABLE" | "UNDER_LOCK";
  ttl: number;
}>;