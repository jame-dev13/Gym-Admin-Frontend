import { Badge } from "@/components/badge/Badge";
import type { BadgeVariant } from "@/components/badge/BadgeTypes";
import type { TableRendererConfig } from "@/components/table/tableRendererConfig";
import { PeriodDetailsLink } from "@/features/subscription/components/PeriodDetailsLink";
import { SubscriptionTableActions } from "@/features/subscription/components/SubscriptionTableActions";
import { SubscriptionTableRowActions } from "@/features/subscription/components/SubscriptionTableRowActions";
import { useGetSubscriptionPage } from "@/features/subscription/hooks/useFetchSubscription";
import type {
  SubscriptionResponse,
  SubscriptionStatus,
} from "@/features/subscription/types";
import type { Column } from "@/types/Types";

const priceFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "MXN",
  maximumFractionDigits: 2,
});

const formatPrice = (price: number) => priceFormatter.format(price);

const formatStatus = (status: SubscriptionStatus) =>
  status.split("_").join(" ").toLowerCase();

const STATUS_VARIANT: Record<SubscriptionStatus, BadgeVariant> = {
  FINALIZED: "slate",
  NOT_PAID: "rose",
  PAID: "emerald",
  DROPPED: "amber",
  ON_RENEWAL: "purple",
  RENEWED: "blue",
};

const columns: Column<SubscriptionResponse>[] = [
  {
    key: "customerEmail",
    header: "Customer Email",
    render: (_, { customerEmail }) => (
      <Badge
        variant="blue"
        leading="initial"
        title={`Customer's Mail: ${customerEmail}`}
      >
        {customerEmail}
      </Badge>
    ),
  },
  {
    key: "membership",
    header: "Membership",
    render: (_, { membership, price }) => (
      <div className="flex flex-wrap items-center gap-1.5">
        <Badge
          variant="purple"
          className="capitalize"
          title={`Membership: ${membership}`}
        >
          {membership.toLowerCase()}
        </Badge>
        <Badge
          variant="emerald"
          mono
          title={`Membership price: ${formatPrice(price)}`}
        >
          {formatPrice(price)}
        </Badge>
      </div>
    ),
  },
  {
    key: "periods",
    header: "Period Details",
    render: (_, row) => <PeriodDetailsLink subscription={row} />,
  },
  {
    key: "status",
    header: "Status",
    render: (_, { status }) => (
      <Badge
        variant={STATUS_VARIANT[status]}
        className="capitalize"
        title={`Status: ${status}`}
      >
        {formatStatus(status)}
      </Badge>
    ),
  },
  {
    key: "Actions",
    kind: "action",
    header: "Actions",
    renderActions: (row) => <SubscriptionTableRowActions row={row} />,
  },
];

const subscriptionTableConfig: TableRendererConfig<SubscriptionResponse> = {
  usePage: useGetSubscriptionPage,
  columns,
  title: "Subscriptions",
  tableOptions: {
    "aria-label": "Subscription's data Table",
    cardTitleKey: "customerEmail",
    emptyMessage: "Subscriptions not found..",
    size: "sm",
    striped: true,
    responsive: "cards",
  },
  loadingMessage: "Loading subscription's data",
  controls: <SubscriptionTableActions />,
  search: {
    enabled: true,
    placeholder: "Search in subscriptions....",
  },
  sort: {
    properties: ["id", "customerEmail", "price"],
    initialSortBy: "id",
    labels: { id: "Id", customerEmail: "Email", price: "Price" },
    initialDirection: "asc",
  },
};

export const getSubscriptionConfig = () => subscriptionTableConfig;
