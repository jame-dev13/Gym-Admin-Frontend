import {
  usePasswordResetRequest,
  useResetPassword,
} from "@/features/auth/hooks/usePasswordReset";
import { useMutationHandler } from "@/hooks/useMutationHandler";
import { useToastFactory } from "@/hooks/useToastFactory";
import { useNavigate } from "react-router-dom";

const LOGIN_ROUTE = "/auth/login";

const useHandlePasswordResetRequest = (
  emailRef: { current: string },
  onSent: () => void,
) => {
  const { showError } = useToastFactory();
  const { submit, error, isPending } = useMutationHandler({
    mutationHook: usePasswordResetRequest,
    payloadBuilder: (formData) => {
      const email = formData?.get("email");
      if (typeof email !== "string" || email.length === 0) {
        throw new Error("Email is required to request a password reset");
      }
      emailRef.current = email;
      return { email };
    },
    resultHandlers: {
      onSuccess: onSent,
      onError: (err) => {
        showError(`Cannot succeed password reset request: ${err?.message}`);
      },
    },
  });

  return { handleSubmit: submit, error, isPending };
};

const useHandleResetPassword = () => {
  const { showError } = useToastFactory();
  const navigate = useNavigate();
  const { submit, error, isPending } = useMutationHandler({
    mutationHook: useResetPassword,
    payloadBuilder: (formData) => {
      const email = formData?.get("email");
      if (typeof email !== "string" || email.length === 0) {
        throw new Error("Email is required to reset the password");
      }
      const password = formData?.get("password");
      if (
        typeof password !== "string" ||
        password.length === 0 ||
        password !== formData?.get("confirmPassword")
      ) {
        throw new Error("Passwords do not match");
      }
      return { email, newPassword: password };
    },
    resultHandlers: {
      onSuccess: () => {
        navigate(LOGIN_ROUTE, { replace: true });
      },
      onError: (err) => {
        showError(`Cannot succeed password reset: ${err?.message}`);
      },
    },
  });

  return { handleSubmit: submit, error, isPending };
};

export { useHandlePasswordResetRequest, useHandleResetPassword };
