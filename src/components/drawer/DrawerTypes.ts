import type { ReactNode } from "react";
import type { DrawerPosition, DrawerSize } from "@/types/SharedTypes";

export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  position?: DrawerPosition;
  size?: DrawerSize;
  description?: string;
  headerActions?: ReactNode;
  footer?: ReactNode;
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  "aria-label"?: string;
  className?: string;
}