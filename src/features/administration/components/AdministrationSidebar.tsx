import { Dumbbell } from "lucide-react";
import { Link } from "react-router-dom";
import { LogoutBtn } from "@/components/buttons/LogoutBtn";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { useSelectionContext } from "@/context/useSelectionContext";
import { ADMINISTRATION_SECTIONS } from "@/features/administration/services/AdministrationSections";
import { lazy, Suspense } from "react";
import { ButtonCurrentInfoSkeleton } from "@/features/current/components/ButtonCurrentInfoSkeleton";

const brand = (
  <Link
    to="/administration"
    className="inline-flex min-w-0 items-center gap-2 text-text-primary transition-colors hover:text-accent"
  >
    <Dumbbell size={22} aria-hidden="true" className="shrink-0 text-accent" />
    <span className="truncate text-lg font-bold tracking-tight">
      Administration
    </span>
  </Link>
);

const collapsedBrand = (
  <Link
    to="/administration"
    aria-label="Administration home"
    className="inline-flex items-center text-text-primary transition-colors hover:text-accent"
  >
    <Dumbbell size={22} aria-hidden="true" className="shrink-0 text-accent" />
  </Link>
);

const LazyBtnCurrentInfo = lazy(
  () => import("@/features/current/components/ButtonCurrentInfo"),
);

export const AdministrationSidebar = () => {
  const { clearSelection } = useSelectionContext();

  return (
    <Sidebar
      aria-label="Sidebar"
      brand={brand}
      collapsedBrand={collapsedBrand}
      sections={ADMINISTRATION_SECTIONS}
      footer={
        <article className={`tab:grid gap-2 max-tab:flex`}>
          <Suspense fallback={<ButtonCurrentInfoSkeleton />}>
            <LazyBtnCurrentInfo />
          </Suspense>
          <LogoutBtn className="w-full" />
        </article>
      }
      onNavigate={clearSelection}
    />
  );
};
