import { Pencil, Trash2 } from "lucide-react";
import { lazy } from "react";
import { TableRowActions } from "@/components/table/TableRowActions";
import { useEntityDomainContext } from "@/context/useEntityDomainContext";
import { useDrawerContext } from "@/context/useDrawerContext";
import { useModalContext } from "@/context/useModalContext";
import type { RowAction } from "@/types/Types";
import type { UserResponse } from "../types";
import { getUserConfirmDialogConfig } from "@/features/user/services/user-confirm-dialog-config";

const LazyUserUpdateForm = lazy(() =>
  import("@/features/user/components/UserUpdateForm").then((mod) => ({
    default: mod.UserUpdateForm,
  })),
);

const LazyUserDeleteDialog = lazy(() =>
  import("@/features/user/components/UserActionDialogs").then((mod) => ({
    default: mod.UserDeleteDialog,
  })),
);

const DELETE_DIALOG_CONFIG = getUserConfirmDialogConfig().delete;

export const UserTableRowActions = ({ row }: { row: UserResponse }) => {
  const { entity } = useEntityDomainContext();
  const { isOpen: isDrawerOpen, openDrawer } = useDrawerContext();
  const { isOpen: isModalOpen, openModal } = useModalContext();

  if (entity !== "user") {
    throw new Error("UserTableRowActions can only be used in user entity context");
  }

  const actions: RowAction<UserResponse>[] = [
    {
      id: "edit",
      label: "Edit user",
      Icon: Pencil,
      disabled: isDrawerOpen,
      onSelect: (r) => {
        openDrawer({
          title: "Edit User",
          description: `Editing ${r.name}`,
          data: r,
          render: (user) => <LazyUserUpdateForm userId={user.id} />,
        });
      },
    },
    {
      id: "remove",
      label: "Remove user",
      Icon: Trash2,
      destructive: true,
      disabled: isModalOpen,
      onSelect: (r) => {
        openModal({
          title: DELETE_DIALOG_CONFIG.title,
          description: DELETE_DIALOG_CONFIG.description,
          data: r,
          render: (user) => <LazyUserDeleteDialog userId={user.id} />,
        });
      },
    },
  ];

  return <TableRowActions row={row} actions={actions} />;
};
