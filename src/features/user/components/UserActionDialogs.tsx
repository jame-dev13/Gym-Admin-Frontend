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
import type { Identifiable } from "@/types/Types";

export type UserActionDialogProps = Pick<
  UseConfirmActionUserArgs,
  "hook" | "variant"
> & {
  userId: Identifiable["id"];
};

export type UserActionDialogContentProps = {
  userId: Identifiable["id"];
};

const UserActionDialog = ({ hook, variant, userId }: UserActionDialogProps) => {
  const { error, handleOnCancel, isPending, submit } =
    useConfirmActionUserHandler({ hook, variant, userId });

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

export const UserRecoverDialog = ({ userId }: UserActionDialogContentProps) => (
  <UserActionDialog hook={useRecoverUser} variant="recover" userId={userId} />
);

export const UserDeleteDialog = ({ userId }: UserActionDialogContentProps) => (
  <UserActionDialog hook={useDeleteUser} variant="delete" userId={userId} />
);

export const UserHardDeleteDialog = ({
  userId,
}: UserActionDialogContentProps) => (
  <UserActionDialog
    hook={useHardDeleteUser}
    variant="hard-delete"
    userId={userId}
  />
);
