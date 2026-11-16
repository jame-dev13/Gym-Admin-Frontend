import {
  ArrowRight,
  Bell,
  CalendarCheck,
  Check,
  CreditCard,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { WELCOME_HERO_TRUST_POINTS } from "@/components/welcome/WelcomeContent";
import { WELCOME_SECTION_IDS } from "@/components/welcome/WelcomeSectionIds";
import type { WelcomeMembershipActionProps } from "@/components/welcome/WelcomeTypes";

const PRIMARY_CTA = [
  "inline-flex",
  "cursor-pointer",
  "items-center",
  "justify-center",
  "gap-2",
  "rounded-full",
  "bg-accent",
  "px-6",
  "py-3",
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
].join(" ");

const SECONDARY_CTA = [
  "inline-flex",
  "items-center",
  "justify-center",
  "gap-2",
  "rounded-full",
  "border",
  "border-border-emphasis",
  "px-6",
  "py-3",
  "font-semibold",
  "text-text-primary",
  "transition-colors",
  "duration-200",
  "hover:border-accent",
  "hover:text-accent",
  "focus-visible:outline-none",
  "focus-visible:ring-2",
  "focus-visible:ring-accent",
  "focus-visible:ring-offset-2",
  "focus-visible:ring-offset-surface",
].join(" ");

const ACTIVITY_BARS = [40, 65, 45, 80, 55, 90, 70];

const DashboardPreview = () => (
  <div
    role="img"
    aria-label="Preview of the member dashboard showing an active quarterly membership, the next payment, a renewal reminder, weekly activity, and a receipt."
    className="relative mx-auto w-full max-w-md motion-safe:animate-fade-in-up"
  >
    <div
      aria-hidden="true"
      className="absolute -inset-5 rounded-[2rem] bg-accent/10 blur-2xl"
    />
    <div className="relative overflow-hidden rounded-3xl border border-border bg-surface-raised/95 p-5 shadow-2xl shadow-black/30 backdrop-blur">
      <div className="flex items-center justify-between gap-3 border-b border-border pb-4">
        <div className="flex min-w-0 items-center gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-accent/10 text-accent">
            <CalendarCheck size={20} aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">Member overview</p>
            <p className="truncate text-xs text-text-tertiary">
              Updated just now
            </p>
          </div>
        </div>
        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-success/30 bg-success/10 px-2.5 py-1 text-xs font-semibold text-success">
          <span aria-hidden="true" className="size-1.5 rounded-full bg-success" />
          Active
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 pt-4">
        <div className="rounded-2xl border border-border bg-surface p-4">
          <p className="text-xs text-text-tertiary">Current plan</p>
          <p className="mt-1 text-lg font-bold">Quarterly</p>
          <p className="text-xs text-text-secondary">Renews Dec 20</p>
        </div>
        <div className="rounded-2xl border border-border bg-surface p-4">
          <p className="text-xs text-text-tertiary">Next payment</p>
          <p className="mt-1 text-lg font-bold">MX$900</p>
          <p className="text-xs text-text-secondary">Dec 15</p>
        </div>
      </div>

      <div className="mt-3 rounded-2xl border border-warning/30 bg-warning/10 p-4">
        <div className="flex items-start gap-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-warning/15 text-warning">
            <Bell size={18} aria-hidden="true" />
          </span>
          <div>
            <p className="text-sm font-semibold text-text-primary">
              Your membership renews in 5 days
            </p>
            <p className="text-xs text-text-secondary">
              We will remind you again 24 hours before the charge.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-3 rounded-2xl border border-border bg-surface p-4">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-semibold">Weekly activity</p>
          <span className="inline-flex items-center gap-1 text-xs font-medium text-success">
            <TrendingUp size={14} aria-hidden="true" />
            +18%
          </span>
        </div>
        <div className="mt-3 flex h-16 items-end gap-1.5">
          {ACTIVITY_BARS.map((height, index) => (
            <span
              key={index}
              style={{ height: `${height}%` }}
              className="block w-full rounded-t bg-accent/30 last:bg-accent"
            />
          ))}
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between gap-3 rounded-2xl border border-border bg-surface px-4 py-3 text-xs">
        <span className="inline-flex items-center gap-1.5 text-text-secondary">
          <CreditCard size={14} aria-hidden="true" className="text-accent" />
          Last receipt ready
        </span>
        <span className="font-semibold text-accent">View</span>
      </div>
    </div>
  </div>
);

export const WelcomeHero = ({
  onRequestMembership,
}: WelcomeMembershipActionProps) => (
  <section
    id={WELCOME_SECTION_IDS.overview}
    aria-labelledby="welcome-hero-title"
    className="relative scroll-mt-24 overflow-hidden"
  >
    <div
      aria-hidden="true"
      className="pointer-events-none absolute -top-40 left-1/2 h-96 w-[42rem] max-w-full -translate-x-1/2 rounded-full bg-accent/15 blur-3xl"
    />
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] [background-size:4rem_4rem] opacity-20 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]"
    />

    <div className="relative mx-auto grid w-full max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 sm:py-24 tab:grid-cols-[1.05fr_0.95fr]">
      <div className="flex max-w-xl flex-col gap-6 motion-safe:animate-fade-in-up">
        <p className="inline-flex w-fit items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1.5 text-xs font-bold tracking-[0.16em] text-accent uppercase">
          <Sparkles size={14} aria-hidden="true" />
          Membership, made clear
        </p>

        <h1
          id="welcome-hero-title"
          className="text-4xl font-extrabold tracking-tight text-balance text-text-primary sm:text-5xl tab:text-6xl"
        >
          Everything your{" "}
          <span className="text-accent">membership</span> needs, in one place.
        </h1>

        <p className="text-lg leading-relaxed text-text-secondary">
          You already have the account. Activate your membership to unlock your
          profile, subscription, payments, activity log, and a community that
          keeps you moving.
        </p>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onRequestMembership}
            className={PRIMARY_CTA}
          >
            Become a member
            <ArrowRight size={18} aria-hidden="true" />
          </button>
          <a href={`#${WELCOME_SECTION_IDS.benefits}`} className={SECONDARY_CTA}>
            See what is included
          </a>
        </div>

        <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-text-secondary">
          {WELCOME_HERO_TRUST_POINTS.map((point) => (
            <li key={point} className="inline-flex items-center gap-1.5">
              <Check
                size={16}
                aria-hidden="true"
                className="shrink-0 text-success"
              />
              {point}
            </li>
          ))}
        </ul>
      </div>

      <DashboardPreview />
    </div>
  </section>
);
