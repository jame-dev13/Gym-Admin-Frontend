import { getQueryKeyProvider } from "@/services/query-key-provider";

const DOMAIN = "notification";

export const getNotificationQueryKey = () => DOMAIN;

export const getNotificationQueryKeys = () => notificationQueryKeys;

const { administration } = getQueryKeyProvider();

const notificationQueryKeys = {
  administration: {
    all: () => [...administration, DOMAIN] as const,
  },
  current: {}
}