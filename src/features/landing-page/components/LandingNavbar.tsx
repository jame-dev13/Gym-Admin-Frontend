import { Dumbbell } from "lucide-react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/navbar/Navbar";
import { LANDING_SECTION_IDS } from "@/features/landing-page/services/SectionIds";
import type { NavbarLink } from "@/types/Types";

const links: NavbarLink[] = [
  { href: `#${LANDING_SECTION_IDS.benefits}`, label: "Benefits" },
  { href: `#${LANDING_SECTION_IDS.pricing}`, label: "Memberships" },
  { href: `#${LANDING_SECTION_IDS.testimonials}`, label: "Testimonials" },
  { href: `#${LANDING_SECTION_IDS.faq}`, label: "FAQ" },
  { to: "/auth/register", label: "Join now" },
];

export const LandingNavbar = () => (
  <Navbar
    aria-label="Main navigation"
    brand={
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-text-primary transition-colors hover:text-accent"
      >
        <Dumbbell size={22} aria-hidden="true" className="text-accent" />
        <span className="text-lg font-bold tracking-tight">Gym Admin</span>
      </Link>
    }
    links={links}
    position="sticky"
  />
);
