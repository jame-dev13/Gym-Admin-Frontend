import { Component } from "lucide-react";
import type { ReactNode } from "react";

export type CardProps = Partial<{
  heading: string;
  Icon: typeof Component;
  className: string;
  children: ReactNode;
  footerText: string;
}>;
