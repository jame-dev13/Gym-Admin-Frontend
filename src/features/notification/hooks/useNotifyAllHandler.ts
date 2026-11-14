import { useTriggerNotificationAll } from "@/features/notification/hooks/useNotification";
import { useMutationHandler } from "@/hooks/useMutationHandler";
import { useToastFactory } from "@/hooks/useToastFactory";

export const useNotifyAllHandler = () => {
  const { showSuccess, showError } = useToastFactory();

  return useMutationHandler({
    mutationHook: useTriggerNotificationAll,
    payloadBuilder: () => undefined,
    resultHandlers: {
      onSuccess: () =>
        showSuccess("Notification process started with success."),
      onError: (err) =>
        showError(err?.message ?? "Cannot start the notification process."),
    },
  });
};
