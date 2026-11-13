import { getCurrentQueryKeys } from "@/features/current/services/current-query-keys";
import type {
  CurrentOverviewResponse,
  CurrentUserResponse,
} from "@/features/current/types";
import { useFetchMapping } from "@/hooks/useClientFetcher";

const BASE = `${import.meta.env.VITE_APP_BASE}/current`;

const { overview, info } = getCurrentQueryKeys();

export const useFetchCurrentOverviewInfo = (auth?: boolean) =>
  useFetchMapping<CurrentOverviewResponse>({
    uri: BASE,
    queryKey: [...overview()],
    options: { enabled: !!auth },
  });

export const useFetchCurrentUserInfo = (auth?: boolean) =>
  useFetchMapping<CurrentUserResponse>({
    uri: `${BASE}/user`,
    queryKey: [...info()],
    options: { enabled: !!auth },
  });
