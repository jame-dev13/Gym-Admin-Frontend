import { createContext } from "react";
import type { DrawerPosition, DrawerSize } from "@/types/Types";

export interface OpenDrawerOptions {
  title: string;
  description?: string;
  position?: DrawerPosition;
  size?: DrawerSize;
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
}

export interface DrawerContextValue {
  isOpen: boolean;
  title: string;
  description?: string;
  position: DrawerPosition;
  size: DrawerSize;
  showCloseButton: boolean;
  closeOnOverlayClick: boolean;
  openDrawer: (options: OpenDrawerOptions) => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
}

export const DrawerContext = createContext<DrawerContextValue | null>(null);
