import type { ReactNode } from "react";

export type ModalSize = "sm" | "md" | "lg";

export interface ModalProps {
  title: string;
  children: ReactNode;
  size?: ModalSize;
}