import { UserForm } from "@/features/user/components/UserForm";
import { useCreateUserFormHandler } from "@/features/user/hooks/useCreateUserFormHandler";

export const UserCreateForm = () => {
  const { isPending, submit } = useCreateUserFormHandler();

  return <UserForm mode="create" isPending={isPending} onSubmit={submit} />;
};
