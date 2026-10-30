import { useDrawerContext } from "@/context/useDrawerContext";
import { useModalContext } from "@/context/useModalContext";
import { useCreateCurrentCustomer } from "@/features/customer/hooks/api/useMutateCurrentCustomer";
import { useCreateCustomer } from "@/features/customer/hooks/api/useMutateCustomer";
import { useMutationHandler } from "@/hooks/useMutationHandler";
import { useToastFactory } from "@/hooks/useToastFactory";
import type { ApiErrorResponse } from "@/types/Types";
import { HttpStatusCode } from "axios";
import { useState } from "react";

const CODE = "VALIDATION_OPERATION";
const CONFLICT = HttpStatusCode.Conflict;

const isAlreadyExistsError = (err?: ApiErrorResponse) =>
  err?.code === CODE && err.status === CONFLICT;

export const useCreateCustomerHandler = () => {
  const [alreadyExists, setAlreadyExists] = useState(() => false);
  const { closeDrawer } = useDrawerContext();
  const { showError, showSuccess } = useToastFactory();
  const { error, isPending, submit } = useMutationHandler({
    mutationHook: useCreateCustomer,
    payloadBuilder: (fd) => ({ userId: Number(fd?.get("userId")) }),
    resultHandlers: {
      onSuccess: () => {
        showSuccess("Customer successfully created.");
        closeDrawer();
      },
      onError: (err) => {
        if (isAlreadyExistsError(err)) {
          setAlreadyExists(() => true);
          return;
        }
        showError(`Cannot create customer: ${err?.message}`);
      },
    },
  });

  return {
    isAlreadyExistsError: alreadyExists,
    error,
    isPending,
    submit,
  };
};

export const useCreateCurrentCustomerHandler = () => {
  const { closeModal } = useModalContext();
  const { showError, showSuccess } = useToastFactory();
  return  useMutationHandler({
    mutationHook: useCreateCurrentCustomer,
    resultHandlers: {
      onSuccess: () => {
        showSuccess("Customer successfully created.");
        closeModal();
      },
      onError: (err) => showError(`Cannot create customer: ${err?.message}`),
    },
  });
};
