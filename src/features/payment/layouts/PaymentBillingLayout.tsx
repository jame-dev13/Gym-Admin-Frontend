import { Navbar } from "@/components/navbar/Navbar";
import { ChartSkeleton, TableSkeleton } from "@/components/skeleton";
import {
  getPaymentCurrentNavbarConfig,
  PAYMENT_CURRENT_SECTION_IDS,
} from "@/features/payment/services/payment-current-navbar-sections";
import { lazy, Suspense } from "react";

const PaymentCurrentAnnualResumeCards = lazy(() =>
  import("@/features/payment/components/PaymentCurrentAnnualResumeCards").then(
    (mod) => ({ default: mod.PaymentCurrentAnnualResumeCards }),
  ),
);

const PaymentCurrentEvolution = lazy(() =>
  import("@/features/payment/components/PaymentCurrentEvolution").then(
    (mod) => ({ default: mod.PaymentCurrentEvolution }),
  ),
);

const PaymentCurrentLayout = lazy(
  () => import("@/features/payment/layouts/PaymentCurrentLayout"),
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

const { resume, evolution, payments } = PAYMENT_CURRENT_SECTION_IDS;

export const PaymentBillingLayout = () => {
  return (
    <section
      className="relative flex h-full min-h-0 w-full flex-col gap-6 overflow-y-auto overscroll-contain pr-2 [scrollbar-color:var(--color-border)_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border"
      aria-labelledby="payment-billing-heading"
    >
      <h1 id="payment-billing-heading" className="sr-only">
        Payments
      </h1>

      <Navbar
        {...getPaymentCurrentNavbarConfig()}
        className="backdrop-blur-sm bg-surface/90"
      />

      <div className="flex min-w-0 flex-col gap-6 pb-2">
        <section
          id={resume}
          aria-labelledby="payment-current-summary-heading"
          className="flex min-w-0 scroll-mt-28 flex-col gap-3"
        >
          <header className="flex flex-col gap-1">
            <h2
              id="payment-current-summary-heading"
              className="text-lg font-semibold tracking-tight text-text-primary"
            >
              Annual summary
            </h2>
            <p className="text-sm text-text-secondary">
              Consolidated payment activity for the current year.
            </p>
          </header>

          <Suspense fallback={<ResumeCardsFallback />}>
            <PaymentCurrentAnnualResumeCards />
          </Suspense>
        </section>

        <section
          id={evolution}
          aria-labelledby="payment-current-evolution-heading"
          className="flex min-w-0 scroll-mt-28 flex-col gap-3"
        >
          <header className="flex flex-col gap-1">
            <h2
              id="payment-current-evolution-heading"
              className="text-lg font-semibold tracking-tight text-text-primary"
            >
              Billing evolution
            </h2>
            <p className="text-sm text-text-secondary">
              Month-by-month comparison of the amount you have invested in
              payments.
            </p>
          </header>

          <Suspense
            fallback={
              <ChartSkeleton
                variant="line"
                height={320}
                showLegend={false}
                aria-label="Loading billing evolution"
              />
            }
          >
            <PaymentCurrentEvolution />
          </Suspense>
        </section>

        <section
          id={payments}
          aria-labelledby="payment-current-history-heading"
          className="flex min-w-0 scroll-mt-28 flex-col gap-3"
        >
          <header className="flex flex-col gap-1">
            <h2
              id="payment-current-history-heading"
              className="text-lg font-semibold tracking-tight text-text-primary"
            >
              Payment history
            </h2>
            <p className="text-sm text-text-secondary">
              Search, sort, and review every payment registered on your account.
            </p>
          </header>

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
            <PaymentCurrentLayout />
          </Suspense>
        </section>
      </div>
    </section>
  );
};
