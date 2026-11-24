import {
  useDisableNotifications,
  useEnableNotifications,
  useSetNotificationRange,
} from "@/features/notification/hooks/useNotification";
import { useMutationHandler } from "@/hooks/useMutationHandler";
import { useToastFactory } from "@/hooks/useToastFactory";

const MESSAGES_GROUP = {
  success: {
    enable: "Auto Notification's has been enabled with success.",
    disable: "Auto Notification's has been disabled with success.",
  },
  error: {
    enable: "Could not enabled the notification now.",
    disable: "Could not enabled the notification now.",
  },
};

export const useNotificationEnablerHandler = (isNotifiable: boolean) => {
  const { showWarning, showError } = useToastFactory();

  const hook = isNotifiable ? useDisableNotifications : useEnableNotifications;

  return useMutationHandler({
    mutationHook: hook,
    resultHandlers: {
      onSuccess: () =>
        showWarning(
          isNotifiable
            ? MESSAGES_GROUP.success.disable
            : MESSAGES_GROUP.success.enable,
        ),
      onError: (err) =>
        showError(
          `${
            isNotifiable
              ? MESSAGES_GROUP.success.disable
              : MESSAGES_GROUP.success.enable
          }: ${err?.message}`,
        ),
    },
  });
};
const NOTIFICATION_NAME = "numberOfDays";

export const useNotificationRangeSetterHandler = () => {
  const { showSuccess, showError } = useToastFactory();

  return useMutationHandler({
    mutationHook: useSetNotificationRange,
    payloadBuilder: (fd) => ({
      numberOfDays: Number(fd?.get(NOTIFICATION_NAME)),
    }),
    resultHandlers: {
      onSuccess: () => showSuccess(`Day range setup with success.`),
      onError: (err) =>
        showError(`Cannot setup notification day rang: ${err?.message}`),
    },
  });
};
