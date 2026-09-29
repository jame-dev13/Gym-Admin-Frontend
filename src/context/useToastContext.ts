import { useContext } from "react";
import { ToastContext } from "./ToastContext";
import type { ToastContextValue } from "./ToastContext";

export const useToastContext = (): ToastContextValue => {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToastContext must be used within a ToastProvider");
  }

  return context;
};
