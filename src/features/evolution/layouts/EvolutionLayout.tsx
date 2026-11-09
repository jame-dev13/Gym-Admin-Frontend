import { Activity, TrendingUp } from "lucide-react";
import { lazy, Suspense, useMemo, useState } from "react";
import { Select } from "@/components/input/Select";
import { Navbar } from "@/components/navbar/Navbar";
import { getEvolutionYearOptions } from "@/features/evolution/services/evolution-chart-data";
import {
  EVOLUTION_SECTION_IDS,
  getEvolutionNavbarConfig,
} from "@/features/evolution/services/evolution-navbar-config";
import { FormSkeleton } from "@/components/skeleton";

const BillingEvolutionCard = lazy(() =>
  import("@/features/evolution/components/BillingEvolutionCard").then(
    (mod) => ({ default: mod.BillingEvolutionCard }),
  ),
);
const CustomerEvolutionCard = lazy(() =>
  import("@/features/evolution/components/CustomerEvolutionCard").then(
    (mod) => ({ default: mod.CustomerEvolutionCard }),
  ),
);
const SubscriberEvolutionCard = lazy(() =>
  import("@/features/evolution/components/SubscriberEvolutionCard").then(
    (mod) => ({ default: mod.SubscriberEvolutionCard }),
  ),
);

export const EvolutionLayout = () => {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);

  const yearOptions = useMemo(
    () =>
      getEvolutionYearOptions(currentYear).map((year) => ({
        label: String(year),
        value: String(year),
      })),
    [currentYear],
  );

  const handleYearChange = (value: string) => {
    const year = Number(value);
    if (Number.isFinite(year)) {
      setSelectedYear(year);
    }
  };

  return (
    <section className="flex w-full flex-col gap-6">
      <Navbar
        {...getEvolutionNavbarConfig()}
        className="backdrop-blur-sm bg-surface/90"
      />

      <header
        aria-labelledby="evolution-overview-heading"
        className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between"
      >
        <div className="flex flex-col gap-2">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent">
            <TrendingUp size={14} aria-hidden="true" />
            Growth metrics
          </span>
          <h1
            id="evolution-overview-heading"
            className="text-3xl font-bold tracking-tight text-text-primary"
          >
            Evolution overview
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-text-secondary">
            Follow how customers, subscribers, and billed revenue evolved month
            by month across the selected year.
          </p>
        </div>

        <div className="w-full max-w-44 shrink-0">
          <Select
            label="Year"
            aria-label="Select evolution year"
            options={yearOptions}
            value={String(selectedYear)}
            onChange={(event) => handleYearChange(event.currentTarget.value)}
          />
        </div>
      </header>

      <section
        id={EVOLUTION_SECTION_IDS.customers}
        aria-labelledby="evolution-customers-heading"
        className="flex scroll-mt-24 flex-col gap-3"
      >
        <div className="flex flex-col gap-1">
          <h2
            id="evolution-customers-heading"
            className="text-lg font-semibold tracking-tight text-text-primary"
          >
            Customers
          </h2>
          <p className="text-sm text-text-secondary">
            Monthly customer joins and downs for the selected year.
          </p>
        </div>

        <Suspense fallback={<FormSkeleton showSubmit={false} />}>
          <CustomerEvolutionCard year={selectedYear} />
        </Suspense>
      </section>

      <section
        id={EVOLUTION_SECTION_IDS.subscribers}
        aria-labelledby="evolution-subscribers-heading"
        className="flex scroll-mt-24 flex-col gap-3"
      >
        <div className="flex flex-col gap-1">
          <h2
            id="evolution-subscribers-heading"
            className="text-lg font-semibold tracking-tight text-text-primary"
          >
            Subscribers
          </h2>
          <p className="text-sm text-text-secondary">
            Monthly subscriber joins and downs for the selected year.
          </p>
        </div>
        <Suspense fallback={<FormSkeleton showSubmit={false} />}>
          <SubscriberEvolutionCard year={selectedYear} />
        </Suspense>
      </section>

      <section
        id={EVOLUTION_SECTION_IDS.revenue}
        aria-labelledby="evolution-revenue-heading"
        className="flex scroll-mt-24 flex-col gap-3"
      >
        <div className="flex items-center gap-2">
          <Activity size={16} aria-hidden="true" className="text-accent" />
          <div className="flex flex-col gap-1">
            <h2
              id="evolution-revenue-heading"
              className="text-lg font-semibold tracking-tight text-text-primary"
            >
              Revenue
            </h2>
            <p className="text-sm text-text-secondary">
              Billed revenue accumulated throughout the selected year.
            </p>
          </div>
        </div>

        <Suspense fallback={<FormSkeleton showSubmit={false} />}>
          <BillingEvolutionCard year={selectedYear} />
        </Suspense>
      </section>
    </section>
  );
};
