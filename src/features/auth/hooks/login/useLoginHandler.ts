import { useLogin } from "./useLogin";
import { useMutationHandler } from "@/hooks/useMutationHandler";
import { useToastFactory } from "@/hooks/useToastFactory";
import { useNavigate } from "react-router-dom";

const useHandleLogin = () => {
  const { showError } = useToastFactory();
  const navigate = useNavigate()
  const { submit, error, isPending } = useMutationHandler({
    mutationHook: useLogin,
    payloadBuilder: (formData) => ({
      email: String(formData?.get("email")),
      password: String(formData?.get("password")),
    }),
    resultHandlers: {
      onSuccess: (data) => {
        const isAdministrative = !data?.isUser;
        void navigate(isAdministrative ? "/administration": "/home", { replace: true  })
      },
      onError: (err) => {
        showError(`Cannot succeed login operation: ${err?.message}`);
      },
    },
  });

  return { handleSubmit: submit, error, isPending };
};

export { useHandleLogin };
