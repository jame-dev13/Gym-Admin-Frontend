import { api } from "@/services/api";
import { getQueryAppClient } from "@/services/query-client";
import type { ApiErrorResponse, MutationResponse } from "@/types/Types";
import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";

export type MakeMutationArgs<T, R> = {
  uri: string;
  method: "post" | "put" | "patch" | "delete";
  body?: T;
  invalidateKey: ReadonlyArray<unknown>;
  options?: UseMutationOptions<MutationResponse<R>, ApiErrorResponse, T>;
};

export type ConcreteMutationArgs<T, R> = Omit<
  MakeMutationArgs<T, R>,
  "method" | "body"
>;

const QUERY_CLIENT = getQueryAppClient();

export const useMutationMapping = <T, R>({
  uri,
  method,
  invalidateKey,
  options,
}: Omit<MakeMutationArgs<T, R>, "body">) => {
  const qc = useQueryClient(QUERY_CLIENT);
  return useMutation<MutationResponse<R>, ApiErrorResponse, T>(
    {
      mutationFn: async (body?: T) => {
        const { data, status } = await api.request<R>({
          method,
          url: uri,
          data: body,
        });
        return { payload: data, status };
      },
      ...options,
      onSettled: (data, error, vars, _, context) => {
        const outerSettled = () =>
          options?.onSettled?.(data, error, vars, _, context);

        const invalidateAll = context.meta?.clearAll ?? false;
        if (!error && invalidateAll) {
          qc.invalidateQueries();
          outerSettled();
          return;
        }

        const invalidateAudit = context.meta?.clearAudit ?? false;
        if (!error && invalidateAudit) {
          qc.invalidateQueries({
            predicate: (query) => query.queryKey.includes("audit"),
          });
          outerSettled();
          return;
        }

        if (!error && invalidateKey) {
          qc.invalidateQueries({ queryKey: invalidateKey, exact: false });
        }

        outerSettled();
      },
    },
    QUERY_CLIENT,
  );
};
