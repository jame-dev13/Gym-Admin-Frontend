import { useEntityDomainContext } from "@/context/useEntityDomainContext";
import type {
  DrawerRegistryConfig,
  DrawerRegistryEntry,
  DrawerRegistryKey,
} from "@/types/DrawerRegistryTypes";

const FALLBACK_VALUE = { entry: null, key: null };

const checkConfirmableAction = (action: Action) =>
  action !== "add" && action !== "edit";

export function useDrawerRegistry<T = Record<string, unknown>>(
  registry: DrawerRegistryConfig,
): { entry: DrawerRegistryEntry<T> | null; key: DrawerRegistryKey | null } {
  const { domain, entity } = useEntityDomainContext();
  const { action } = useActionContext();

  if (!domain || !entity || !action) {
    return FALLBACK_VALUE;
  }

  const isConfirmableAction = checkConfirmableAction(action);
  if (isConfirmableAction) return FALLBACK_VALUE;

  const key = `${domain}:${entity}` as DrawerRegistryKey;
  const entry = registry[key]?.[action] as DrawerRegistryEntry<T> | undefined ?? null;

  return { entry: entry, key };
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

  const isConfirmableAction = checkConfirmableAction(action);
  if (isConfirmableAction) return null;

  const key = `${domain}:${entity}` as DrawerRegistryKey;
  return (
    (registry[key]?.[action] as DrawerRegistryEntry<T> | undefined) ?? null
  );
}

import type { Domain, Entity } from "@/context/EntityDomainContext";
import { useActionContext } from "@/context/useActionContext";
import type { Action } from "@/context/ActionContext";
