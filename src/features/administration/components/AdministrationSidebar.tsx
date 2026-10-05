import { Dumbbell } from "lucide-react";
import { Link } from "react-router-dom";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { ADMINISTRATION_SECTIONS } from "@/features/administration/services/AdministrationSections";

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

export const AdministrationSidebar = () => (
  <Sidebar
    aria-label="Sidebar"
    brand={brand}
    collapsedBrand={collapsedBrand}
    sections={ADMINISTRATION_SECTIONS}
  />
);
