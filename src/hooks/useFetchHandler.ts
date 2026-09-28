import type {
  ApiErrorResponse,
  FetchResponse,
  Identifiable,
  Page,
} from "@/types/Types";
import type { UseQueryResult } from "@tanstack/react-query";
import { useCallback, useEffect } from "react";

type ResultHandlers<D> = Partial<{
  onSuccess: (data?: D) => void;
  onError: (error?: ApiErrorResponse) => void;
  onSettled: (data?: D, error?: ApiErrorResponse) => void;
}>;

type QueryLifecycleArgs<D> = {
  data: D | undefined;
  error: ApiErrorResponse | null;
  isPending: boolean;
  isRefetching: boolean;
  isSuccess: boolean;
  abortExpression?: boolean;
  resultHandlers?: ResultHandlers<D>;
};

function useQueryLifecycle<D>({
  data,
  error,
  isPending,
  isRefetching,
  isSuccess,
  abortExpression,
  resultHandlers = {},
}: QueryLifecycleArgs<D>) {
  const { onSuccess, onError, onSettled } = resultHandlers;

  useEffect(() => {
    if (isPending || isRefetching || abortExpression) return;
    if (error) {
      onError?.(error);
    } else if (isSuccess) {
      onSuccess?.(data);
    }
    onSettled?.(data, error ?? undefined);
  }, [
    abortExpression,
    data,
    error,
    isPending,
    isRefetching,
    isSuccess,
    onError,
    onSettled,
    onSuccess,
  ]);
}

type SafeRefetchArgs = {
  refetch: () => Promise<unknown>;
  isPending: boolean;
  isRefetching: boolean;
};

function useSafeRefetch({ refetch, isPending, isRefetching }: SafeRefetchArgs) {
  return useCallback(async () => {
    if (isPending || isRefetching) return;
    try {
      await refetch();
    } catch (error) {
      console.error("Something went wrong", error);
    }
  }, [refetch, isPending, isRefetching]);
}

type useFetchConfig<T> = {
  fetchHook: (
    id?: Identifiable,
  ) => UseQueryResult<FetchResponse<T>, ApiErrorResponse>;
  resultHandlers?: ResultHandlers<FetchResponse<T>>;
  abortExpression?: boolean;
};

function useFetchHandler<T>({
  fetchHook,
  abortExpression,
  resultHandlers = {},
}: useFetchConfig<T>) {
  const { data, error, isPending, refetch, isRefetching, isSuccess } =
    fetchHook();

  useQueryLifecycle({
    data,
    error,
    isPending,
    isRefetching,
    isSuccess,
    abortExpression,
    resultHandlers,
  });

  const performRefetch = useSafeRefetch({ refetch, isPending, isRefetching });

  return {
    fetch: {
      payload: data?.data,
      isPending,
    },
    refetch: {
      performRefetch,
      isRefetching,
    },
    error,
  };
}

type usePageFetchConfig<T> = {
  pageFetchHook: () => UseQueryResult<Page<T>, ApiErrorResponse>;
  resultHandlers?: ResultHandlers<Page<T>>;
  abortExpression?: boolean;
};

function usePageFetchHandler<T>({
  pageFetchHook,
  abortExpression,
  resultHandlers = {},
}: usePageFetchConfig<T>) {
  const { data, error, isPending, refetch, isRefetching, isSuccess } =
    pageFetchHook();

  useQueryLifecycle({
    data,
    error,
    isPending,
    isRefetching,
    isSuccess,
    abortExpression,
    resultHandlers,
  });

  const performRefetch = useSafeRefetch({ refetch, isPending, isRefetching });

  return {
    page: {
      content: data?.content,
      pageInfo: data?.page,
      isPending,
    },
    refetch: {
      performRefetch,
      isRefetching,
    },
    error,
  };
}

export { useFetchHandler, usePageFetchHandler };
