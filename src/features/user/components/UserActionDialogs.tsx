import { UserConfirmDialog } from "@/features/user/components/UserConfirmDialog";
import {
  useConfirmActionUserHandler,
  type UseConfirmActionUserArgs,
} from "@/features/user/hooks/useConfirmActionUserHandler";
import {
  useDeleteUser,
  useHardDeleteUser,
  useRecoverUser,
} from "@/features/user/hooks/useMutateUser";

export type UserActionDialogProps = Pick<
  UseConfirmActionUserArgs,
  "hook" | "variant"
>;

const UserActionDialog = ({ hook, variant }: UserActionDialogProps) => {
  const { error, handleOnCancel, isPending, submit } =
    useConfirmActionUserHandler({ hook, variant });

  return (
    <UserConfirmDialog
      variant={variant}
      isPending={isPending}
      error={error?.message ?? null}
      onCancel={handleOnCancel}
      onConfirmSubmit={submit}
    />
  );
};

export const UserRecoverDialog = () => (
  <UserActionDialog hook={useRecoverUser} variant="recover" />
);

export const UserDeleteDialog = () => (
  <UserActionDialog hook={useDeleteUser} variant="delete" />
);

export const UserHardDeleteDialog = () => (
  <UserActionDialog hook={useHardDeleteUser} variant="hard-delete" />
);
