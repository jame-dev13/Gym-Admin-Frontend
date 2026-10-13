import { getUserDrawerRegistry } from "@/features/user/services/userDrawerRegistry";
import type { DrawerRegistryConfig } from "@/types/DrawerRegistryTypes";

const drawerRegistry: DrawerRegistryConfig = {
  "services:user": getUserDrawerRegistry(),
};

export const getDrawerRegistry = () => drawerRegistry;
