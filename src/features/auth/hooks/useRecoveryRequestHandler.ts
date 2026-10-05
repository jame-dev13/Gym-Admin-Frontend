import { useRequestRecovery } from "@/features/auth/hooks/useRecovery";
import { useMutationHandler } from "@/hooks/useMutationHandler";
import { useToastFactory } from "@/hooks/useToastFactory";

const useHandleRecoveryRequest = (
  emailRef: { current: string },
  onSuccess: () => void,
) => {
  const { showError } = useToastFactory();

  const { submit, error, isPending } = useMutationHandler({
    mutationHook: useRequestRecovery,
    payloadBuilder: (formData) => {
      const email = formData?.get("email");
      if (typeof email !== "string" || email.length === 0) {
        throw new Error("Email is required to request a recovery");
      }
      emailRef.current = email;
      return { email };
    },
    resultHandlers: {
      onSuccess,
      onError: (err) => {
        showError(`Cannot succeed recovery request: ${err?.message}`);
      },
    },
  });

  return { handleSubmit: submit, error, isPending };
};

export { useHandleRecoveryRequest };
