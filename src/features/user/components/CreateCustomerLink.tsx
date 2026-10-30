import { PopoverLink } from "@/components/popover";
import { CreateCustomerForm } from "@/features/customer/components/CreateCustomerForm";
import type { UserResponse } from "@/features/user/types";
import { type FC } from "react";

type CreateCustomerLinkProps = {
  user: UserResponse;
};

export const CreateCustomerLink: FC<CreateCustomerLinkProps> = ({ user }) => {
  return (
    <PopoverLink
      data={user}
      label="You want to turn up this user into a customer?"
      render={(user) => {
        return <CreateCustomerForm identifiable={{ id: user.id }} />;
      }}
      color="cyan"
    >
      Create Customer
    </PopoverLink>
  );
};
