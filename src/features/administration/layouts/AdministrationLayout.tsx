import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { PageSkeleton } from "@/components/skeleton";
import { AdministrationFooter } from "@/features/administration/components/AdministrationFooter";
import { AdministrationNavbar } from "@/features/administration/components/AdministrationNavbar";
import { AdministrationSidebar } from "@/features/administration/components/AdministrationSidebar";
import { AdministrationProvider } from "@/context/AdministrationProvider";
import { DrawerHost } from "@/components/drawer/DrawerHost";
import { ModalHost } from "@/components/modal/ModalHost";
import { PopoverHost } from "@/components/popover/PopoverHost";
import { getModalRegistry } from "@/features/administration/services/ModalRegistry";

const MODAL_REGISTRY = getModalRegistry();

const AdministrationLayout = () => {
  return (
    <AdministrationProvider>
      <div className="flex min-h-screen flex-col bg-surface text-text-primary tab:h-dvh tab:overflow-hidden">
        <AdministrationNavbar />
        <div className="flex flex-1 flex-col tab:min-h-0 tab:flex-row">
          <AdministrationSidebar />
          <div className="flex min-w-0 flex-1 flex-col tab:min-h-0 tab:overflow-y-auto">
            <main className="flex-1 px-4 py-6 tab:px-8">
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
      <ModalHost registry={MODAL_REGISTRY} />
      <PopoverHost />
    </AdministrationProvider>
  );
};

export default AdministrationLayout;
