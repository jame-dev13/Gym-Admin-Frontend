import { lazy } from "react";
import type { DrawerRegistryConfig } from "@/types/DrawerRegistryTypes";
import type { OpenDrawerOptions } from "@/context/DrawerContext";

export const getUserDrawerRegistry = () => userDrawerRegistry;

const DRAWER_OPTIONS: OpenDrawerOptions = {
  size: "lg",
  position: "left",
  title: "Add user",
  description: "Add new user",
  showCloseButton: true,
};

const userDrawerRegistry: DrawerRegistryConfig["services:user"] = {
  add: {
    component: lazy(() =>
      import("@/features/user/components/UserCreateForm").then((mod) => ({
        default: mod.UserCreateForm,
      })),
    ),
    drawerOptions: DRAWER_OPTIONS,
  },
  edit: {
    component: lazy(() =>
      import("@/features/user/components/UserUpdateForm").then((mod) => ({
        default: mod.UserUpdateForm,
      })),
    ),
    drawerOptions: {
      ...DRAWER_OPTIONS,
      title: "Edit user",
      description: "Edit selected user",
    },
  },
};
