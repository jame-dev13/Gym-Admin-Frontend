import { useEntityDomainContext } from "@/context/useEntityDomainContext";
import type {
  ModalRegistryConfig,
  ModalRegistryEntry,
  ModalRegistryKey,
} from "@/types/ModalRegistryTypes";

export function useModalRegistry<T = Record<string, unknown>>(
  registry: ModalRegistryConfig
): { entry: ModalRegistryEntry<T> | null; key: ModalRegistryKey | null } {
  const { domain, entity } = useEntityDomainContext();

  if (!domain || !entity) {
    return { entry: null, key: null };
  }

  const key = `${domain}:${entity}` as ModalRegistryKey;
  const entry = registry[key] as ModalRegistryEntry<T> | undefined;

  return { entry: entry ?? null, key };
}

export function getModalRegistryEntry<T = Record<string, unknown>>(
  registry: ModalRegistryConfig,
  domain: Domain | null,
  entity: Entity | null
): ModalRegistryEntry<T> | null {
  if (!domain || !entity) {
    return null;
  }

  const key = `${domain}:${entity}` as ModalRegistryKey;
  return (registry[key] as ModalRegistryEntry<T> | undefined) ?? null;
}

import type { Domain, Entity } from "@/context/EntityDomainContext";