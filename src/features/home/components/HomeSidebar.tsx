import { Dumbbell } from "lucide-react";
import { lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import { LogoutBtn } from "@/components/buttons/LogoutBtn";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { ButtonCurrentInfoSkeleton } from "@/features/current/components/ButtonCurrentInfoSkeleton";
import { HOME_SECTIONS } from "@/features/home/services/HomeSections";

const brand = (
  <Link
    to="/home"
    className="inline-flex min-w-0 items-center gap-2 text-text-primary transition-colors hover:text-accent"
  >
    <Dumbbell size={22} aria-hidden="true" className="shrink-0 text-accent" />
    <span className="truncate text-lg font-bold tracking-tight">Home</span>
  </Link>
);

const collapsedBrand = (
  <Link
    to="/home"
    aria-label="Home"
    className="inline-flex items-center text-text-primary transition-colors hover:text-accent"
  >
    <Dumbbell size={22} aria-hidden="true" className="shrink-0 text-accent" />
  </Link>
);

const LazyBtnCurrentInfo = lazy(
  () => import("@/features/current/components/ButtonCurrentInfo"),
);

export const HomeSidebar = () => {
  return (
    <Sidebar
      aria-label="Home sidebar"
      brand={brand}
      collapsedBrand={collapsedBrand}
      sections={HOME_SECTIONS}
      footer={
        <article className={`tab:grid gap-2 max-tab:flex`}>
          <Suspense fallback={<ButtonCurrentInfoSkeleton />}>
            <LazyBtnCurrentInfo to="/home/settings" />
          </Suspense>
          <LogoutBtn className="w-full" />
        </article>
      }
    />
  );
};
