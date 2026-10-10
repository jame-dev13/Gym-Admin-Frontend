import { useEntityDomainContext } from "@/context/useEntityDomainContext";
import type {
  DrawerRegistryConfig,
  DrawerRegistryEntry,
  DrawerRegistryKey,
} from "@/types/DrawerRegistryTypes";

export function useDrawerRegistry<T = Record<string, unknown>>(
  registry: DrawerRegistryConfig
): { entry: DrawerRegistryEntry<T> | null; key: DrawerRegistryKey | null } {
  const { domain, entity } = useEntityDomainContext();

  if (!domain || !entity) {
    return { entry: null, key: null };
  }

  const key = `${domain}:${entity}` as DrawerRegistryKey;
  const entry = registry[key] as DrawerRegistryEntry<T> | undefined;

  return { entry: entry ?? null, key };
}

export function getDrawerRegistryEntry<T = Record<string, unknown>>(
  registry: DrawerRegistryConfig,
  domain: Domain | null,
  entity: Entity | null
): DrawerRegistryEntry<T> | null {
  if (!domain || !entity) {
    return null;
  }

  const key = `${domain}:${entity}` as DrawerRegistryKey;
  return (registry[key] as DrawerRegistryEntry<T> | undefined) ?? null;
}

import type { Domain, Entity } from "@/context/EntityDomainContext";