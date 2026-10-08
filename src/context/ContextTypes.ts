import type { ReactNode } from "react";
import type { ModalSize } from "@/components/modal/ModalTypes";
import type { DrawerProps } from "@/components/drawer/DrawerTypes";
import type { ToastType } from "@/types/Types";

export interface ThemeProviderProps {
  children: ReactNode;
}

export interface ToastProviderProps {
  children: ReactNode;
}

export interface ModalProviderProps {
  children: ReactNode;
}

export interface DrawerProviderProps {
  children: ReactNode;
}

export interface EntityDomainProviderProps {
  children: ReactNode;
}

export interface ModalContextValue {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  modalProps: {
    title: string;
    children: ReactNode;
    size?: ModalSize;
  } | null;
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

export interface DrawerContextValue {
  isOpen: boolean;
  openDrawer: (props: DrawerProps) => void;
  closeDrawer: () => void;
}