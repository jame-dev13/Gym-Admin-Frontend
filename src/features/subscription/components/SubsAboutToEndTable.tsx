import { TableRenderer } from "@/components/table/TableRenderer";
import { getSubsAboutToEndTableConfig } from "@/features/subscription/services/subscription-about-to-end-table-config";

export const SubsAboutToEndTable = () => (
  <TableRenderer config={getSubsAboutToEndTableConfig()} />
);
