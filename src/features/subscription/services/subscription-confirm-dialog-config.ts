import type { ConfirmDialogVariantConfig } from "@/components/confirm-dialog/ConfirmDialogTypes";
import type { CurrentSubscriptionConfirmVariant } from "@/features/subscription/types";
import { CheckCircle2, RotateCcw, Sparkles, Trash2 } from "lucide-react";

const currentSubscriptionConfirmDialogConfig: Record<
  CurrentSubscriptionConfirmVariant,
  ConfirmDialogVariantConfig
> = {
  create: {
    title: "Start a membership",
    description:
      "You will be redirected to the payment page to complete the checkout.",
    confirmLabel: "Continue to payment",
    pendingLabel: "Starting…",
    tone: "default",
    Icon: Sparkles,
  },
  renew: {
    title: "Renew membership",
    description:
      "You will be redirected to the payment page to complete the renewal.",
    confirmLabel: "Continue to payment",
    pendingLabel: "Renewing…",
    tone: "default",
    Icon: RotateCcw,
  },
  finalize: {
    title: "Finalize membership",
    description:
      "Finalizing closes the current subscription period and cannot be reverted.",
    confirmLabel: "Finalize membership",
    pendingLabel: "Finalizing…",
    tone: "default",
    Icon: CheckCircle2,
  },
  delete: {
    title: "Delete membership",
    description:
      "The subscription is removed from your account. This action cannot be undone.",
    confirmLabel: "Delete membership",
    pendingLabel: "Deleting…",
    tone: "destructive",
    Icon: Trash2,
  },
};

export const getCurrentSubscriptionConfirmDialogConfig = () =>
  currentSubscriptionConfirmDialogConfig;
