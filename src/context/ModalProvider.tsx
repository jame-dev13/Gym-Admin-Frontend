import { useCallback, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { ModalContext } from "./ModalContext";
import type { OpenModalOptions } from "./ModalContext";
import type { ModalSize } from "@/components/modal/ModalTypes";

interface ModalProviderProps {
  children: ReactNode;
}

interface ModalConfig {
  title: string;
  description?: string;
  size: ModalSize;
  showCloseButton: boolean;
  closeOnOverlayClick: boolean;
}

const DEFAULT_CONFIG: ModalConfig = {
  title: "",
  description: undefined,
  size: "md",
  showCloseButton: true,
  closeOnOverlayClick: true,
};

export const ModalProvider = ({ children }: ModalProviderProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState<ModalConfig>(DEFAULT_CONFIG);

  const openModal = useCallback((options: OpenModalOptions) => {
    if (!options.title.trim()) {
      throw new Error("Modal title must not be empty");
    }
    setConfig({
      title: options.title,
      description: options.description,
      size: options.size ?? DEFAULT_CONFIG.size,
      showCloseButton:
        options.showCloseButton ?? DEFAULT_CONFIG.showCloseButton,
      closeOnOverlayClick:
        options.closeOnOverlayClick ?? DEFAULT_CONFIG.closeOnOverlayClick,
    });
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  const value = useMemo(
    () => ({
      isOpen,
      title: config.title,
      description: config.description,
      size: config.size,
      showCloseButton: config.showCloseButton,
      closeOnOverlayClick: config.closeOnOverlayClick,
      openModal,
      closeModal,
    }),
    [isOpen, config, openModal, closeModal],
  );

  return (
    <ModalContext.Provider value={value}>{children}</ModalContext.Provider>
  );
};