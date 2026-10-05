import { useVerify } from "./useVerify";
import { useAppNavigation } from "@/hooks/useAppNavigation";
import { useMutationHandler } from "@/hooks/useMutationHandler";
import { useToastFactory } from "@/hooks/useToastFactory";

const useHandleVerify = () => {
  const { showError } = useToastFactory();
  const { nav } = useAppNavigation("/auth/login");
  const { submit, error, isPending } = useMutationHandler({
    mutationHook: useVerify,
    payloadBuilder: (formData) => {
      const email = formData?.get("email");
      if (typeof email !== "string" || email.length === 0) {
        throw new Error("Email is required to verify the account");
      }
      return {
        email,
        token: (formData?.getAll("token") ?? []).map(String).join(""),
      };
    },
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
