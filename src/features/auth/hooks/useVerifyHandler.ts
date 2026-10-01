import { useVerify } from "@/features/auth/hooks/useVerify";
import { useAppNavigation } from "@/hooks/useAppNavigation";
import { useMutationHandler } from "@/hooks/useMutationHandler";
import { useToastFactory } from "@/hooks/useToastFactory";

const useHandleVerify = () => {
  const { showError } = useToastFactory();
  const { nav } = useAppNavigation("/auth/login");
  const { submit, error, isPending } = useMutationHandler({
    mutationHook: useVerify,
    payloadBuilder: (formData) => ({
      email: String(formData?.get("email")),
      token: (formData?.getAll("token") ?? []).map(String).join(""),
    }),
    resultHandlers: {
      onSuccess: nav,
      onError: (err) => {
        showError(`Cannot succeed verification operation: ${err?.message}`);
      },
    },
  });

  return { handleSubmit: submit, error, isPending };
};

export { useHandleVerify };
