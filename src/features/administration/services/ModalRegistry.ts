import { getUserModalRegistry } from "@/features/user/services/userModalRegistry";
import type { ModalRegistryConfig } from "@/types/ModalRegistryTypes";

const modalRegistry: ModalRegistryConfig = {
  "services:user": getUserModalRegistry(),
};

export const getModalRegistry = () => modalRegistry;