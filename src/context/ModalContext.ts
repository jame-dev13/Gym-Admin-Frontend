import { createContext } from "react";
import type { ModalSize } from "@/components/modal/ModalTypes";

export interface OpenModalOptions {
  title: string;
  description?: string;
  size?: ModalSize;
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
}

export interface ModalContextValue {
  isOpen: boolean;
  title: string;
  description?: string;
  size: ModalSize;
  showCloseButton: boolean;
  closeOnOverlayClick: boolean;
  openModal: (options: OpenModalOptions) => void;
  closeModal: () => void;
}

export const ModalContext = createContext<ModalContextValue | null>(null);