import { AlertTriangle, RotateCcw, Trash2 } from "lucide-react";
import type { ConfirmDialogVariantConfig } from "@/components/confirm-dialog/ConfirmDialogTypes";
import type { UserConfirmVariant } from "@/features/user/types";

const userConfirmDialogConfig: Record<
  UserConfirmVariant,
  ConfirmDialogVariantConfig
> = {
  recover: {
    title: "Recover user",
    description:
      "The user will regain access to the application depending on his own role.",
    confirmLabel: "Recover user",
    pendingLabel: "Recovering…",
    tone: "default",
    Icon: RotateCcw,
  },
  delete: {
    title: "Delete user",
    description:
      "The user will lose access immediately. You can recover this user later.",
    confirmLabel: "Delete user",
    pendingLabel: "Deleting…",
    tone: "destructive",
    Icon: Trash2,
  },
  "hard-delete": {
    title: "Permanently delete user",
    description:
      "The user will be permanently removed. This action cannot be undone.",
    confirmLabel: "Delete permanently",
    pendingLabel: "Deleting…",
    tone: "destructive",
    Icon: AlertTriangle,
  },
};

export const getUserConfirmDialogConfig = () => userConfirmDialogConfig;
