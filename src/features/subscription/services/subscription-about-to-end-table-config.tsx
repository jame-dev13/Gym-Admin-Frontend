import { TableField, TableFieldGroup } from "@/components/table/TableField";
import type { TableRendererConfig } from "@/components/table/tableRendererConfig";
import { useGetSubscriptionAboutToEndPage } from "@/features/subscription/hooks/useFetchSubscription";
import type { SubscriptionAboutToEndResponse } from "@/features/subscription/types";
import type { Column } from "@/types/Types";
import {
  CheckCircle2,
  CreditCardCheck,
  DollarSign,
  RotateCcw,
  Rows,
  Timer,
  UserCircle2,
} from "lucide-react";

const columns: Column<SubscriptionAboutToEndResponse>[] = [
  {
    kind: "data",
    key: "member",
    header: "Member",
    render: (_, { member, status }) => (
      <TableFieldGroup>
        <TableField icon={UserCircle2} label="Member's name">
          {member}
        </TableField>
        <TableField
          icon={
            status === "RENEWED"
              ? RotateCcw
              : status === "PAID"
                ? CheckCircle2
                : Rows
          }
          label="Subscription Status"
        >
          {status}
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
        <TableField icon={CreditCardCheck} label="Membership Plan">
          {membership}
        </TableField>
        <TableField icon={DollarSign} label="Price">
          {price}
        </TableField>
      </TableFieldGroup>
    ),
  },
  {
    kind: "data",
    key: "endsOn",
    header: "Ends On",
    render: (_, { endsOn }) => (
      <TableFieldGroup>
        <TableField icon={Timer} label="Ends On">
          {endsOn}
        </TableField>
      </TableFieldGroup>
    ),
  },
];

const TableConfig: TableRendererConfig<SubscriptionAboutToEndResponse> = {
  columns,
  pageSize: 5,
  usePage: useGetSubscriptionAboutToEndPage,
  title: "Subscription about to end",
  loadingMessage: "Loading....",
  search: {
    enabled: true,
    placeholder: "Search on subscriptions....",
  },
  tableOptions: {
    "aria-label": "subscription about to end table.",
    cardTitleKey: "member",
    emptyMessage: "Subscriptions not found.",
    getRowKey: (row) => row.member,
    size: "sm",
    striped: true,
  },
  sort: {
    initialSortBy: "price",
    initialDirection: "asc",
    properties: ["price", "customerEmail"],
    labels: { price: "price", member: "member" },
  },
};

export const getSubsAboutToEndTableConfig = () => TableConfig;
