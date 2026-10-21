import type React from "react";
import { ConfirmDialog } from "@/components/confirm-dialog/ConfirmDialog";
import { getUserConfirmDialogConfig } from "@/features/user/services/user-confirm-dialog-config";
import type { UserConfirmVariant } from "@/features/user/types";

export type { UserConfirmVariant } from "@/features/user/types";

export interface UserConfirmDialogProps {
  variant: UserConfirmVariant;
  isPending?: boolean;
  error?: string | null;
  onConfirmSubmit: (e: React.SubmitEvent<HTMLFormElement>) => void;
  onCancel?: () => void;
}

export const UserConfirmDialog = ({
  variant,
  isPending = false,
  error,
  onConfirmSubmit,
  onCancel,
}: UserConfirmDialogProps) => {
  const config = getUserConfirmDialogConfig()[variant];

  return (
    <ConfirmDialog
      {...config}
      isPending={isPending}
      error={error}
      onConfirmSubmit={onConfirmSubmit}
      onCancel={onCancel}
      confirmAriaLabel={`${variant} dialog confirm button.`}
    />
  );
};
