import { Badge } from "@/components/badge/Badge";
import type { TableRendererConfig } from "@/components/table/tableRendererConfig";
import { AddressInfoLink } from "@/features/customer/components/AddressInfoLink";
import { CustomerTableControls } from "@/features/customer/components/CustomerTableRowActions";
import { useGetCustomerPage } from "@/features/customer/hooks/api/useFetchCustomer";
import type { CustomerResponse } from "@/features/customer/types";
import type { Column } from "@/types/Types";

const columns: Column<CustomerResponse>[] = [
  {
    key: "customerName",
    header: "Customer",
    render: (_, { id, customerName }) => {
      return (
        <Badge variant="slate" className="capitalize" title={customerName}>
          <span className="text-text-secondary mr-2">
            {"#"}
            {id}
          </span>
          {customerName}
        </Badge>
      );
    },
  },
  {
    key: "customerEmail",
    header: "Customer Email",
    render: (_, { customerEmail }) => {
      return (
        <Badge
          variant="blue"
          leading="initial"
          title={`Customer's Mail: ${customerEmail}`}
        >
          {customerEmail}
        </Badge>
      );
    },
  },
  {
    key: "contact",
    header: "Customer phone",
    render: (_, { contact }) => {
      return (
        <Badge
          variant="amber"
          leading="dot"
          title={`Customer's Mail: ${contact}`}
        >
          <strong>{contact}</strong>
        </Badge>
      );
    },
  },
  {
    key: "addressInfo",
    header: "Address Info",
    render: (_, row) => <AddressInfoLink customer={row} />,
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
