import { lazy } from "react";
import type { ModalRegistryConfig } from "@/types/ModalRegistryTypes";
import type { OpenModalOptions } from "@/context/ModalContext";
import { getUserConfirmDialogConfig } from "@/features/user/services/user-confirm-dialog-config";

const CONFIRM_DIALOG_CONFIG = getUserConfirmDialogConfig();

const BASE_MODAL_OPTIONS: Partial<OpenModalOptions> = {
  size: "md",
  showCloseButton: true,
  closeOnOverlayClick: true,
};

export const userModalRegistry: ModalRegistryConfig["services:user"] = {
  delete: {
    component: lazy(() =>
      import("@/features/user/components/UserActionDialogs").then((mod) => ({
        default: mod.UserDeleteDialog,
      })),
    ),
    modalOptions: {
      ...BASE_MODAL_OPTIONS,
      title: CONFIRM_DIALOG_CONFIG.delete.title,
      description: CONFIRM_DIALOG_CONFIG.delete.description,
    },
  },
  recover: {
    component: lazy(() =>
      import("@/features/user/components/UserActionDialogs").then((mod) => ({
        default: mod.UserRecoverDialog,
      })),
    ),
    modalOptions: {
      ...BASE_MODAL_OPTIONS,
      title: CONFIRM_DIALOG_CONFIG.recover.title,
      description: CONFIRM_DIALOG_CONFIG.recover.description,
    },
  },
  "hard-delete": {
    component: lazy(() =>
      import("@/features/user/components/UserActionDialogs").then((mod) => ({
        default: mod.UserHardDeleteDialog,
      })),
    ),
    modalOptions: {
      ...BASE_MODAL_OPTIONS,
      title: CONFIRM_DIALOG_CONFIG["hard-delete"].title,
      description: CONFIRM_DIALOG_CONFIG["hard-delete"].description,
    },
  },
};

export const getUserModalRegistry = () => userModalRegistry;