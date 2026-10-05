import type {
  RecoveryEmailRequest,
  RecoveryRequest,
} from "@/features/auth/types";
import { useMutationMapping } from "@/hooks/useClientMutator";

const URI: string = import.meta.env.VITE_RECOVERY;

const useRecover = () =>
  useMutationMapping<RecoveryRequest, void>({
    method: "post",
    uri: `${URI}/activate`,
  });

const useRequestRecovery = () =>
  useMutationMapping<RecoveryEmailRequest, void>({
    method: "post",
    uri: `${URI}/recover`,
  });

export { useRecover, useRequestRecovery };
