import { UserConfirmDialog } from "@/features/user/components/UserConfirmDialog";
import { useConfirmActionUserHandler } from "@/features/user/hooks/useConfirmActionUserHandler";
import {
  useDeleteUser,
  useHardDeleteUser,
  useRecoverUser,
} from "@/features/user/hooks/useMutateUser";


export const UserRecoverDialog = () => {
  const { error, handleOnCancel, isPending, submit } = useConfirmActionUserHandler({
    hook: useRecoverUser,
    variant: "recover"
  })

  return (
    <UserConfirmDialog
      variant="recover"
      isPending={isPending}
      error={error?.message ?? null}
      onCancel={handleOnCancel}
      onConfirmSubmit={submit}
    />
  );
};

export const UserDeleteDialog = () => {
const { error, handleOnCancel, isPending, submit } =
  useConfirmActionUserHandler({
    hook: useDeleteUser,
    variant: "delete",
  });

  return (
    <UserConfirmDialog
      variant="delete"
      isPending={isPending}
      error={error?.message ?? null}
      onCancel={handleOnCancel}
      onConfirmSubmit={submit}
    />
  );
};

export const UserHardDeleteDialog = () => {
  const { error, handleOnCancel, isPending, submit } =
    useConfirmActionUserHandler({
      hook: useHardDeleteUser,
      variant: "hard-delete",
    });

  
  return (
    <UserConfirmDialog
      variant="hard-delete"
      isPending={isPending}
      error={error?.message ?? null}
      onCancel={handleOnCancel}
      onConfirmSubmit={submit}
    />
  );
};
