import { useEntityDomainContext } from "@/context/useEntityDomainContext";
import type {
  ModalRegistryConfig,
  ModalRegistryEntry,
  ModalRegistryKey,
} from "@/types/ModalRegistryTypes";

const FALLBACK_VALUE = { entry: null, key: null };

const checkSavableAction = (action: Action) =>
  action === "add" || action === "edit";

export function useModalRegistry<T = Record<string, unknown>>(
  registry: ModalRegistryConfig,
): { entry: ModalRegistryEntry<T> | null; key: ModalRegistryKey | null } {
  const { domain, entity } = useEntityDomainContext();
  const { action } = useActionContext();

  if (!domain || !entity || !action) {
    return FALLBACK_VALUE;
  }

  const isSavableAction = checkSavableAction(action);

  if (isSavableAction) return FALLBACK_VALUE;

  const key = `${domain}:${entity}` as ModalRegistryKey;
  const entry =
    (registry[key]?.[action] as ModalRegistryEntry<T> | undefined) ?? null;

  return { entry: entry, key };
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

  if (checkSavableAction(action)) return null;

  const key = `${domain}:${entity}` as ModalRegistryKey;
  return (registry[key]?.[action] as ModalRegistryEntry<T> | undefined) ?? null;
}

import type { Domain, Entity } from "@/context/EntityDomainContext";
import { useActionContext } from "@/context/useActionContext";
import type { Action } from "@/context/ActionContext";
