import { getNotificationQueryKeys } from "@/features/notification/services/notification-query-keys";
import type { NotificationSummary } from "@/features/notification/types";
import { useFetchMapping } from "@/hooks/useClientFetcher";
import { useMutationMapping } from "@/hooks/useClientMutator";

const BASE = `${import.meta.env.VITE_ADMINISTRATION_V1}/subs/notifications`;

const { administration } = getNotificationQueryKeys();

export const useGetNotificationAvailability = () =>
  useFetchMapping<NotificationSummary>({
    uri: `${BASE}/availability`,
    queryKey: [...administration.all(), "available"],
  });

export const useTriggerNotificationAll = () =>
  useMutationMapping<undefined, void>({
    uri: BASE,
    method: "post",
    invalidateKey: [...administration.all(), "available"],
  });
