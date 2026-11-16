import type { ReactNode } from "react";
import type { NavbarLink, NavbarPosition } from "@/types/SharedTypes";

export interface NavbarProps {
  links: NavbarLink[];
  brand?: ReactNode;
  actions?: ReactNode;
  position?: NavbarPosition;
  /** Highlights the anchor link matching this href, for in-page navigation. */
  activeHref?: string;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  "aria-label"?: string;
  className?: string;
}