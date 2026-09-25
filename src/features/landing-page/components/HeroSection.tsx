import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Reveal } from "@/features/landing-page/components/Reveal";
import { LANDING_SECTION_IDS } from "@/features/landing-page/services/SectionIds";

const stats = [
  { value: "+2,500", label: "active members" },
  { value: "+40", label: "classes every week" },
  { value: "15", label: "certified trainers" },
];

export const HeroSection = () => (
  <section
    id={LANDING_SECTION_IDS.hero}
    aria-labelledby="hero-title"
    className="relative scroll-mt-20 overflow-hidden"
  >
    <div
      aria-hidden="true"
      className="landing-glow-pulse pointer-events-none absolute -top-32 left-1/2 h-96 w-[42rem] -translate-x-1/2 rounded-full bg-accent/15 blur-3xl"
    />
    <div className="relative mx-auto flex w-full max-w-6xl flex-col items-center gap-8 px-4 py-20 text-center sm:py-28">
      <Reveal>
        <p className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-raised px-4 py-1.5 text-sm text-text-secondary">
          <span aria-hidden="true" className="size-2 rounded-full bg-success" />
          Enrollment open all year
        </p>
      </Reveal>
      <Reveal delay={100}>
        <h1
          id="hero-title"
          className="max-w-3xl text-4xl font-extrabold tracking-tight text-balance sm:text-6xl"
        >
          Your best self starts with one{" "}
          <span className="text-accent">decision</span>
        </h1>
      </Reveal>
      <Reveal delay={200}>
        <p className="max-w-2xl text-lg text-text-secondary">
          Modern equipment, certified trainers, and group classes every day.
          Pick the membership that fits your pace and start today.
        </p>
      </Reveal>
      <Reveal delay={300}>
        <div className="flex flex-col items-center gap-3 sm:flex-row">
          <a
            href={`#${LANDING_SECTION_IDS.pricing}`}
            className="inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3 font-semibold text-surface transition hover:bg-accent-emphasis"
          >
            View memberships
            <ArrowRight size={18} aria-hidden="true" />
          </a>
          <Link
            to="/auth/register"
            className="inline-flex items-center gap-2 rounded-full border border-border-emphasis px-7 py-3 font-semibold text-text-primary transition hover:border-accent hover:text-accent"
          >
            Create free account
          </Link>
        </div>
      </Reveal>
      <Reveal delay={400}>
        <dl className="flex flex-col items-center gap-6 pt-4 sm:flex-row sm:gap-12">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center gap-1">
              <dt className="order-2 text-sm text-text-secondary">{stat.label}</dt>
              <dd className="order-1 text-3xl font-extrabold text-text-primary">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      </Reveal>
    </div>
  </section>
);
