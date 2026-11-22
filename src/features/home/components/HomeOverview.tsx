import { CommandBtn } from "@/components/buttons/Buttons";
import { Navbar } from "@/components/navbar/Navbar";
import { TableSkeleton } from "@/components/skeleton";
import {
  getHomeOverviewNavbarConfig,
  HOME_OVERVIEW_SECTION_IDS,
} from "@/features/home/services/HomeOverviewSections";
import { useExistsCurrentSubscription } from "@/features/subscription/hooks/useExistsSubscription";
import { RefreshCw } from "lucide-react";
import { lazy, Suspense } from "react";

const HomeMembershipShowcase = lazy(() =>
  import("@/features/home/components/HomeMembershipShowcase").then((mod) => ({
    default: mod.HomeMembershipShowcase,
  })),
);

const LastPaymentSection = lazy(() =>
  import("@/features/payment/components/LastPaymentSection").then((mod) => ({
    default: mod.LastPaymentSection,
  })),
);

const PaymentCurrentLayout = lazy(
  () => import("@/features/payment/layouts/PaymentCurrentLayout"),
);

const CurrentSubscriptionSection = lazy(() =>
  import("@/features/subscription/components/CurrentSubscriptionSection").then(
    (mod) => ({
      default: mod.CurrentSubscriptionSection,
    }),
  ),
);

const EXISTS_ERROR_MESSAGE = "Your membership status could not be loaded.";

const { lastPayment, payments, subscription } = HOME_OVERVIEW_SECTION_IDS;

const SectionSkeleton = ({ className = "h-32" }: { className?: string }) => (
  <div
    role="status"
    aria-label="Loading home overview section"
    aria-busy="true"
    className={`${className} animate-pulse rounded-2xl border border-border bg-surface-raised`}
  />
);

const HomeOverviewFallback = () => (
  <section
    role="status"
    aria-label="Loading home overview"
    aria-busy="true"
    className="flex w-full flex-1 flex-col gap-6"
  >
    <div
      aria-hidden="true"
      className="h-14 animate-pulse rounded-2xl border border-border bg-surface-raised"
    />
    <div
      aria-hidden="true"
      className="h-28 animate-pulse rounded-2xl border border-border bg-surface-raised"
    />
    <div
      aria-hidden="true"
      className="h-80 animate-pulse rounded-2xl border border-border bg-surface-raised"
    />
  </section>
);

const ShowcaseFallback = () => (
  <div
    role="status"
    aria-label="Loading membership showcase"
    aria-busy="true"
    className="flex flex-col gap-5"
  >
    <div
      aria-hidden="true"
      className="h-24 animate-pulse rounded-2xl border border-border bg-surface-raised"
    />
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 4 }, (_, index) => (
        <div
          key={index}
          aria-hidden="true"
          className="h-72 animate-pulse rounded-2xl border border-border bg-surface-raised"
        />
      ))}
    </div>
  </div>
);

const HomeOverview = () => {
  const { data, error, isPending, refetch } = useExistsCurrentSubscription();

  const exists = data?.data.exists;
  const errorMessage =
    error && exists === undefined
      ? (error.message ?? error.error ?? EXISTS_ERROR_MESSAGE)
      : null;

  if (isPending) {
    return <HomeOverviewFallback />;
  }

  if (errorMessage) {
    return (
      <section className="flex w-full flex-1 flex-col gap-6">
        <div
          role="alert"
          className="flex flex-col gap-4 rounded-2xl border border-danger/30 bg-danger/10 p-5"
        >
          <p className="text-sm text-danger">{errorMessage}</p>
          <div className="flex justify-end">
            <CommandBtn
              Icon={RefreshCw}
              onClick={() => void refetch()}
              aria-label="Retry loading your membership status."
            >
              Try again
            </CommandBtn>
          </div>
        </div>
      </section>
    );
  }

  if (exists === false) {
    return (
      <section
        className="flex w-full flex-1 flex-col gap-6"
        aria-labelledby="home-overview-heading"
      >
        <h1 id="home-overview-heading" className="sr-only">
          Overview
        </h1>

        <Suspense fallback={<ShowcaseFallback />}>
          <HomeMembershipShowcase />
        </Suspense>
      </section>
    );
  }

  return (
    <section
      className="flex w-full flex-1 flex-col gap-6 pb-4"
      aria-labelledby="home-overview-heading"
    >
      <h1 id="home-overview-heading" className="sr-only">
        Overview
      </h1>

      <Navbar
        {...getHomeOverviewNavbarConfig()}
        className="backdrop-blur-sm bg-surface/90"
      />

      <div className="flex flex-col gap-6">
        <section
          id={lastPayment}
          aria-labelledby="home-overview-last-payment-heading"
          className="flex scroll-mt-28 flex-col gap-3"
        >
          <header className="flex flex-col gap-1">
            <h2
              id="home-overview-last-payment-heading"
              className="text-lg font-semibold tracking-tight text-text-primary"
            >
              Last payment
            </h2>
            <p className="text-sm text-text-secondary">
              Your most recent charge and its current status.
            </p>
          </header>

          <Suspense fallback={<SectionSkeleton />}>
            <LastPaymentSection />
          </Suspense>
        </section>

        <section
          id={payments}
          aria-labelledby="home-overview-payments-heading"
          className="flex scroll-mt-28 flex-col gap-3"
        >
          <header className="flex flex-col gap-1">
            <h2
              id="home-overview-payments-heading"
              className="text-lg font-semibold tracking-tight text-text-primary"
            >
              My payments
            </h2>
            <p className="text-sm text-text-secondary">
              Browse every payment registered on your account.
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

        <section
          id={subscription}
          aria-labelledby="home-overview-subscription-heading"
          className="flex scroll-mt-28 flex-col gap-3"
        >
          <header className="flex flex-col gap-1">
            <h2
              id="home-overview-subscription-heading"
              className="text-lg font-semibold tracking-tight text-text-primary"
            >
              Current subscription
            </h2>
            <p className="text-sm text-text-secondary">
              Review the membership tied to your account and the actions
              available for its status.
            </p>
          </header>

          <Suspense fallback={<SectionSkeleton className="h-64" />}>
            <CurrentSubscriptionSection />
          </Suspense>
        </section>
      </div>
    </section>
  );
};

export default HomeOverview;
