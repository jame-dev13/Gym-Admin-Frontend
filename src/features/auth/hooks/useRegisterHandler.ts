import { useRegister } from "@/features/auth/hooks/useRegister";
import { useMutationHandler } from "@/hooks/useMutationHandler";
import { useToastFactory } from "@/hooks/useToastFactory";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";

const useHandleRegister = () => {
  const { showError } = useToastFactory();
  const navigate = useNavigate();
  const emailRef = useRef<string>("");
  const { submit, error, isPending } = useMutationHandler({
    mutationHook: useRegister,
    payloadBuilder: (formData) => {
      emailRef.current = formData?.get("email") as string ?? "";
      return {
        name: String(formData?.get("name")),
        email: emailRef.current,
        password: String(formData?.get("password")),
      };
    },
    resultHandlers: {
      onSuccess: () => {
        navigate("/auth/verification", { state: { email: emailRef.current } });
      },
      onError: (err) => {
        showError(`Cannot succeed register operation: ${err?.message}`);
      },
    },
  });

  return { handleSubmit: submit, error, isPending, emailRef: emailRef };
};

export { useHandleRegister };
