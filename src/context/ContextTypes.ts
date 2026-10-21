import type { ReactNode } from "react";
import type { ToastType } from "@/types/Types";

export interface ThemeProviderProps {
  children: ReactNode;
}

export interface ToastProviderProps {
  children: ReactNode;
}

export interface EntityDomainProviderProps {
  children: ReactNode;
}

export interface ToastContextValue {
  isShowing: boolean;
  message: string;
  type: ToastType;
  show: (message: string, type: ToastType) => void;
  hide: () => void;
  pause: () => void;
  resume: () => void;
}
