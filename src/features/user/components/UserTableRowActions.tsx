import { Pencil, Trash2 } from "lucide-react";
import { TableRowActions } from "@/components/table/TableRowActions";
import { useToastContext } from "@/context/useToastContext";
import type { RowAction } from "@/types/Types";
import type { UserResponse } from "../types";

export const UserTableRowActions = ({ row }: { row: UserResponse }) => {
  const { show } = useToastContext();

  const actions: RowAction<UserResponse>[] = [
    {
      id: "edit",
      label: "Edit user",
      Icon: Pencil,
      onSelect: (r) => show(`Edit user: ${r.name}`, "info"),
    },
    {
      id: "remove",
      label: "Remove user",
      Icon: Trash2,
      destructive: true,
      onSelect: (r) => show(`Remove user: ${r.name}`, "warning"),
    },
  ];

  return <TableRowActions row={row} actions={actions} />;
};