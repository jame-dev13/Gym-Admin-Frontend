import type { ReactNode } from "react";
import { createContext } from "react";
import type { DrawerPosition, DrawerSize } from "@/types/Types";

/**
 * The drawer currently open.
 */
export type ActiveDrawer = {
  /** Drawer heading. */
  title: string;
  /** Optional supporting text below the heading. */
  description?: string;
  /** Edge the drawer is docked to. */
  position: DrawerPosition;
  /** Drawer dimensions. */
  size: DrawerSize;
  /** Whether the header renders its close button. */
  showCloseButton: boolean;
  /** Whether clicking the overlay closes the drawer. */
  closeOnOverlayClick: boolean;
  /** Renders the drawer body, already bound to the data captured on open. */
  content: () => ReactNode;
};

/**
 * Everything a trigger needs to open a drawer.
 *
 * Generic so each usage keeps the type of the data it shows without casts:
 * `data` and `render` are bound together when the drawer opens.
 */
export type OpenDrawerOptions<T> = {
  /** Drawer heading. */
  title: string;
  /** Optional supporting text below the heading. */
  description?: string;
  /** Edge the drawer is docked to. */
  position?: DrawerPosition;
  /** Drawer dimensions. */
  size?: DrawerSize;
  /** Whether the header renders its close button. */
  showCloseButton?: boolean;
  /** Whether clicking the overlay closes the drawer. */
  closeOnOverlayClick?: boolean;
  /** Row or entity data the drawer describes. */
  data: T;
  /** Renders the drawer body for the given data. */
  render: (data: T) => ReactNode;
};

export interface DrawerContextValue {
  /** Whether a drawer is currently open. */
  isOpen: boolean;
  /** The open drawer, or `null` when none is. */
  activeDrawer: ActiveDrawer | null;
  /** Opens a drawer, replacing any currently open one. */
  openDrawer: <T>(options: OpenDrawerOptions<T>) => void;
  /** Closes the currently open drawer. */
  closeDrawer: () => void;
}

export const DrawerContext = createContext<DrawerContextValue | null>(null);
