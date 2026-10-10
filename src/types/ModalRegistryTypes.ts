import type { Entity, Domain } from "@/context/EntityDomainContext";
import type { OpenModalOptions } from "@/context/ModalContext";
import type { ComponentType, LazyExoticComponent } from "react";

export type ModalRegistryKey = `${Domain}:${Entity}`;

export interface ModalComponentProps<T = Record<string, unknown>> {
  onClose?: () => void;
  onSuccess?: () => void;
  initialValues?: Partial<T>;
}

export type ModalLazyComponent<T = Record<string, unknown>> = LazyExoticComponent<
  ComponentType<ModalComponentProps<T>>
>;

export interface ModalRegistryEntry<T = Record<string, unknown>> {
  component: ModalLazyComponent<T>;
  modalOptions?: Partial<OpenModalOptions>;
}

export type ModalRegistryConfig = Partial<Record<ModalRegistryKey, ModalRegistryEntry>>;

export function createModalRegistryKey(domain: Domain, entity: Entity): ModalRegistryKey {
  return `${domain}:${entity}`;
}