import type { LucideIcon } from "lucide-react";
import type React from "react";

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
  error?: string | null;
  onConfirmSubmit: (e: React.SubmitEvent<HTMLFormElement>) => void;
  onCancel?: () => void;
  confirmAriaLabel?: string;
  cancelLabel?: string;
}
