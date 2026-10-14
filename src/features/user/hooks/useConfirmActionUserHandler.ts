import { useModalContext } from "@/context/useModalContext";
import { useSelectionContext } from "@/context/useSelectionContext";
import { useMutationHandler } from "@/hooks/useMutationHandler";
import { useToastFactory } from "@/hooks/useToastFactory";
import type {
  ApiErrorResponse,
  Identifiable,
  MutationResponse,
} from "@/types/Types";
import type { UseMutationResult } from "@tanstack/react-query";
import { useCallback } from "react";

type UseConfirmActionUserArgs = {
  hook: (
    id: Identifiable,
  ) => UseMutationResult<
    MutationResponse<void>,
    ApiErrorResponse,
    undefined,
    unknown
  >;
  variant: "recover" | "delete" | "hard-delete";
};

const resolveVariantSentence = (
  variant: UseConfirmActionUserArgs["variant"],
) => {
  switch (variant) {
    case "delete":
      return "deleted";
    case "hard-delete":                 
      return "completely erased";
    case "recover":
      return "recovered.";
  }
};

export const useConfirmActionUserHandler = ({
  hook,
  variant,
}: UseConfirmActionUserArgs) => {
  const { currentSelection: id, clearSelection } = useSelectionContext();
  const { closeModal } = useModalContext();
  const { showSuccess, showError, showInfo } = useToastFactory();
  const sentence = resolveVariantSentence(variant);
  if (!id || !id.id) {
    throw new Error("Id is required.");
  }

  const hookRef = hook(id);

  const { error, isPending, submit } = useMutationHandler({
    id: id,
    mutationHook: () => hookRef,
    resultHandlers: {
      onSuccess: () => showSuccess(`User ${sentence} with success.`),
      onError: (err) =>
        showError(`Cannot perform ${variant} operation: ${err?.message}`),
      onSettled: () => {
        clearSelection();
        closeModal();
      },
    },
  });

  const handleOnCancel = useCallback(() => {
    clearSelection();
    closeModal();
    showInfo("Operation cancelled.");
  }, [clearSelection, closeModal, showInfo]);

  return { error, isPending, submit, handleOnCancel: handleOnCancel };
};
