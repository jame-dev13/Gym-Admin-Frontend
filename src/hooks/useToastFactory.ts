import { useMemo } from "react";
import { useToastContext } from "@/context/useToastContext";
import type { ToastFactory } from "@/types/Types";

export const useToastFactory = (): ToastFactory => {
  const { show } = useToastContext();

  return useMemo<ToastFactory>(
    () => ({
      showSuccess: (message) => show(message, "success"),
      showError: (message) => show(message, "error"),
      showWarning: (message) => show(message, "warning"),
      showInfo: (message) => show(message, "info"),
      showDefault: (message) => show(message, "default"),
    }),
    [show],
  );
};
