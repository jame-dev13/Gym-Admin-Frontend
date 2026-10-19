import type { ReactNode } from "react";
import { createContext } from "react";

/**
 * The popover currently anchored to a trigger.
 */
export type ActivePopover = {
  /** Live DOM node the panel is anchored to and returns focus to on close. */
  anchor: HTMLElement;
  /** Optional accessible name for the panel. */
  label?: string;
  /** Renders the panel body, already bound to the data captured on open. */
  content: () => ReactNode;
};

/**
 * Everything a trigger needs to register a popover.
 *
 * Generic so each usage keeps the type of the data it shows without casts:
 * `data` and `render` are bound together when the popover opens.
 */
export type OpenPopoverOptions<T> = {
  /** Live DOM node the panel is anchored to. */
  anchor: HTMLElement;
  /** Row or cell data the popover describes. */
  data: T;
  /** Renders the panel body for the given data. */
  render: (data: T) => ReactNode;
  /** Optional accessible name for the panel. */
  label?: string;
};

export type PopoverContextValue = {
  /** Whether a popover is currently open. */
  isOpen: boolean;
  /** The open popover, or `null` when none is. */
  activePopover: ActivePopover | null;
  /** Opens a popover, replacing any currently open one. */
  openPopover: <T>(options: OpenPopoverOptions<T>) => void;
  /** Closes the currently open popover. */
  closePopover: () => void;
  /** Closes the popover anchored to `options.anchor`, otherwise opens it. */
  togglePopover: <T>(options: OpenPopoverOptions<T>) => void;
};

export const PopoverContext = createContext<PopoverContextValue | null>(null);
