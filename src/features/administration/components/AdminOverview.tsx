import { TableSkeleton } from "@/components/skeleton";
import { AdministrationOverviewInsights } from "@/features/administration/components/AdministrationOverviewInsights";
import { AdministrationQuickActions } from "@/features/administration/components/AdministrationQuickActions";
import { lazy, Suspense } from "react";

const SubsAboutToEndTable = lazy(() => import("@/features/subscription/index"));

const AdminOverview = () => {
  return (
    <section
      className="flex h-full min-h-0 w-full flex-col gap-4 overflow-y-auto overscroll-contain pr-2 [scrollbar-color:var(--color-border)_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border"
      aria-labelledby="administration-heading"
    >
      <AdministrationQuickActions />

      <div className="flex min-h-0 flex-1 flex-col gap-6">
        <section
          className="flex flex-col gap-3"
          aria-labelledby="administration-summary-heading"
        >
          <div className="flex flex-col gap-1">
            <h2
              id="administration-summary-heading"
              className="text-lg font-semibold tracking-tight text-text-primary"
            >
              Summary
            </h2>
            <p className="text-sm text-text-secondary">
              Key metrics for the gym at a glance.
            </p>
          </div>

          <AdministrationOverviewInsights />
        </section>

        <section
          className="flex flex-col gap-3"
          aria-labelledby="administration-expiring-heading"
        >
          <div className="flex flex-col gap-1">
            <h2
              id="administration-expiring-heading"
              className="text-lg font-semibold tracking-tight text-text-primary"
            >
              Subscriptions ending soon
            </h2>
            <p className="text-sm text-text-secondary">
              Memberships that are about to expire.
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-border bg-surface-raised">
            <Suspense
              fallback={
                <TableSkeleton
                  size="sm"
                  columns={3}
                  rows={3}
                  responsive="cards"
                />
              }
            >
              <SubsAboutToEndTable />
            </Suspense>
          </div>
        </section>
      </div>
    </section>
  );
};

export default AdminOverview;
