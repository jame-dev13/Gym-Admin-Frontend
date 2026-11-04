import { TableRenderer } from "@/components/table/TableRenderer";
import { getPaymentTableConfig } from "@/features/payment/services/payment-table-config";

export const PaymentTable = () => (
  <TableRenderer config={getPaymentTableConfig()} />
);
