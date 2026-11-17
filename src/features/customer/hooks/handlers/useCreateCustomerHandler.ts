import { useDrawerContext } from "@/context/useDrawerContext";
import { useModalContext } from "@/context/useModalContext";
import { useCreateCurrentCustomer } from "@/features/customer/hooks/api/useMutateCurrentCustomer";
import { useCreateCustomer } from "@/features/customer/hooks/api/useMutateCustomer";
import { useMutationHandler } from "@/hooks/useMutationHandler";
import { useToastFactory } from "@/hooks/useToastFactory";
import type { ApiErrorResponse } from "@/types/Types";
import { HttpStatusCode } from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CODE = "VALIDATION_OPERATION";
const CONFLICT = HttpStatusCode.Conflict;
const ON_CURRENT_SUCCESS_PATH = "/home";

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
  const navigate = useNavigate();
  return useMutationHandler({
    mutationHook: useCreateCurrentCustomer,
    resultHandlers: {
      onSuccess: () => {
        closeModal();
        void navigate(ON_CURRENT_SUCCESS_PATH, { replace: true });
        showSuccess("Welcome to your personal dashboard!");
      },
      onError: (err) => showError(`Cannot create customer: ${err?.message}`),
    },
  });
};
