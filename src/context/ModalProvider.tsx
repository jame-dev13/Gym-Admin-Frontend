import type { ReactNode } from "react";
import { useCallback, useMemo, useState } from "react";
import { ModalContext } from "./ModalContext";
import type { ActiveModal, OpenModalOptions } from "./ModalContext";
import type { ModalSize } from "@/components/modal/ModalTypes";

interface ModalProviderProps {
  children: ReactNode;
}

const DEFAULT_SIZE: ModalSize = "md";

/**
 * Binds `data` to its `render` at the call site, so the stored content is
 * self-contained and the non-generic context never needs an assertion.
 */
const toActiveModal = <T,>(options: OpenModalOptions<T>): ActiveModal => ({
  title: options.title,
  description: options.description,
  size: options.size ?? DEFAULT_SIZE,
  showCloseButton: options.showCloseButton ?? true,
  closeOnOverlayClick: options.closeOnOverlayClick ?? true,
  content: () => options.render(options.data),
});

export const ModalProvider = ({ children }: ModalProviderProps) => {
  const [activeModal, setActiveModal] = useState<ActiveModal | null>(null);

  const openModal = useCallback(<T,>(options: OpenModalOptions<T>) => {
    if (!options.title.trim()) {
      throw new Error("Modal title must not be empty");
    }
    setActiveModal(toActiveModal(options));
  }, []);

  const closeModal = useCallback(() => setActiveModal(null), []);

  const value = useMemo(
    () => ({
      isOpen: activeModal !== null,
      activeModal,
      openModal,
      closeModal,
    }),
    [activeModal, openModal, closeModal],
  );

  return (
    <ModalContext.Provider value={value}>{children}</ModalContext.Provider>
  );
};
