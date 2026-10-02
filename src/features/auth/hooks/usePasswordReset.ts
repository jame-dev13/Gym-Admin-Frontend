import type {
  PasswordResetRequest,
  ResetPasswordRequest,
} from "@/features/auth/types";
import { useMutationMapping } from "@/hooks/useClientMutator";

const URI: string = import.meta.env.VITE_PASSWORD_RESET;

const usePasswordResetRequest = () =>
  useMutationMapping<PasswordResetRequest, void>({
    method: "post",
    uri: `${URI}/request-reset`,
  });

const useResetPassword = () =>
  useMutationMapping<ResetPasswordRequest, void>({
    method: "post",
    uri: `${URI}/set-password`,
  });

export { usePasswordResetRequest, useResetPassword };
