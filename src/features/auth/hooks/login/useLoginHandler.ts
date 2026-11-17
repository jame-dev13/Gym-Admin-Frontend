import type { LoginUserType } from "@/features/auth/types";
import { useLogin } from "./useLogin";
import { useMutationHandler } from "@/hooks/useMutationHandler";
import { useToastFactory } from "@/hooks/useToastFactory";
import { useNavigate } from "react-router-dom";

const SUCCESS_PATHS: Record<LoginUserType, string> = {
  ADMINISTRATIVE: "/administration",
  CUSTOMER: "/home",
  USER: "/welcome",
};

const NOT_FOUND_PATH = "/404";

const useHandleLogin = () => {
  const { showError } = useToastFactory();
  const navigate = useNavigate();
  const { submit, error, isPending } = useMutationHandler({
    mutationHook: useLogin,
    payloadBuilder: (formData) => ({
      email: String(formData?.get("email")),
      password: String(formData?.get("password")),
    }),
    resultHandlers: {
      onSuccess: (data) => {
        if (!data)
          throw new Error(
            "Something went wrong: Login response data is required.",
          );
        const pathTo = SUCCESS_PATHS[data?.userType] || NOT_FOUND_PATH;
        void navigate(pathTo, { replace: true });
      },
      onError: (err) =>
        showError(`Cannot succeed login operation: ${err?.message}`),
    },
  });

  return { handleSubmit: submit, error, isPending };
};

export { useHandleLogin };
