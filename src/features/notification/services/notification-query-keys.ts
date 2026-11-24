import { getQueryKeyProvider } from "@/services/query-key-provider";

const DOMAIN = "notification";

export const getNotificationQueryKey = () => DOMAIN;

export const getNotificationQueryKeys = () => notificationQueryKeys;

const { administration, current } = getQueryKeyProvider();

const notificationQueryKeys = {
  administration: {
    all: () => [...administration, DOMAIN] as const,
  },
  current: {
    all: () => [...current, DOMAIN] as const,
  },
};