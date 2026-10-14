import { lazy } from "react";
import type { ModalRegistryConfig } from "@/types/ModalRegistryTypes";
import type { OpenModalOptions } from "@/context/ModalContext";

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
      title: "Delete user",
      description: "The user will lose access immediately. You can recover this user later.",
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
      title: "Recover user",
      description: "The user will regain access to the application depending on his own role.",
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
      title: "Permanently delete user",
      description: "The user will be permanently removed. This action cannot be undone.",
    },
  },
};

export const getUserModalRegistry = () => userModalRegistry;