import { Suspense } from "react";
import { Modal } from "./Modal";
import { FormSkeleton } from "@/components/skeleton/FormSkeleton";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { useModalContext } from "@/context/useModalContext";

export const ModalHost = () => {
  const { activeModal, closeModal } = useModalContext();

  if (!activeModal) {
    return null;
  }

  const { content, ...modalOptions } = activeModal;

  return (
    <Modal open onClose={closeModal} {...modalOptions}>
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
        <Suspense fallback={<FormSkeleton />}>{content()}</Suspense>
      </ErrorBoundary>
    </Modal>
  );
};
