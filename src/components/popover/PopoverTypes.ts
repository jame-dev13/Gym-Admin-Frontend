import type { ReactNode } from "react";

export type PopoverPlacement = "below" | "above";

export type PopoverCoordinates = {
  top: number;
  left: number;
  placement: PopoverPlacement;
};

export interface PopoverProps {
  anchor: HTMLElement;
  children: ReactNode;
  onClose: () => void;
  label?: string;
  className?: string;
}

export interface PopoverLinkProps<T> {
  data: T;
  render: (data: T) => ReactNode;
  label: string;
  children: ReactNode;
  className?: string;
}
