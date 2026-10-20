import { TableRenderer } from "@/components/table/TableRenderer";
import { getCustomerTableConfig } from "@/features/customer/services/customer-table-config";

export const CustomerTableLayout = () => (
  <TableRenderer config={getCustomerTableConfig()} />
);
