import { getNotificationQueryKeys } from "@/features/notification/services/notification-query-keys";
import type {
  NotificationConfigResponse,
  NotificationSummary,
} from "@/features/notification/types";
import { useFetchMapping } from "@/hooks/useClientFetcher";
import { useMutationMapping } from "@/hooks/useClientMutator";

const BASE = `${import.meta.env.VITE_ADMINISTRATION_V1}/subs/notifications`;

const { administration, current } = getNotificationQueryKeys();

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

const BASE_CURRENT: string = import.meta.env.VITE_NOTIFICATIONS_V1;

const MUTATION_CURRENT_CONFIG = {
  method: "patch",
  invalidateKey: [...current.all()],
} as const;

export const useGetNotificationCurrentConfig = () =>
  useFetchMapping<NotificationConfigResponse>({
    uri: BASE_CURRENT,
    queryKey: [...current.all()],
  });

export const useEnableNotifications = () =>
  useMutationMapping<undefined, void>({
    uri: `${BASE_CURRENT}/activate`,
    ...MUTATION_CURRENT_CONFIG,
  });

export const useDisableNotifications = () =>
  useMutationMapping<undefined, void>({
    uri: `${BASE_CURRENT}/deactivate`,
    ...MUTATION_CURRENT_CONFIG,
  });

export const useSetNotificationRange = () =>
  useMutationMapping<{ numberOfDays: number }, void>({
    uri: `${BASE_CURRENT}/range`,
    ...MUTATION_CURRENT_CONFIG,
  });
