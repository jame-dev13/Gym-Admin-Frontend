import { lazy } from "react";
import type { DrawerRegistryConfig } from "@/types/DrawerRegistryTypes";

export const userDrawerRegistry: DrawerRegistryConfig = {
  "services:user": {
    component: lazy(() =>
      import("@/features/user/components/UserCreateForm").then((mod) => ({
        default: mod.UserCreateForm,
      }))
    ),
    drawerOptions: {
      title: "Create User",
      size: "lg",
    },
  },
} as const satisfies DrawerRegistryConfig;