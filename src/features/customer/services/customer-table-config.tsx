import {
  TableField,
  TableFieldGroup,
} from "@/components/table/TableField";
import type { TableRendererConfig } from "@/components/table/tableRendererConfig";
import { AddressInfoLink } from "@/features/customer/components/AddressInfoLink";
import { CustomerTableControls } from "@/features/customer/components/CustomerTableRowActions";
import { useGetCustomerPage } from "@/features/customer/hooks/api/useFetchCustomer";
import type { CustomerResponse } from "@/features/customer/types";
import type { Column } from "@/types/Types";
import { Hash, Mail, MapPin, Phone, User } from "lucide-react";

const columns: Column<CustomerResponse>[] = [
  {
    kind: "data",
    key: "customerName",
    header: "Customer",
    render: (_, { id, customerName }) => (
      <TableFieldGroup>
        <TableField
          icon={User}
          label="Customer name"
          title={customerName}
        >
          <span className="capitalize">{customerName}</span>
        </TableField>
        <TableField icon={Hash} label="Customer ID" title={`#${id}`}>
          {`#${id}`}
        </TableField>
      </TableFieldGroup>
    ),
  },
  {
    kind: "data",
    key: "customerEmail",
    header: "Customer Email",
    render: (_, { customerEmail }) => (
      <TableFieldGroup>
        <TableField
          icon={Mail}
          label="Customer email"
          title={`Customer's mail: ${customerEmail}`}
        >
          {customerEmail}
        </TableField>
      </TableFieldGroup>
    ),
  },
  {
    kind: "data",
    key: "contact",
    header: "Customer phone",
    render: (_, { contact }) => (
      <TableFieldGroup>
        <TableField
          icon={Phone}
          label="Customer phone"
          title={`Customer's phone: ${contact}`}
        >
          <strong>{contact}</strong>
        </TableField>
      </TableFieldGroup>
    ),
  },
  {
    kind: "data",
    key: "addressInfo",
    header: "Address Info",
    render: (_, row) => (
      <TableFieldGroup>
        <TableField icon={MapPin} label="Address information">
          <AddressInfoLink customer={row} />
        </TableField>
      </TableFieldGroup>
    ),
  },
  {
    key: "Actions",
    kind: "action",
    header: "Actions",
    renderActions: (row) => <CustomerTableControls row={row} />,
  },
];

const customerTableConfig: TableRendererConfig<CustomerResponse> = {
  usePage: useGetCustomerPage,
  columns: columns,
  title: "Customers",
  tableOptions: {
    "aria-label": "Customer's data Table",
    cardTitleKey: "customerName",
    emptyMessage: "Customers not found..",
    size: "sm",
    striped: true,
    responsive: "cards",
  },
  loadingMessage: "Loading Customer's data",
  search: {
    enabled: true,
    placeholder: "Search in customers....",
  },
  sort: {
    properties: ["id", "userEmail"],
    initialSortBy: "id",
    labels: { id: "Id", customerEmail: "Email" },
    initialDirection: "asc",
  },
};

export const getCustomerTableConfig = () => customerTableConfig;
