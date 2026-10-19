import type { PropsWithChildren } from "@/components/form/FormTypes";
import { ActionProvider } from "@/context/ActionProvider";
import { DrawerProvider } from "@/context/DrawerProvider";
import { EntityDomainProvider } from "@/context/EntityDomainProvider";
import { ModalProvider } from "@/context/ModalProvider";
import { PopoverProvider } from "@/context/PopoverProvider";
import { SelectionProvider } from "@/context/SelectionProvider";
import { useMemo } from "react";

export const AdministrationProvider = ({ children }: PropsWithChildren) => {
  const composedProvider = useMemo(() => {
    return [
      DrawerProvider,
      ModalProvider,
      EntityDomainProvider,
      ActionProvider,
      SelectionProvider,
      PopoverProvider,
    ].reduce((acc, Provider) => {
      return <Provider>{acc}</Provider>;
    }, children);
  }, [children]);
  return composedProvider;
};
