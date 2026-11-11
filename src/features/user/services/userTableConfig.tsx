import { TableField, TableFieldGroup } from "@/components/table/TableField";
import type { TableRendererConfig } from "@/components/table/tableRendererConfig";
import {
  useGetRecycleUserPage,
  useGetUserPage,
} from "@/features/user/hooks/useFetchUser";
import type { RecycleUser, UserResponse } from "@/features/user/types";
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
import { CreateCustomerLink } from "@/features/user/components/CreateCustomerLink";
import { UserRecycleRowActions } from "../components/UserRecycleRowActions";

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
        {row.role.includes("USER") ? (
          <TableField
            icon={row.isCustomer ? UserCheck : UserX}
            label="Customer"
            indicator={row.isCustomer ? "success" : "neutral"}
          >
            {row.isCustomer ? "Yes" : <CreateCustomerLink user={row} />}
          </TableField>
        ) : null}
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
    size: "sm",
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

const recycleUserColumns: Column<RecycleUser>[] = [
  {
    header: "User",
    key: "id",
    width: "400px",
    kind: "data",
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
    header: "Email",
    key: "email",
    kind: "data",
    render: (_, row) => (
      <TableFieldGroup>
        <TableField icon={Mail} label="User email" title={row.email}>
          {row.email}
        </TableField>
      </TableFieldGroup>
    ),
  },
  {
    kind: "action",
    header: "Actions",
    key: "action",
    renderActions: (user) => <UserRecycleRowActions row={user} />,
  },
];

const userRecycleTableConfig: TableRendererConfig<RecycleUser> = {
  usePage: useGetRecycleUserPage,
  columns: recycleUserColumns,
  title: "Recycle users",
  pageSize: 5,
  tableOptions: {
    "aria-label": "Recycle table users",
    caption: "Recycle users",
    emptyMessage: "No recycle users found",
    striped: true,
    size: "sm",
    responsive: "cards",
    cardTitleKey: "name",
  },
  search: {
    enabled: true,
    placeholder: "Search recycle users…",
  },
  sort: {
    properties: ["id", "name", "email"],
    initialSortBy: "id",
    initialDirection: "asc",
  },
  loadingMessage: "Loading recycle users...",
};

export const getUserRecycleTableConfig = (): TableRendererConfig<RecycleUser> =>
  userRecycleTableConfig;
