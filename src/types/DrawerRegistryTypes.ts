import type { Entity, Domain } from "@/context/EntityDomainContext";
import type { OpenDrawerOptions } from "@/context/DrawerContext";
import type { ComponentType, LazyExoticComponent } from "react";
import type { Action } from "@/context/ActionContext";

export type DrawerRegistryKey = `${Domain}:${Entity}`;

export interface DrawerComponentProps<T = Record<string, unknown>> {
  onClose?: () => void;
  onSuccess?: () => void;
  initialValues?: Partial<T>;
}

export type DrawerLazyComponent<T = Record<string, unknown>> =
  LazyExoticComponent<ComponentType<DrawerComponentProps<T>>>;

export interface DrawerRegistryEntry<T = Record<string, unknown>> {
  component: DrawerLazyComponent<T>;
  drawerOptions?: Partial<OpenDrawerOptions>;
}

export type DrawerAction = Exclude<Action, "delete" | "hard-delete" | "recover">
export type DrawerRegistryConfig = Partial<
  Record<DrawerRegistryKey, Record<Partial<DrawerAction>, DrawerRegistryEntry>>
>;

export function createDrawerRegistryKey(
  domain: Domain,
  entity: Entity,
): DrawerRegistryKey {
  return `${domain}:${entity}`;
}
