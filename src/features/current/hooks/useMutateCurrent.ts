import { getCurrentQueryKeys } from "@/features/current/services/current-query-keys";
import type { CurrentUserUpdateRequest } from "@/features/current/types";
import { useMutationMapping } from "@/hooks/useClientMutator";

const BASE = `${import.meta.env.VITE_APP_BASE}/current`;

const { all: invalidateKey } = getCurrentQueryKeys();

export const useUpdateCurrentUser = () =>
  useMutationMapping<CurrentUserUpdateRequest, void>({
    method: "patch",
    uri: `${BASE}/user`,
    invalidateKey: [...invalidateKey()],
  });
