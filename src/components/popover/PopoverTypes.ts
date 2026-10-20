import type { ReactNode } from "react";

export type PopoverPlacement = "below" | "above";

export type PopoverCoordinates = {
  top: number;
  left: number;
  placement: PopoverPlacement;
};

export type PopoverLinkColor = "cyan" | "blue" | "red" | "slate";

export type PopoverLinkLook = "link" | "pill" | "commandBtn";

export interface PopoverProps {
  anchor: HTMLElement;
  children: ReactNode;
  onClose: () => void;
  label?: string;
  className?: string;
}

type PopoverLinkBaseProps<T> = {
  data: T;
  render: (data: T) => ReactNode;
  /**
   * Names the popover dialog. It is also used as the accessible name when a
   * command button renders without a visible label.
   */
  label: string;
  color?: PopoverLinkColor;
  className?: string;
};

export type PopoverLinkProps<T> = PopoverLinkBaseProps<T> &
  (
    | {
        look?: "link" | "pill";
        children: ReactNode;
        icon?: ReactNode;
      }
    | {
        look: "commandBtn";
        icon: ReactNode;
        children?: ReactNode;
      }
  );
