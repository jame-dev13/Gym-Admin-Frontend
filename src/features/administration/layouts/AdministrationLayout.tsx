import { Outlet } from "react-router-dom";
import { AdministrationFooter } from "@/features/administration/components/AdministrationFooter";
import { AdministrationNavbar } from "@/features/administration/components/AdministrationNavbar";
import { AdministrationSidebar } from "@/features/administration/components/AdministrationSidebar";

const AdministrationLayout = () => {
  return (
    <div className="flex min-h-screen flex-col bg-surface text-text-primary">
      <AdministrationNavbar />
      <div className="flex flex-1 flex-col tab:flex-row">
        <AdministrationSidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <main className="flex-1 px-4 py-6 tab:px-8">
            <Outlet />
          </main>
          <AdministrationFooter />
        </div>
      </div>
    </div>
  );
};

export default AdministrationLayout;
