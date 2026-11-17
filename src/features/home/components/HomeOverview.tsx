import { Home } from "lucide-react";

const HomeOverview = () => {
  return (
    <section
      className="flex w-full flex-1 flex-col gap-6"
      aria-labelledby="home-overview-heading"
    >
      <header className="flex flex-col gap-2">
        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent">
          <Home size={14} aria-hidden="true" />
          Member area
        </span>
        <h1
          id="home-overview-heading"
          className="text-3xl font-bold tracking-tight text-text-primary"
        >
          Overview
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-text-secondary">
          Welcome back. Review your membership, payments, and community activity
          from one place.
        </p>
      </header>
    </section>
  );
};

export default HomeOverview;
