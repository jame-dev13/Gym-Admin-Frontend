import type { LoginRequest, LoginResponse } from "@/features/auth/types";
import { useMutationMapping } from "@/hooks/useClientMutator";

const URI: string = import.meta.env.VITE_LOGIN;

const useLogin = () =>
  useMutationMapping<LoginRequest, LoginResponse>({
    method: "post",
    uri: URI,
  });

export { useLogin };
