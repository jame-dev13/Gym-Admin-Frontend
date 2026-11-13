import { useUpdateCurrentUser } from "@/features/current/hooks/useMutateCurrent";
import { useMutationHandler } from "@/hooks/useMutationHandler";
import { useToastFactory } from "@/hooks/useToastFactory";

export const useUpdateCurrentUserInfoHandler = (onExit: () => void) => {
  const { showSuccess, showError } = useToastFactory();
  return useMutationHandler({
    mutationHook: useUpdateCurrentUser,
    payloadBuilder: (fd) => ({
      name: String(fd?.get("name") ?? ""),
      email: String(fd?.get("email") ?? ""),
      password: String(fd?.get("password") ?? ""),
    }),
    resultHandlers: {
      onSuccess: () => showSuccess(`Info data successfully updated.`),
      onError: (err) =>
        showError(`Could not update info data: ${err?.message}`),
      onSettled: onExit,
    },
  });
};
