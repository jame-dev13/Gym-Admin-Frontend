import { createContext } from "react";
import type { ToastType } from "@/types/Types";

export const TOAST_DURATION_MS = 5000;

export interface ToastContextValue {
  message: string;
  type: ToastType;
  isShowing: boolean;
  show: (message: string, type?: ToastType) => void;
  hide: () => void;
  pause: () => void;
  resume: () => void;
}

export const ToastContext = createContext<ToastContextValue | null>(null);
