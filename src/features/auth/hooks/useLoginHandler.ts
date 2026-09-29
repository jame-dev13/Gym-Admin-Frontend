import { useLogin } from "@/features/auth/hooks/useLogin";
import { useAppNavigation } from "@/hooks/useAppNavigation";
import { useMutationHandler } from "@/hooks/useMutationHandler";
import { useToastFactory } from "@/hooks/useToastFactory";

const useHandleLogin = () => {
  const { showError } = useToastFactory();
  const { nav } = useAppNavigation("/home");
  const { submit, error, isPending } = useMutationHandler({
    mutationHook: useLogin,
    payloadBuilder: (formData) => ({
      email: String(formData?.get("email")),
      password: String(formData?.get("password")),
    }),
    resultHandlers: {
      onSuccess: nav,
      onError: (err) => {
        showError(`Cannot succeed login operation: ${err?.message}`);
      },
    },
  });

  return { handleSubmit: submit, error, isPending };
};

export { useHandleLogin };
