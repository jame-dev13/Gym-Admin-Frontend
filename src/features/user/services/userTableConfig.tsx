import { Badge } from "@/components/badge/Badge";
import type { TableRendererConfig } from "@/components/table/tableRendererConfig";
import { useGetUserPage } from "@/features/user/hooks/useFetchUser";
import type { UserResponse } from "@/features/user/types";
import type { Column, ActionColumn } from "@/types/Types";
import { UserTableRowActions } from "../components/UserTableRowActions";

export const userColumns: Column<UserResponse>[] = [
  {
    key: "name",
    header: "User",
    render: (_, row) => (
      <Badge title={row.name} className="capitalize" variant="blue">
        <span className="text-text-secondary">#{row.id}</span> {row.name}
      </Badge>
    ),
  },
  {
    key: "email",
    header: "User's email",
    align: "left",
    render: (_, row) => (
      <Badge variant="indigo" leading="initial" title={row.email}>
        {row.email}
      </Badge>
    ),
  },
  {
    key: "authProvider",
    header: "Auth provider",
    render: (_, row) => (
      <Badge variant="slate" title={row.authProvider}>
        {row.authProvider}
      </Badge>
    ),
  },
  {
    key: "roles",
    header: "Roles",
    render: (_, row) => {
      const roles = row.roles?.join(", ") ?? "---";

      return (
        <Badge variant="rose" title={roles}>
          {roles}
        </Badge>
      );
    },
  },
  {
    key: "isCustomer",
    header: "Customer",
    align: "center",
    render: (value) => (value ? "Yes" : "No"),
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
  description: "People with access to the administration panel",
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
