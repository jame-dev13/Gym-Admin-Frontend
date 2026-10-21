import { Suspense } from "react";
import { Drawer } from "./Drawer";
import { FormSkeleton } from "@/components/skeleton/FormSkeleton";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { useDrawerContext } from "@/context/useDrawerContext";

export const DrawerHost = () => {
  const { activeDrawer, closeDrawer } = useDrawerContext();

  if (!activeDrawer) {
    return null;
  }

  const { content, ...drawerOptions } = activeDrawer;

  return (
    <Drawer open onClose={closeDrawer} {...drawerOptions}>
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
              The drawer content could not be loaded. Please try again.
            </p>
          </div>
        }
      >
        <Suspense fallback={<FormSkeleton />}>{content()}</Suspense>
      </ErrorBoundary>
    </Drawer>
  );
};
