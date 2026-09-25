import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Reveal } from "@/features/landing-page/components/Reveal";

export const CtaSection = () => (
  <section aria-labelledby="cta-title" className="border-t border-border">
    <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:py-20">
      <Reveal>
        <div className="relative flex flex-col items-center gap-5 overflow-hidden rounded-3xl border border-accent/30 bg-surface-raised px-6 py-14 text-center">
          <div
            aria-hidden="true"
            className="landing-glow-pulse pointer-events-none absolute -top-24 left-1/2 h-64 w-[36rem] -translate-x-1/2 rounded-full bg-accent/20 blur-3xl"
          />
          <h2 id="cta-title" className="relative max-w-2xl text-3xl font-extrabold tracking-tight text-balance sm:text-4xl">
            The first step is the hardest. We help with the rest.
          </h2>
          <p className="relative max-w-xl text-lg text-text-secondary">
            Create your free account today and pick your membership when ready.
            No sign-up fees, no commitment.
          </p>
          <Link
            to="/auth/register"
            className="relative inline-flex items-center gap-2 rounded-full bg-accent px-8 py-3.5 text-lg font-semibold text-surface transition hover:bg-accent-emphasis"
          >
            Join now
            <ArrowRight size={20} aria-hidden="true" />
          </Link>
        </div>
      </Reveal>
    </div>
  </section>
);

export const LandingFooter = () => (
  <footer className="border-t border-border bg-surface-raised/40">
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-10 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-text-secondary">
        © {new Date().getFullYear()} Gym Admin. All rights reserved.
      </p>
      <nav aria-label="Footer links" className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
        <Link to="/auth/login" className="text-text-secondary transition-colors hover:text-accent">
          Log in
        </Link>
        <Link to="/auth/register" className="text-text-secondary transition-colors hover:text-accent">
          Create account
        </Link>
      </nav>
    </div>
  </footer>
);
