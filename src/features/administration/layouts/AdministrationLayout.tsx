import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { PageSkeleton } from "@/components/skeleton";
import { AdministrationFooter } from "@/features/administration/components/AdministrationFooter";
import { AdministrationSidebar } from "@/features/administration/components/AdministrationSidebar";
import { AdministrationProvider } from "@/context/AdministrationProvider";
import { DrawerHost } from "@/components/drawer/DrawerHost";
import { ModalHost } from "@/components/modal/ModalHost";
import { PopoverHost } from "@/components/popover/PopoverHost";

const AdministrationLayout = () => {
  return (
    <AdministrationProvider>
      <div className="flex h-dvh flex-col overflow-hidden bg-surface text-text-primary">
        <div className="flex min-h-0 flex-1 flex-col tab:flex-row">
          <AdministrationSidebar />
          <div className="flex min-h-0 min-w-0 flex-1 flex-col">
            <main className="min-h-0 flex-1 overflow-y-auto px-4 py-6 tab:px-8">
              <Suspense
                fallback={
                  <PageSkeleton
                    showNavbar={false}
                    showSidebar={false}
                    showFooter={false}
                  />
                }
              >
                <Outlet />
              </Suspense>
            </main>
            <AdministrationFooter />
          </div>
        </div>
      </div>
      <DrawerHost />
      <ModalHost />
      <PopoverHost />
    </AdministrationProvider>
  );
};

export default AdministrationLayout;
