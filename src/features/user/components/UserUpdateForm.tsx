import { UserForm } from "@/features/user/components/UserForm";
import { useGetUser } from "@/features/user/hooks/useFetchUser";
import { useUpdateUser } from "@/features/user/hooks/useMutateUser";
import type { UserResponse } from "@/features/user/types";
import type { Identifiable } from "@/types/Types";

export interface UserUpdateFormProps {
  id: Identifiable;
  onSuccess?: (user: UserResponse) => void;
  onCancel?: () => void;
}

export const UserUpdateForm = ({ id, onSuccess, onCancel }: UserUpdateFormProps) => {
  const { data, isLoading, isError, error } = useGetUser(id);
  const update = useUpdateUser(id);

  if (!id.id) {
    throw new Error("User id is required");
  }

  if (isLoading) {
    return <p aria-live="polite">Loading user…</p>;
  }

  if (isError || !data?.data) {
    return (
      <p role="alert" className="text-sm text-danger">
        {error?.message ?? "User could not be loaded"}
      </p>
    );
  }

  const user = data.data;

  return (
    <UserForm
      mode="update"
      initialValues={{ name: user.name, email: user.email, roles: [...user.roles] }}
      isPending={update.isPending}
      serverError={update.error?.message ?? null}
      onCancel={onCancel}
      onSubmit={(values) => {
        update.mutate(values, {
          onSuccess: (response) => {
            if (response.payload) onSuccess?.(response.payload);
          },
        });
      }}
    />
  );
};
