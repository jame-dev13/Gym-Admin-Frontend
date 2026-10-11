import { useEntityDomainContext } from "@/context/useEntityDomainContext";
import type {
  ModalRegistryConfig,
  ModalRegistryEntry,
  ModalRegistryKey,
} from "@/types/ModalRegistryTypes";

export function useModalRegistry<T = Record<string, unknown>>(
  registry: ModalRegistryConfig,
): { entry: ModalRegistryEntry<T> | null; key: ModalRegistryKey | null } {
  const { domain, entity } = useEntityDomainContext();
  const { action } = useActionContext();

  if (!domain || !entity || !action) {
    return { entry: null, key: null };
  }

  if (action === "add" || action === "edit") return { entry: null, key: null };

  const key = `${domain}:${entity}` as ModalRegistryKey;
  const entry = registry[key]?.[action] as ModalRegistryEntry<T> | undefined;

  return { entry: entry ?? null, key };
}

export function getModalRegistryEntry<T = Record<string, unknown>>(
  registry: ModalRegistryConfig,
  domain: Domain | null,
  entity: Entity | null,
  action: Action | null,
): ModalRegistryEntry<T> | null {
  if (!domain || !entity || !action) {
    return null;
  }

  if (action === "add" || action === "edit") return null;

  const key = `${domain}:${entity}` as ModalRegistryKey;
  return (registry[key]?.[action] as ModalRegistryEntry<T> | undefined) ?? null;
}

import type { Domain, Entity } from "@/context/EntityDomainContext";
import { useActionContext } from "@/context/useActionContext";
import type { Action } from "@/context/ActionContext";
