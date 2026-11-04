import { Navbar } from "@/components/navbar/Navbar";
import { ChartSkeleton, TableSkeleton } from "@/components/skeleton";
import {
  getNavbarHrefSections,
  getNavbarSections,
} from "@/features/payment/services/payment-layout-navbar-sections";
import { lazy, Suspense } from "react";

const PaymentAnnualResumeCards = lazy(() =>
  import("@/features/payment/components/PaymentAnnualResumeCards").then(
    (mod) => ({ default: mod.PaymentAnnualResumeCards }),
  ),
);

const PaymentInvestmentEvolution = lazy(() =>
  import("@/features/payment/components/PaymentInvestmentEvolution").then(
    (mod) => ({ default: mod.PaymentInvestmentEvolution }),
  ),
);

const PaymentTable = lazy(() =>
  import("@/features/payment/components/PaymentTable").then((mod) => ({
    default: mod.PaymentTable,
  })),
);

const ResumeCardsFallback = () => (
  <div
    role="status"
    aria-label="Loading annual payment summary"
    aria-busy="true"
    className="grid gap-4 sm:grid-cols-2 tab:grid-cols-3 2xl:grid-cols-5"
  >
    {Array.from({ length: 5 }, (_, index) => (
      <div
        key={index}
        aria-hidden="true"
        className="h-40 animate-pulse rounded-2xl border border-border bg-surface-raised"
      />
    ))}
  </div>
);

const [resume, investmentEvolution, payments] = getNavbarHrefSections();

export const PaymentAdministrationLayout = () => {
  return (
    <section
      className="relative flex h-full min-h-0 w-full flex-col gap-6 overflow-y-auto overscroll-contain pr-2 [scrollbar-color:var(--color-border)_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border"
      aria-labelledby="payment-administration-heading"
    >
      <Navbar {...getNavbarSections()} className="backdrop-blur-sm bg-surface/90" />

      <div className="flex min-h-0 flex-1 flex-col gap-6 pb-2">
        <section
          className="flex flex-col gap-3"
          aria-labelledby="payment-summary-heading"
          id={resume}
        >
          <div className="flex flex-col gap-1">
            <h2
              id="payment-summary-heading"
              className="text-lg font-semibold tracking-tight text-text-primary"
            >
              Annual summary
            </h2>
            <p className="text-sm text-text-secondary">
              Consolidated payment activity for the current year.
            </p>
          </div>

          <Suspense fallback={<ResumeCardsFallback />}>
            <PaymentAnnualResumeCards />
          </Suspense>
        </section>

        <section
          className="flex flex-col gap-3"
          aria-labelledby="payment-evolution-heading"
          id={investmentEvolution}
        >
          <div className="flex flex-col gap-1">
            <h2
              id="payment-evolution-heading"
              className="text-lg font-semibold tracking-tight text-text-primary"
            >
              Investment evolution
            </h2>
            <p className="text-sm text-text-secondary">
              Month-by-month comparison of the amount invested in payments.
            </p>
          </div>

          <Suspense
            fallback={
              <ChartSkeleton
                variant="line"
                height={320}
                showLegend={false}
                aria-label="Loading payment investment evolution"
              />
            }
          >
            <PaymentInvestmentEvolution />
          </Suspense>
        </section>

        <section
          className="flex flex-col gap-3"
          aria-labelledby="payment-history-heading"
          id={payments}
        >
          <div className="flex flex-col gap-1">
            <h2
              id="payment-history-heading"
              className="text-lg font-semibold tracking-tight text-text-primary"
            >
              Payment history
            </h2>
            <p className="text-sm text-text-secondary">
              Search, sort, and review every payment registered in the system.
            </p>
          </div>

          <Suspense
            fallback={
              <TableSkeleton
                columns={3}
                rows={5}
                size="sm"
                responsive="cards"
                aria-label="Loading payments table"
              />
            }
          >
            <PaymentTable />
          </Suspense>
        </section>
      </div>
    </section>
  );
};
