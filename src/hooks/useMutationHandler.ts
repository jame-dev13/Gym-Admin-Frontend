import type {
  ApiErrorResponse,
  Identifiable,
  MutationResponse,
} from "@/types/Types";
import type { UseMutationResult } from "@tanstack/react-query";
import React, { useCallback } from "react";

type useMutationConfig<T = undefined, R = unknown> = {
  mutationHook: (
    id?: Identifiable,
  ) => UseMutationResult<
    MutationResponse<R>,
    ApiErrorResponse,
    T | undefined,
    unknown
  >;
  id?: Identifiable;
  /**
   * Builds the mutation body from the submitted form. Omit it for bodiless
   * mutations (e.g. body-less PATCH / DELETE): `mutate(undefined)` is sent.
   */
  payloadBuilder?: (formData?: FormData) => T;
  resultHandlers?: Partial<{
    onSuccess: (data?: R) => void;
    onError: (error?: ApiErrorResponse) => void;
    onSettled: (data?: R, error?: ApiErrorResponse) => void;
  }>;
};

function useMutationHandler<T = undefined, R = unknown>({
  mutationHook,
  id,
  payloadBuilder,
  resultHandlers,
}: useMutationConfig<T, R>) {
  const { onSuccess, onError, onSettled } = resultHandlers ?? {};
  const { mutate, error, isPending } = mutationHook(id);

  const submit = useCallback(
    (e: React.SubmitEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (isPending) return;
      const form = e.currentTarget;
      const payload = payloadBuilder?.(new FormData(form));
      mutate(payload, {
        onSuccess: ({ payload }) => {
          form.reset();
          onSuccess?.(payload);
        },
        onError: (error) => onError?.(error),
        onSettled: (response, err) => {
          onSettled?.(response?.payload, err ?? undefined);
        },
      });
    },
    [isPending, mutate, payloadBuilder, onSuccess, onError, onSettled],
  );

  return { submit, error, isPending };
}

export { useMutationHandler };
