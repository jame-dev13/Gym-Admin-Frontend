import { Dumbbell } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { ThemeBtn } from "@/components/buttons/Buttons";
import { Navbar } from "@/components/navbar/Navbar";
import { WELCOME_NAV_LINKS } from "@/components/welcome/WelcomeContent";
import { WELCOME_NAV_SECTION_IDS } from "@/components/welcome/WelcomeSectionIds";
import type { WelcomeMembershipActionProps } from "@/components/welcome/WelcomeTypes";
import { useActiveWelcomeSection } from "@/components/welcome/useActiveWelcomeSection";

const CTA_STYLES = [
  "inline-flex",
  "flex-1",
  "cursor-pointer",
  "items-center",
  "justify-center",
  "gap-2",
  "rounded-full",
  "bg-accent",
  "px-4",
  "py-2",
  "text-sm",
  "font-semibold",
  "text-surface",
  "transition-colors",
  "duration-200",
  "hover:bg-accent-emphasis",
  "focus-visible:outline-none",
  "focus-visible:ring-2",
  "focus-visible:ring-accent",
  "focus-visible:ring-offset-2",
  "focus-visible:ring-offset-surface",
  "tab:flex-none",
].join(" ");

export const WelcomeNavbar = ({
  onRequestMembership,
}: WelcomeMembershipActionProps) => {
  const activeHref = useActiveWelcomeSection(WELCOME_NAV_SECTION_IDS);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleRequestMembership = () => {
    setMenuOpen(false);
    onRequestMembership();
  };

  return (
    <Navbar
      aria-label="Welcome page navigation"
      position="sticky"
      activeHref={activeHref}
      open={menuOpen}
      onOpenChange={setMenuOpen}
      brand={
        <Link
          to="/home"
          className="inline-flex min-w-0 items-center gap-2.5 text-text-primary transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
        >
          <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-accent/10 text-accent ring-1 ring-accent/20">
            <Dumbbell size={20} aria-hidden="true" />
          </span>
          <span className="flex min-w-0 flex-col leading-none">
            <span className="truncate text-base font-bold tracking-tight">
              Gym Admin
            </span>
            <span className="truncate text-[10px] font-semibold tracking-[0.16em] text-text-tertiary uppercase">
              Member access
            </span>
          </span>
        </Link>
      }
      links={WELCOME_NAV_LINKS}
      actions={
        <div className="flex items-center gap-2">
          <ThemeBtn />
          <button
            type="button"
            onClick={handleRequestMembership}
            className={CTA_STYLES}
          >
            Become a member
          </button>
        </div>
      }
    />
  );
};
