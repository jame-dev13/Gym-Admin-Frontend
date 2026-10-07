import { UserForm } from "@/features/user/components/UserForm";
import { useCreateUser } from "@/features/user/hooks/useMutateUser";
import type { UserRequest, UserResponse } from "@/features/user/types";

export interface UserCreateFormProps {
  initialValues?: Partial<UserRequest>;
  onSuccess?: (user: UserResponse) => void;
  onCancel?: () => void;
}

export const UserCreateForm = ({
  initialValues,
  onSuccess,
  onCancel,
}: UserCreateFormProps) => {
  const { mutate, isPending, error } = useCreateUser();

  return (
    <UserForm
      mode="create"
      initialValues={initialValues}
      isPending={isPending}
      serverError={error?.message ?? null}
      onCancel={onCancel}
      onSubmit={(values) => {
        mutate(values, {
          onSuccess: (response) => {
            if (response.payload) onSuccess?.(response.payload);
          },
        });
      }}
    />
  );
};
