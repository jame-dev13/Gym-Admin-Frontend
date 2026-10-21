import { PopoverLink } from "@/components/popover";
import { CreateOrRecoverCustomerForm } from "@/features/customer/components/CreateOrRecoverCustomerForm";
import type { UserResponse } from "@/features/user/types";
import { UserRoundPlus } from "lucide-react";
import { type FC } from "react";

type CustomerCreateLinkProps = {
  row: UserResponse;
};

export const CustomerCreateLink: FC<CustomerCreateLinkProps> = ({ row }) => {
  const { id, email } = row;
  return (
    <PopoverLink
      data={{ id, email }}
      label="Make customer"
      color="cyan"
      look="pill"
      icon={<UserRoundPlus />}
      render={(data) => {
        return (
          <CreateOrRecoverCustomerForm
            rowData={{ row: { id: data.id }, email }}
          />
        );
      }}
    >
      Make Customer.
    </PopoverLink>
  );
};
