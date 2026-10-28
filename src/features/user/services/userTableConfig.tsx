import {
  TableField,
  TableFieldGroup,
} from "@/components/table/TableField";
import type { TableRendererConfig } from "@/components/table/tableRendererConfig";
import { useGetUserPage } from "@/features/user/hooks/useFetchUser";
import type { UserResponse } from "@/features/user/types";
import type { Column, ActionColumn } from "@/types/Types";
import {
  Hash,
  KeyRound,
  Mail,
  ShieldCheck,
  UserCheck,
  UserRound,
  UserX,
} from "lucide-react";
import { UserTableRowActions } from "../components/UserTableRowActions";

export const userColumns: Column<UserResponse>[] = [
  {
    kind: "data",
    key: "name",
    header: "User",
    render: (_, row) => (
      <TableFieldGroup>
        <TableField icon={UserRound} label="User name" title={row.name}>
          <span className="capitalize">{row.name}</span>
        </TableField>
        <TableField icon={Hash} label="User ID" title={`#${row.id}`}>
          {`#${row.id}`}
        </TableField>
      </TableFieldGroup>
    ),
  },
  {
    kind: "data",
    key: "email",
    header: "User's email",
    align: "left",
    render: (_, row) => (
      <TableFieldGroup>
        <TableField icon={Mail} label="User email" title={row.email}>
          {row.email}
        </TableField>
      </TableFieldGroup>
    ),
  },
  {
    kind: "data",
    key: "authProvider",
    header: "Auth provider",
    render: (_, row) => (
      <TableFieldGroup>
        <TableField
          icon={KeyRound}
          label="Auth provider"
          title={row.authProvider}
        >
          {row.authProvider}
        </TableField>
      </TableFieldGroup>
    ),
  },
  {
    kind: "data",
    key: "role",
    header: "Roles",
    render: (_, row) => {
      const role =
        row.role.length > 1 ? row.role.join(", ") : row.role.join("");

      return (
        <TableFieldGroup>
          <TableField
            icon={ShieldCheck}
            label="Roles"
            title={role}
            badge="rose"
          >
            {role}
          </TableField>
        </TableFieldGroup>
      );
    },
  },
  {
    kind: "data",
    key: "isCustomer",
    header: "Customer",
    align: "center",
    render: (_, row) => (
      <TableFieldGroup>
        <TableField
          icon={row.isCustomer ? UserCheck : UserX}
          label="Customer"
          indicator={row.isCustomer ? "success" : "neutral"}
        >
          {row.isCustomer ? "Yes" : "No"}
        </TableField>
      </TableFieldGroup>
    ),
  },
  {
    kind: "action",
    key: "actions",
    header: "",
    width: "120px",
    hideOnCards: false,
    renderActions: (row) => <UserTableRowActions row={row} />,
  } satisfies ActionColumn<UserResponse>,
];

export const userTableConfig: TableRendererConfig<UserResponse> = {
  usePage: useGetUserPage,
  columns: userColumns,
  title: "Users",
  tableOptions: {
    caption: "System users",
    emptyMessage: "No users found",
    striped: true,
    size: "md",
    responsive: "cards",
    cardTitleKey: "name",
  },
  search: {
    enabled: true,
    placeholder: "Search users…",
  },
  sort: {
    properties: ["id", "name", "email"],
    initialSortBy: "id",
    initialDirection: "asc",
  },
};
