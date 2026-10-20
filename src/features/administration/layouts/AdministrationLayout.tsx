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
import { getDrawerRegistry } from "@/features/administration/services/DrawerRegistry";
import { getModalRegistry } from "@/features/administration/services/ModalRegistry";

const [DRAWER_REGISTRY, MODAL_REGISTRY] = [
  getDrawerRegistry(),
  getModalRegistry(),
];

const AdministrationLayout = () => {
  return (
    <AdministrationProvider>
      <div className="flex min-h-screen flex-col bg-surface text-text-primary">
        <AdministrationNavbar />
        <div className="flex flex-1 flex-col tab:flex-row">
          <AdministrationSidebar />
          <div className="flex min-w-0 flex-1 flex-col">
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
      <DrawerHost registry={DRAWER_REGISTRY} />
      <ModalHost registry={MODAL_REGISTRY} />
      <PopoverHost />
    </AdministrationProvider>
  );
};

export default AdministrationLayout;
