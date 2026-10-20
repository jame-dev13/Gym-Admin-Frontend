import type { Identifiable } from "@/types/Types";

export type VoidFnWArgs<T> = (value: T) => void;
export type VoidFn = () => void;

export const pipeVoidWArgs =
  <T>(...fns: VoidFnWArgs<T>[]) =>
  (value: T) =>
    fns.forEach((fn) => fn(value));

export const pipeVoid =
  (...fns: VoidFn[]) =>
  () =>
    fns.forEach((fn) => fn());

export const requireId = (id: Identifiable | null | undefined) => {
  if (id?.id === undefined || id.id === null) {
    throw new Error("Id value is required.");
  }
};
