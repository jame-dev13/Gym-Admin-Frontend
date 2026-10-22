import { TableRenderer } from "@/components/table/TableRenderer";
import { getSubscriptionConfig } from "@/features/subscription/services/subscription-table-config";

export const SubscriptionLayout = () => (
  <TableRenderer config={getSubscriptionConfig()} />
);
