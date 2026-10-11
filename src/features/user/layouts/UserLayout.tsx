import { TableRenderer } from "@/components/table/TableRenderer";
import { userTableConfig } from "../services/userTableConfig";
import { UserTableActions } from "../components/UserTableActions";

export const UserLayout = () => (
  <TableRenderer config={{ ...userTableConfig, controls: <UserTableActions /> }} />
);