import { createContext } from "react";

export interface ModalContextValue {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

export const ModalContext = createContext<ModalContextValue | null>(null);
