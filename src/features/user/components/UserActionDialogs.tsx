import { UserConfirmDialog } from "@/features/user/components/UserConfirmDialog";
import {
  useDeleteUser,
  useHardDeleteUser,
  useRecoverUser,
} from "@/features/user/hooks/useMutateUser";
import type { Identifiable } from "@/types/Types";

export interface UserActionDialogProps {
  id: Identifiable;
  userName: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const requireId = (id: Identifiable) => {
  if (!id.id) {
    throw new Error("User id is required");
  }
};

export const UserRecoverDialog = ({
  id,
  userName,
  onSuccess,
  onCancel,
}: UserActionDialogProps) => {
  const { mutate, isPending, error } = useRecoverUser(id);
  requireId(id);

  return (
    <UserConfirmDialog
      variant="recover"
      userName={userName}
      isPending={isPending}
      error={error?.message ?? null}
      onCancel={onCancel}
      onConfirm={() => {
        mutate(undefined, { onSuccess: () => onSuccess?.() });
      }}
    />
  );
};

export const UserDeleteDialog = ({
  id,
  userName,
  onSuccess,
  onCancel,
}: UserActionDialogProps) => {
  const { mutate, isPending, error } = useDeleteUser(id);
  requireId(id);

  return (
    <UserConfirmDialog
      variant="delete"
      userName={userName}
      isPending={isPending}
      error={error?.message ?? null}
      onCancel={onCancel}
      onConfirm={() => {
        mutate(undefined, { onSuccess: () => onSuccess?.() });
      }}
    />
  );
};

export const UserHardDeleteDialog = ({
  id,
  userName,
  onSuccess,
  onCancel,
}: UserActionDialogProps) => {
  const { mutate, isPending, error } = useHardDeleteUser(id);
  requireId(id);

  return (
    <UserConfirmDialog
      variant="hard-delete"
      userName={userName}
      isPending={isPending}
      error={error?.message ?? null}
      onCancel={onCancel}
      onConfirm={() => {
        mutate(undefined, { onSuccess: () => onSuccess?.() });
      }}
    />
  );
};
