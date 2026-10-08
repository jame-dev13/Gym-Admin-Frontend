import type { ReactNode } from "react";
import type { SidebarSection } from "@/types/SharedTypes";

export interface SidebarProps {
  sections: SidebarSection[];
  brand: ReactNode;
  collapsedBrand?: ReactNode;
  footer?: ReactNode;
  defaultCollapsed?: boolean;
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  "aria-label"?: string;
  className?: string;
}