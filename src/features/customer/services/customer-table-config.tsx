import { Badge } from "@/components/badge/Badge";
import type { TableRendererConfig } from "@/components/table/tableRendererConfig";
import { AddressInfoLink } from "@/features/customer/components/AddressInfoLink";
import { useGetCustomerPage } from "@/features/customer/hooks/api/useFetchCustomer";
import type { CustomerResponse } from "@/features/customer/types";
import type { Column } from "@/types/Types";

const columns: Column<CustomerResponse>[] = [
  {
    key: "customerName",
    header: "Customer",
    render: (_, { id, customerName }) => {
      return (
        <Badge variant="emerald" className="capitalize" title={customerName}>
          <span className="text-text-secondary">{id}</span>
          <span>{customerName}</span>
        </Badge>
      );
    },
  },
  {
    key: "customerEmail",
    header: "Customer's Contact",
    render: (_, { customerEmail, phoneContact }) => {
      return (
        <Badge
          variant="blue"
          leading="dot"
          title={`Customer's Mail: ${customerEmail}, Customer's phone: ${phoneContact ?? "-"}`}
        >
          <span>
            <small>Email: </small>
            <strong>{customerEmail}</strong>
          </span>
          <span>
            <small>Phone: </small>
            {phoneContact ?? "-"}
          </span>
        </Badge>
      );
    },
  },
  {
    key: "addressInfo",
    header: "Address Info",
    render: (_, row) => <AddressInfoLink customer={row} />,
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
    stickyHeader: true,
    responsive: "cards",
  },
  loadingMessage: "Loading Customer's data",
  search: {
    enabled: true,
    placeholder: "....Search in customers.",
  },
  sort: {
    properties: ["id", "customerEmail"],
    initialSortBy: "id",
    labels: { id: "Id", customerEmail: "Email" },
    initialDirection: "asc",
  },
};

export const getCustomerTableConfig = () => customerTableConfig;