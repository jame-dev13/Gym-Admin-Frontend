import { useEntityDomainContext } from "@/context/useEntityDomainContext";
import type {
  DrawerRegistryConfig,
  DrawerRegistryEntry,
  DrawerRegistryKey,
} from "@/types/DrawerRegistryTypes";

export function useDrawerRegistry<T = Record<string, unknown>>(
  registry: DrawerRegistryConfig,
): { entry: DrawerRegistryEntry<T> | null; key: DrawerRegistryKey | null } {
  const { domain, entity } = useEntityDomainContext();
  const { action } = useActionContext();

  if (!domain || !entity || !action) {
    return { entry: null, key: null };
  }

  const key = `${domain}:${entity}` as DrawerRegistryKey;
  const entry = registry[key]?.[action] as DrawerRegistryEntry<T> | undefined;

  return { entry: entry ?? null, key };
}

export function getDrawerRegistryEntry<T = Record<string, unknown>>(
  registry: DrawerRegistryConfig,
  domain: Domain | null,
  entity: Entity | null,
  action: Action | null,
): DrawerRegistryEntry<T> | null {
  if (!domain || !entity || !action) {
    return null;
  }

  const key = `${domain}:${entity}` as DrawerRegistryKey;
  return (
    (registry[key]?.[action] as DrawerRegistryEntry<T> | undefined) ?? null
  );
}

import type { Domain, Entity } from "@/context/EntityDomainContext";
import { useActionContext } from "@/context/useActionContext";
import type { Action } from "@/context/ActionContext";
