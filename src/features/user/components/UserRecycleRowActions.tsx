import { lazy, type FC } from "react";
import type { RowAction } from "../../../types/Types";
import type { RecycleUser } from "../types";
import { Flame, RecycleIcon } from "lucide-react";
import { useModalContext } from "../../../context/useModalContext";
import { TableRowActions } from "../../../components/table/TableRowActions";

const LazyRecoverUserDialog = lazy(() =>
  import("@/features/user/components/UserActionDialogs").then((mod) => ({
    default: mod.UserRecoverDialog,
  })),
);

const LazyEraseUserDialog = lazy(() =>
  import("@/features/user/components/UserActionDialogs").then((mod) => ({
    default: mod.UserHardDeleteDialog,
  })),
);

export const UserRecycleRowActions: FC<{ row: RecycleUser }> = ({ row }) => {
  const { openModal, isOpen } = useModalContext();

  const actions: RowAction<RecycleUser>[] = [
    {
      id: "recover",
      label: "Recover",
      Icon: RecycleIcon,
      disabled: isOpen,
      onSelect: (user) => {
        openModal({
          data: user,
          title: "Recover User",
          render: () => <LazyRecoverUserDialog userId={user.id} />,
          size: "sm",
          description: "Bring back user's record.",
        });
      },
    },
    {
      id: "erase",
      label: "Erase",
      Icon: Flame,
      disabled: isOpen,
      onSelect: (user) => {
        openModal({
          data: user,
          title: "Erase user data.",
          render: () => <LazyEraseUserDialog userId={user.id} />,
          size: "sm",
          description: "Completely remove user's record.",
        });
      },
    },
  ];

  return (
    <TableRowActions
      actions={actions}
      row={row}
      aria-label={"Recycle User table command actions."}
    />
  );
};
