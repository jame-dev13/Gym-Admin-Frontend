import type { VerificationRequest } from "@/features/auth/types";
import { useMutationMapping } from "@/hooks/useClientMutator";

const URI: string = import.meta.env.VITE_VERIFICATION;

const useVerify = () =>
  useMutationMapping<VerificationRequest, void>({
    method: "patch",
    uri: URI,
  });

const useResendVerificationToken = (email: string) =>
  useMutationMapping<undefined, void>({
    method: "patch",
    uri: `${URI}/${email}/token`,
  });

export { useVerify, useResendVerificationToken };
