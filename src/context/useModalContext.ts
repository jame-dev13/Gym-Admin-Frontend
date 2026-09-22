import { useContext } from "react";
import { ModalContext } from "./ModalContext";
import type { ModalContextValue } from "./ModalContext";

export const useModalContext = (): ModalContextValue => {
  const context = useContext(ModalContext);

  if (!context) {
    throw new Error("useModalContext must be used within a ModalProvider");
  }

  return context;
};
