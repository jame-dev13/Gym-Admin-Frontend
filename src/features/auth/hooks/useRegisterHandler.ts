import { useRegister } from "@/features/auth/hooks/useRegister";
import { useAppNavigation } from "@/hooks/useAppNavigation";
import { useMutationHandler } from "@/hooks/useMutationHandler";
import { useToastFactory } from "@/hooks/useToastFactory";

const useHandleRegister = () => {
  const { showError } = useToastFactory();
  const { nav } = useAppNavigation("/auth/verification");
  const { submit, error, isPending } = useMutationHandler({
    mutationHook: useRegister,
    payloadBuilder: (formData) => ({
      name: String(formData?.get("name")),
      email: String(formData?.get("email")),
      password: String(formData?.get("password")),
    }),
    resultHandlers: {
      onSuccess: nav,
      onError: (err) => {
        showError(`Cannot succeed register operation: ${err?.message}`);
      },
    },
  });

  return { handleSubmit: submit, error, isPending };
};

export { useHandleRegister };
