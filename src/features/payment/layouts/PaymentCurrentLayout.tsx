import { TableRenderer } from "@/components/table/TableRenderer";
import { getPaymentCurrentTableConfig } from "@/features/payment/services/payment-table-config";

const PaymentCurrentLayout = () => (
  <TableRenderer config={getPaymentCurrentTableConfig()} />
);

export default PaymentCurrentLayout;
