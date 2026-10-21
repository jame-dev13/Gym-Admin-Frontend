import type { ReactNode } from "react";
import { createContext } from "react";
import type { ModalSize } from "@/components/modal/ModalTypes";

/**
 * The modal currently open.
 */
export type ActiveModal = {
  /** Modal heading. */
  title: string;
  /** Optional supporting text below the heading. */
  description?: string;
  /** Modal width. */
  size: ModalSize;
  /** Whether the header renders its close button. */
  showCloseButton: boolean;
  /** Whether clicking the overlay closes the modal. */
  closeOnOverlayClick: boolean;
  /** Renders the modal body, already bound to the data captured on open. */
  content: () => ReactNode;
};

/**
 * Everything a trigger needs to open a modal.
 *
 * Generic so each usage keeps the type of the data it shows without casts:
 * `data` and `render` are bound together when the modal opens.
 */
export type OpenModalOptions<T> = {
  /** Modal heading. */
  title: string;
  /** Optional supporting text below the heading. */
  description?: string;
  /** Modal width. */
  size?: ModalSize;
  /** Whether the header renders its close button. */
  showCloseButton?: boolean;
  /** Whether clicking the overlay closes the modal. */
  closeOnOverlayClick?: boolean;
  /** Row or entity data the modal describes. */
  data: T;
  /** Renders the modal body for the given data. */
  render: (data: T) => ReactNode;
};

export interface ModalContextValue {
  /** Whether a modal is currently open. */
  isOpen: boolean;
  /** The open modal, or `null` when none is. */
  activeModal: ActiveModal | null;
  /** Opens a modal, replacing any currently open one. */
  openModal: <T>(options: OpenModalOptions<T>) => void;
  /** Closes the currently open modal. */
  closeModal: () => void;
}

export const ModalContext = createContext<ModalContextValue | null>(null);
