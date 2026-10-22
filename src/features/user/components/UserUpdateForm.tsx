import { FormSkeleton } from "@/components/skeleton";
import { UserForm } from "@/features/user/components/UserForm";
import { useUpdateUserFormHandler } from "@/features/user/hooks/useUpdateUserFormHandler";
import type { Identifiable } from "@/types/Types";

export type UserUpdateFormProps = {
  userId: Identifiable["id"];
};

export const UserUpdateForm = ({ userId }: UserUpdateFormProps) => {
  const { fetch, mutation } = useUpdateUserFormHandler(userId);
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
      mode="update"
      data={user}
    />
  );
};
