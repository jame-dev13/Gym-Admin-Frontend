import { Suspense } from "react";
import { Modal } from "./Modal";
import { FormSkeleton } from "@/components/skeleton/FormSkeleton";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { useModalContext } from "@/context/useModalContext";
import { useModalRegistry } from "@/hooks/useModalRegistry";
import type { ModalRegistryConfig } from "@/types/ModalRegistryTypes";

const LazyFallback = () => <FormSkeleton />;

export function ModalHost<T extends Record<string, unknown> = Record<string, unknown>>({
  registry,
}: { registry: ModalRegistryConfig }) {
  const { isOpen, closeModal, ...modalContextOptions } = useModalContext();
  const { entry, key } = useModalRegistry<T>(registry);

  if (!isOpen || !entry) {
    return null;
  }

  const { component: LazyComponent, modalOptions } = entry;

  const mergedOptions = {
    ...modalContextOptions,
    ...modalOptions,
  };

  return (
    <Modal
      title={mergedOptions.title ?? key ?? "Modal"}
      size={mergedOptions.size}
      description={mergedOptions.description}
      showCloseButton={mergedOptions.showCloseButton}
      closeOnOverlayClick={mergedOptions.closeOnOverlayClick}
    >
      <ErrorBoundary
        fallback={
          <div
            role="alert"
            className="flex flex-col items-center justify-center gap-4 p-6 text-center"
          >
            <div className="text-lg font-medium text-text-primary">
              Failed to load content
            </div>
            <p className="text-sm text-text-secondary">
              The modal content could not be loaded. Please try again.
            </p>
          </div>
        }
      >
        <Suspense fallback={<LazyFallback />}>
          <LazyComponent onClose={closeModal} />
        </Suspense>
      </ErrorBoundary>
    </Modal>
  );
}