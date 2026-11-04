import type { BadgeVariant } from "@/components/badge/BadgeTypes";
import {
  TableField,
  TableFieldGroup,
  type TableFieldIndicator,
} from "@/components/table/TableField";
import type { TableRendererConfig } from "@/components/table/tableRendererConfig";
import { useGetPaymentPage } from "@/features/payment/hooks/useFetchPayments";
import type { PaymentResponse } from "@/features/payment/types";
import type { Column } from "@/types/Types";
import type { LucideIcon } from "lucide-react";
import {
  CheckCircle2,
  CircleDollarSign,
  CircleHelp,
  CircleX,
  Clock,
  CreditCard,
  Flag,
  RotateCcw,
  Store,
  Timer,
} from "lucide-react";

const amountFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "MXN",
  maximumFractionDigits: 2,
});

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
});

const formatAmount = (amount: number) => amountFormatter.format(amount);

const formatDate = (createdAt: string) => {
  const date = new Date(createdAt);

  return Number.isNaN(date.getTime()) ? createdAt : dateFormatter.format(date);
};

const STATUS_LABEL: Record<string, string> = {
  PENDING: "Pending",
  COMPLETED: "Completed",
  FAILED: "Failed",
  REFUNDED: "Refunded",
  FINALIZED: "Finalized",
};

const STATUS_VARIANT: Record<string, BadgeVariant> = {
  PENDING: "amber",
  COMPLETED: "emerald",
  FAILED: "rose",
  REFUNDED: "blue",
  FINALIZED: "slate",
};

const STATUS_ICON: Record<string, LucideIcon> = {
  PENDING: Clock,
  COMPLETED: CheckCircle2,
  FAILED: CircleX,
  REFUNDED: RotateCcw,
  FINALIZED: Flag,
};

const STATUS_INDICATOR: Record<string, TableFieldIndicator> = {
  PENDING: "warning",
  COMPLETED: "success",
  FAILED: "danger",
  REFUNDED: "info",
  FINALIZED: "neutral",
};

const METHOD_LABEL: Record<string, string> = {
  ELECTRONIC: "Electronic",
  PHYSIC: "Physic",
};

const METHOD_ICON: Record<string, LucideIcon> = {
  ELECTRONIC: CreditCard,
  PHYSIC: Store,
};

const formatStatus = (status: string) =>
  STATUS_LABEL[status] ?? status.replaceAll("_", " ").toLowerCase();

const formatMethod = (method: string) =>
  METHOD_LABEL[method] ?? method.replaceAll("_", " ").toLowerCase();

const columns: Column<PaymentResponse>[] = [
  {
    kind: "data",
    key: "amount",
    header: "Payment",
    render: (_, { amount, paymentMethod }) => (
      <TableFieldGroup>
        <TableField
          icon={CircleDollarSign}
          label="Amount"
          title={`Payment amount: ${formatAmount(amount)}`}
          badge="emerald"
        >
          {formatAmount(amount)}
        </TableField>
        <TableField
          icon={METHOD_ICON[paymentMethod] ?? CreditCard}
          label="Payment method"
          title={`Payment method: ${paymentMethod}`}
        >
          {formatMethod(paymentMethod)}
        </TableField>
      </TableFieldGroup>
    ),
  },
  {
    kind: "data",
    key: "status",
    header: "Status",
    render: (_, { status, createdAt }) => (
      <TableFieldGroup>
        <TableField
          icon={STATUS_ICON[status] ?? CircleHelp}
          label="Status"
          title={`Payment status: ${status}`}
          badge={STATUS_VARIANT[status] ?? "slate"}
          leading="none"
          indicator={STATUS_INDICATOR[status] ?? "neutral"}
        >
          {formatStatus(status)}
        </TableField>
        <TableField icon={Timer} label="Created at" title={createdAt}>
          <time dateTime={createdAt}>{formatDate(createdAt)}</time>
        </TableField>
      </TableFieldGroup>
    ),
  },
];

const paymentTableConfig: TableRendererConfig<PaymentResponse> = {
  usePage: useGetPaymentPage,
  columns,
  title: "Payments",
  tableOptions: {
    "aria-label": "Payment's data Table",
    cardTitleKey: "amount",
    getRowKey: (row) => row.id!,
    emptyMessage: "Payments not found..",
    size: "sm",
    striped: true,
    responsive: "cards",
  },
  loadingMessage: "Loading payment's data",
  search: {
    enabled: true,
    placeholder: "Search in payments....",
  },
  sort: {
    properties: ["status", "method", "amount", "createdAt"],
    initialSortBy: "createdAt",
    labels: {
      status: "Status",
      method: "Method",
      amount: "Amount",
      createdAt: "Created at",
    },
    initialDirection: "desc",
  },
};

export const getPaymentTableConfig = () => paymentTableConfig;
