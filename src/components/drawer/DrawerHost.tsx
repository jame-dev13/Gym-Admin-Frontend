import { Suspense } from "react";
import { Drawer } from "./Drawer";
import { FormSkeleton } from "@/components/skeleton/FormSkeleton";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { useDrawerContext } from "@/context/useDrawerContext";
import { useDrawerRegistry } from "@/hooks/useDrawerRegistry";
import type { DrawerRegistryConfig } from "@/types/DrawerRegistryTypes";

const LazyFallback = () => <FormSkeleton />;

export function DrawerHost<T extends Record<string, unknown> = Record<string, unknown>>({
  registry,
}: { registry: DrawerRegistryConfig }) {
  const { isOpen, closeDrawer, ...drawerContextOptions } = useDrawerContext();
  const { entry, key } = useDrawerRegistry<T>(registry);

  if (!isOpen || !entry) {
    return null;
  }

  const { component: LazyComponent, drawerOptions } = entry;

  const mergedOptions = {
    ...drawerContextOptions,
    ...drawerOptions,
  };

  return (
    <Drawer
      open={isOpen}
      onClose={closeDrawer}
      title={mergedOptions.title ?? key ?? "Drawer"}
      position={mergedOptions.position}
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
              The drawer content could not be loaded. Please try again.
            </p>
          </div>
        }
      >
        <Suspense fallback={<LazyFallback />}>
          <LazyComponent onClose={closeDrawer} />
        </Suspense>
      </ErrorBoundary>
    </Drawer>
  );
}