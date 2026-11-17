import { ArrowUp, Dumbbell } from "lucide-react";
import { Link } from "react-router-dom";
import { WELCOME_NAV_LINKS } from "@/components/welcome/WelcomeContent";
import { WELCOME_SECTION_IDS } from "@/components/welcome/WelcomeSectionIds";
import { useWelcomeMembershipDialog } from "@/components/welcome/useWelcomeMembershipDialog";

const LINK_STYLES =
  "w-fit text-sm text-text-secondary transition-colors duration-200 hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent";

const COLUMN_TITLE_STYLES =
  "text-xs font-bold tracking-[0.18em] text-text-tertiary uppercase";

export const WelcomeFooter = () => {
  const openMembershipDialog = useWelcomeMembershipDialog();

  return (
    <footer className="border-t border-border bg-surface-raised/40">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-12 sm:px-6 tab:grid-cols-[1.4fr_1fr_1fr]">
        <div className="flex max-w-sm flex-col gap-4">
          <Link
            to="/home"
            className="inline-flex w-fit items-center gap-2.5 text-text-primary transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
          >
            <span className="grid size-9 place-items-center rounded-xl bg-accent/10 text-accent ring-1 ring-accent/20">
              <Dumbbell size={20} aria-hidden="true" />
            </span>
            <span className="text-base font-bold tracking-tight">Gym Admin</span>
          </Link>
          <p className="text-sm leading-relaxed text-text-secondary">
            Your membership, your progress, and your community in one clear place.
            Built to keep you moving, not managing paperwork.
          </p>
        </div>

        <nav aria-label="Welcome page sections" className="flex flex-col gap-3">
          <h2 className={COLUMN_TITLE_STYLES}>Explore</h2>
          <ul className="flex flex-col gap-2">
            {WELCOME_NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a href={link.href} className={LINK_STYLES}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Membership links" className="flex flex-col gap-3">
          <h2 className={COLUMN_TITLE_STYLES}>Membership</h2>
          <ul className="flex flex-col gap-2">
            <li>
              <button
                type="button"
                onClick={openMembershipDialog}
                className={`${LINK_STYLES} cursor-pointer text-left`}
              >
                Activate membership
              </button>
            </li>
            <li>
              <a
                href={`#${WELCOME_SECTION_IDS.benefits}`}
                className={LINK_STYLES}
              >
                Member benefits
              </a>
            </li>
            <li>
              <Link to="/" className={LINK_STYLES}>
                Visit the gym site
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-6 text-sm text-text-tertiary sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>
            © {new Date().getFullYear()} Gym Admin. All rights reserved.
          </p>
          <a
            href={`#${WELCOME_SECTION_IDS.overview}`}
            className="inline-flex w-fit items-center gap-1.5 text-text-secondary transition-colors duration-200 hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
          >
            Back to top
            <ArrowUp size={14} aria-hidden="true" />
          </a>
        </div>
      </div>
    </footer>
  );
};
