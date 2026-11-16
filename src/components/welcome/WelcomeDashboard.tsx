import {
  Activity,
  Bell,
  CreditCard,
  ListChecks,
  MessageSquare,
  Star,
} from "lucide-react";
import { WELCOME_DASHBOARD_FEATURES } from "@/components/welcome/WelcomeContent";
import { WelcomeSectionHeader } from "@/components/welcome/WelcomeSectionHeader";
import { WELCOME_SECTION_IDS } from "@/components/welcome/WelcomeSectionIds";

const DASHBOARD_MOCK = "rounded-2xl border border-border bg-surface-raised p-4";

const DashboardMock = () => (
  <div aria-hidden="true" className="relative mx-auto w-full max-w-md">
    <div className="absolute -inset-5 rounded-[2rem] bg-accent/10 blur-2xl" />

    <div className="relative flex flex-col gap-3">
      <div className={`${DASHBOARD_MOCK} shadow-xl shadow-black/20`}>
        <div className="flex items-center justify-between gap-3">
          <p className="inline-flex items-center gap-2 text-sm font-semibold">
            <Bell size={16} className="text-accent" />
            Notifications
          </p>
          <span className="rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-bold text-accent uppercase">
            3 new
          </span>
        </div>
        <ul className="mt-3 flex flex-col gap-2">
          <li className="flex items-start gap-2.5 rounded-xl border border-warning/25 bg-warning/10 px-3 py-2.5">
            <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-warning" />
            <p className="text-xs leading-relaxed text-text-secondary">
              Your membership ends in{" "}
              <strong className="text-text-primary">5 days</strong>.
            </p>
          </li>
          <li className="flex items-start gap-2.5 rounded-xl border border-success/25 bg-success/10 px-3 py-2.5">
            <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-success" />
            <p className="text-xs leading-relaxed text-text-secondary">
              Payment confirmed:{" "}
              <strong className="text-text-primary">MX$900</strong>.
            </p>
          </li>
          <li className="flex items-start gap-2.5 rounded-xl border border-accent/25 bg-accent/10 px-3 py-2.5">
            <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent" />
            <p className="text-xs leading-relaxed text-text-secondary">
              New reply to your review.
            </p>
          </li>
        </ul>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className={DASHBOARD_MOCK}>
          <p className="inline-flex items-center gap-2 text-xs font-semibold">
            <ListChecks size={15} className="text-accent" />
            Your log
          </p>
          <ul className="mt-3 flex flex-col gap-2.5 text-[11px] text-text-secondary">
            <li className="flex items-center gap-2">
              <Activity size={12} className="shrink-0 text-success" />
              Check-in · today
            </li>
            <li className="flex items-center gap-2">
              <Activity size={12} className="shrink-0 text-accent" />
              Profile updated
            </li>
            <li className="flex items-center gap-2">
              <Activity size={12} className="shrink-0 text-text-tertiary" />
              Plan renewed
            </li>
          </ul>
        </div>

        <div className={DASHBOARD_MOCK}>
          <p className="inline-flex items-center gap-2 text-xs font-semibold">
            <CreditCard size={15} className="text-accent" />
            Payments
          </p>
          <p className="mt-3 text-xl font-extrabold tracking-tight">MX$900</p>
          <p className="text-[11px] text-text-secondary">Quarterly plan</p>
          <p className="mt-3 inline-flex items-center gap-1 text-[11px] font-semibold text-accent">
            Receipt ready
          </p>
        </div>
      </div>

      <div className={DASHBOARD_MOCK}>
        <div className="flex items-center justify-between gap-3">
          <p className="inline-flex items-center gap-2 text-xs font-semibold">
            <MessageSquare size={15} className="text-accent" />
            Community
          </p>
          <span className="flex gap-0.5 text-warning">
            {Array.from({ length: 5 }, (_, index) => (
              <Star
                key={index}
                size={11}
                fill="currentColor"
                className={index < 4 ? "" : "opacity-25"}
              />
            ))}
          </span>
        </div>
        <p className="mt-2 text-xs leading-relaxed text-text-secondary">
          “The reminders keep me on track. Renewing took two minutes.”
        </p>
        <p className="mt-2 text-[11px] font-semibold text-text-primary">
          Mariana G.
        </p>
      </div>
    </div>
  </div>
);

export const WelcomeDashboard = () => (
  <section
    id={WELCOME_SECTION_IDS.dashboard}
    aria-labelledby="welcome-dashboard-title"
    className="scroll-mt-24 border-t border-border"
  >
    <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 sm:py-20 tab:grid-cols-[1fr_0.9fr]">
      <div className="flex flex-col gap-9">
        <WelcomeSectionHeader
          id="welcome-dashboard-title"
          eyebrow="Your dashboard"
          title="One dashboard, zero guesswork."
          description="From your next payment to the reply on your latest review, everything you need to manage your membership lives in one place."
        />

        <ul className="grid gap-5 sm:grid-cols-2">
          {WELCOME_DASHBOARD_FEATURES.map((feature) => (
            <li key={feature.title} className="flex gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-border bg-surface-raised text-accent">
                <feature.Icon size={20} aria-hidden="true" />
              </span>
              <div className="flex flex-col gap-1">
                <h3 className="text-sm font-semibold text-text-primary">
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed text-text-secondary">
                  {feature.description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <DashboardMock />
    </div>
  </section>
);
