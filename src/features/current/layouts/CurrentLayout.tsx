import { FormSkeleton } from "@/components/skeleton";
import type { CurrentUserResponse } from "@/features/current/types";
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
      {view === "profile" ? (
        <Suspense fallback={<CurrentCardsFallback />}>
          <div className="grid gap-5">
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
