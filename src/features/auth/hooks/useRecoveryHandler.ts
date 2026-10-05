import { useRecover } from "@/features/auth/hooks/useRecovery";
import { useMutationHandler } from "@/hooks/useMutationHandler";
import { useToastFactory } from "@/hooks/useToastFactory";
import { useNavigate } from "react-router-dom";

const LOGIN_ROUTE = "/auth/login";

const useHandleRecover = () => {
  const { showError } = useToastFactory();
  const navigate = useNavigate();
  const { submit, error, isPending } = useMutationHandler({
    mutationHook: useRecover,
    payloadBuilder: (formData) => {
      const email = formData?.get("email");
      if (typeof email !== "string" || email.length === 0) {
        throw new Error("Email is required to recover the account");
      }
      const token = (formData?.getAll("token") ?? []).map(String).join("");
      if (token.length === 0) {
        throw new Error("Recovery token is required");
      }
      return { email, token };
    },
    resultHandlers: {
      onSuccess: () => {
        navigate(LOGIN_ROUTE, { replace: true });
      },
      onError: (err) => {
        showError(`Cannot succeed recovery operation: ${err?.message}`);
      },
    },
  });

  return { handleSubmit: submit, error, isPending };
};

export { useHandleRecover };
