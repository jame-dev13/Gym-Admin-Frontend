import { PageSkeleton } from "@/components/skeleton";
import { HomeFooter } from "@/features/home/components/HomeFooter";
import { HomeSidebar } from "@/features/home/components/HomeSidebar";
import { Suspense } from "react";
import { Outlet } from "react-router-dom";

export const HomeLayout = () => {
  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-surface text-text-primary">
      <div className="flex min-h-0 flex-1 flex-col tab:flex-row">
        <HomeSidebar />
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
          <HomeFooter />
        </div>
      </div>
    </div>
  );
};
