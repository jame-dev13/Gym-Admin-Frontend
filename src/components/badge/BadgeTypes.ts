import type { ReactNode } from "react";

export type BadgeVariant =
  | "accent"
  | "indigo"
  | "slate"
  | "rose"
  | "blue"
  | "emerald"
  | "amber"
  | "purple";

export type BadgeLeading = "dot" | "initial" | "none";

export interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  leading?: BadgeLeading;
  mono?: boolean;
  title?: string;
  className?: string;
}
