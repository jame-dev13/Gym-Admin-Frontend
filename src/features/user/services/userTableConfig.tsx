import type { TableRendererConfig } from "@/components/table/tableRendererConfig";
import { useGetUserPage } from "@/features/user/hooks/useFetchUser";
import type { UserResponse } from "@/features/user/types";
import type { Column } from "@/types/Types";

export const userColumns: Column<UserResponse>[] = [
  { key: "name", header: "Name" },
  { key: "email", header: "Email" },
  { key: "authProvider", header: "Provider", align: "center" },
  {
    key: "roles",
    header: "Roles",
    render: (value) => (Array.isArray(value) ? value.join(", ") : "—"),
  },
  {
    key: "isCustomer",
    header: "Customer",
    align: "center",
    render: (value) => (value ? "Yes" : "No"),
  },
];

/**
 * Configuration source for `TableRenderer<UserResponse>`.
 *
 * To add header controls, set `controls: <UserControlTab />`.
 */
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
