import { api } from "@/services/api";
import type { ApiErrorResponse, FetchResponse, Page } from "@/types/Types";
import {
  keepPreviousData,
  useQuery,
  type UndefinedInitialDataOptions,
} from "@tanstack/react-query";

type FetchMappingParams<T> = {
  uri: string;
  params?: Record<string, unknown>;
  queryKey: ReadonlyArray<unknown>;
  options?: Omit<UndefinedInitialDataOptions<FetchResponse<T>, ApiErrorResponse>, "queryKey">;
};

export function useFetchMapping<T>(paramArgs: FetchMappingParams<T>) {
  const { uri, queryKey, params, options } = paramArgs;
  return useQuery<FetchResponse<T>, ApiErrorResponse>(
    {
      queryKey: [...queryKey],
      queryFn: async () => {
        const { data, status } = await api.get<T>(uri, { ...params });
        return { data, status };
      },
      placeholderData: keepPreviousData,
      staleTime: 1000 * 60 * 3,
      ...options,
    },
  );
}

export function usePageFetchMapping<T, R = T>({
  uri,
  params,
  queryKey,
  select,
}: Omit<FetchMappingParams<T>, "options"> & {
  select?: (data: Page<T>) => Page<R>;
}) {
  return useQuery<Page<T>, ApiErrorResponse, Page<R>>(
    {
      queryKey: [...queryKey, { ...params }],
      queryFn: async () => {
        const { data } = await api.get<Page<T>>(uri, {
          params,
        });
        return { ...data };
      },
      select,
      placeholderData: keepPreviousData,
      staleTime: 1000 * 60 * 5,
    },
  );
}