import type { RegisterRequest } from "@/features/auth/types";
import { useMutationMapping } from "@/hooks/useClientMutator";

const URI: string = import.meta.env.VITE_REGISTER;

const useRegister = () =>
  useMutationMapping<RegisterRequest, void>({
    method: "post",
    uri: URI,
  });

export { useRegister };
