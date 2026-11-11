import { TableRenderer } from "@/components/table/TableRenderer";
import { getUserRecycleTableConfig } from "../services/userTableConfig";

const UserRecycleLayout = () => (
  <TableRenderer config={getUserRecycleTableConfig()} />
);

export default UserRecycleLayout;
