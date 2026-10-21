import type { ReactNode } from "react";

export type ModalSize = "sm" | "md" | "lg";

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: ModalSize;
  description?: string;
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
}
