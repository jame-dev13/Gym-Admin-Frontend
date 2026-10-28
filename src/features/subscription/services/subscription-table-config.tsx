import type { BadgeVariant } from "@/components/badge/BadgeTypes";
import {
  TableField,
  TableFieldGroup,
  type TableFieldIndicator,
} from "@/components/table/TableField";
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
import type { LucideIcon } from "lucide-react";
import {
  CalendarClock,
  CheckCircle2,
  CircleDollarSign,
  CircleX,
  Dumbbell,
  Flag,
  Mail,
  RefreshCw,
  RotateCcw,
  TriangleAlert,
} from "lucide-react";

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

const STATUS_ICON: Record<SubscriptionStatus, LucideIcon> = {
  FINALIZED: Flag,
  NOT_PAID: CircleX,
  PAID: CheckCircle2,
  DROPPED: TriangleAlert,
  ON_RENEWAL: RefreshCw,
  RENEWED: RotateCcw,
};

const STATUS_INDICATOR: Record<SubscriptionStatus, TableFieldIndicator> = {
  FINALIZED: "neutral",
  NOT_PAID: "danger",
  PAID: "success",
  DROPPED: "warning",
  ON_RENEWAL: "purple",
  RENEWED: "info",
};

const columns: Column<SubscriptionResponse>[] = [
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
    key: "membership",
    header: "Membership",
    render: (_, { membership, price }) => (
      <TableFieldGroup>
        <TableField
          icon={Dumbbell}
          label="Membership"
          title={`Membership: ${membership}`}
        >
          <span className="capitalize">{membership.toLowerCase()}</span>
        </TableField>
        <TableField
          icon={CircleDollarSign}
          label="Membership price"
          title={`Membership price: ${formatPrice(price)}`}
        >
          {formatPrice(price)}
        </TableField>
      </TableFieldGroup>
    ),
  },
  {
    kind: "data",
    key: "periods",
    header: "Period Details",
    render: (_, row) => (
      <TableFieldGroup>
        <TableField icon={CalendarClock} label="Period details">
          <PeriodDetailsLink subscription={row} />
        </TableField>
      </TableFieldGroup>
    ),
  },
  {
    kind: "data",
    key: "status",
    header: "Status",
    render: (_, { status }) => (
      <TableFieldGroup>
        <TableField
          icon={STATUS_ICON[status]}
          label="Status"
          title={`Status: ${status}`}
          badge={STATUS_VARIANT[status]}
          leading="none"
          indicator={STATUS_INDICATOR[status]}
        >
          <span className="capitalize">{formatStatus(status)}</span>
        </TableField>
      </TableFieldGroup>
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
