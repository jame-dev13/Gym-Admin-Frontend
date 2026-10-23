import type { LucideIcon } from "lucide-react";
import type React from "react";
import type { ReactNode } from "react";

export type ConfirmDialogTone = "default" | "destructive";

export interface ConfirmDialogVariantConfig {
  title: string;
  description: string;
  confirmLabel: string;
  pendingLabel: string;
  tone?: ConfirmDialogTone;
  Icon?: LucideIcon;
}

export interface ConfirmDialogProps extends ConfirmDialogVariantConfig {
  isPending?: boolean;
  confirmDisabled?: boolean;
  error?: string | null;
  onConfirmSubmit: (e: React.SubmitEvent<HTMLFormElement>) => void;
  onCancel?: () => void;
  confirmAriaLabel?: string;
  cancelLabel?: string;
  children?: ReactNode;
}
