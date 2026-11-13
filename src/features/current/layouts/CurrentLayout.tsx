import { FormSkeleton } from "@/components/skeleton";
import type { CurrentUserResponse } from "@/features/current/types";
import { UserRound } from "lucide-react";
import { lazy, Suspense, useCallback, useState } from "react";

const CurrentUserSectionCard = lazy(() =>
  import("@/features/current/components/CurrentUserSectionCard").then((mod) => ({
    default: mod.CurrentUserSectionCard,
  })),
);

const CurrentUserEditForm = lazy(() =>
  import("@/features/current/components/CurrentUserEditForm").then((mod) => ({
    default: mod.CurrentUserEditForm,
  })),
);

type CurrentView = "profile" | "edit";

const CurrentCardsFallback = () => (
  <div
    role="status"
    aria-label="Loading current user information"
    aria-busy="true"
    className="grid gap-5 tab:grid-cols-2"
  >
    {Array.from({ length: 2 }, (_, index) => (
      <div
        key={index}
        aria-hidden="true"
        className="h-64 animate-pulse rounded-2xl border border-border bg-surface-raised"
      />
    ))}
  </div>
);

export const CurrentLayout = () => {
  const [view, setView] = useState<CurrentView>("profile");
  const [selectedUser, setSelectedUser] = useState<CurrentUserResponse | null>(
    null,
  );

  const showProfile = useCallback(() => {
    setView("profile");
  }, []);

  const showEditForm = useCallback((user: CurrentUserResponse) => {
    setSelectedUser(user);
    setView("edit");
  }, []);

  return (
    <section
      aria-labelledby="current-user-heading"
      className="flex w-full flex-1 flex-col gap-6"
    >
      <header className="flex flex-col gap-2">
        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent">
          <UserRound size={14} aria-hidden="true" />
          Current user
        </span>
        <h1
          id="current-user-heading"
          className="text-3xl font-bold tracking-tight text-text-primary"
        >
          Your profile
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-text-secondary">
          Review the information tied to your account and keep your personal
          details up to date.
        </p>
      </header>

      {view === "profile" ? (
        <Suspense fallback={<CurrentCardsFallback />}>
          <div className="grid gap-5 tab:grid-cols-2">
            <CurrentUserSectionCard onEdit={showEditForm} />
          </div>
        </Suspense>
      ) : (
        <Suspense
          fallback={
            <FormSkeleton
              fields={3}
              aria-label="Loading current user edit form"
            />
          }
        >
          {selectedUser && (
            <CurrentUserEditForm
              user={selectedUser}
              onCancel={showProfile}
              onExit={showProfile}
            />
          )}
        </Suspense>
      )}
    </section>
  );
};

export default CurrentLayout;
