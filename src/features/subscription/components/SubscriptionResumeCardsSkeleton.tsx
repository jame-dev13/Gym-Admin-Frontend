const CARD_COUNT = 4;

export const SubscriptionResumeCardsSkeleton = () => (
  <div
    role="status"
    aria-label="Loading subscription annual summary"
    aria-busy="true"
    className="grid gap-4 sm:grid-cols-2 tab:grid-cols-4"
  >
    {Array.from({ length: CARD_COUNT }, (_, index) => (
      <div
        key={index}
        aria-hidden="true"
        className="h-36 animate-pulse rounded-2xl border border-border bg-surface-raised"
      />
    ))}
  </div>
);
