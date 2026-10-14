import { FormSkeleton } from "@/components/skeleton";
import { UserForm } from "@/features/user/components/UserForm";
import { useUpdateUserFormHandler } from "@/features/user/hooks/useUpdateUserFormHandler";

export const UserUpdateForm = () => {
  const { fetch, mutation } = useUpdateUserFormHandler();
  const { isLoading, isFetchingError, fetchingError, result: user } = fetch;
  const { isPending, submit } = mutation;
  if (isLoading) {
    return <FormSkeleton showLegend fields={3} />;
  }

  if (isFetchingError || !user) {
    return (
      <p role="alert" className="text-sm text-danger" aria-live="polite">
        {fetchingError?.message ?? "User could not be loaded"}
      </p>
    );
  }

  return (
    <UserForm
      isPending={isPending || isLoading}
      onSubmit={submit}
      userData={user}
    />
  );
};
