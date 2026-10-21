import { Pencil, Trash2 } from "lucide-react";
import { lazy } from "react";
import { TableRowActions } from "@/components/table/TableRowActions";
import { useSelectionContext } from "@/context/useSelectionContext";
import { useEntityDomainContext } from "@/context/useEntityDomainContext";
import { useActionContext } from "@/context/useActionContext";
import { useDrawerContext } from "@/context/useDrawerContext";
import { useModalContext } from "@/context/useModalContext";
import type { RowAction } from "@/types/Types";
import type { UserResponse } from "../types";

const LazyUserUpdateForm = lazy(() =>
  import("@/features/user/components/UserUpdateForm").then((mod) => ({
    default: mod.UserUpdateForm,
  })),
);

export const UserTableRowActions = ({ row }: { row: UserResponse }) => {
  const { setCurrentSelection } = useSelectionContext();
  const { entity } = useEntityDomainContext();
  const { setAction } = useActionContext();
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
        setCurrentSelection({ id: r.id });
        setAction("delete");
        openModal({
          title: "Remove User",
          description: `Are you sure you want to remove ${r.name}?`,
        });
      },
    },
  ];

  return <TableRowActions row={row} actions={actions} />;
};
