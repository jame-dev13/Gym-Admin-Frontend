import { CustomerForm } from "@/features/customer/components/CustomerForm";
import { useCreateCustomerHandler } from "@/features/customer/hooks/handlers/useCreateCustomerHandler";
import type { Identifiable } from "@/types/Types";
import type { FC } from "react";

export const CreateCustomerForm: FC<{ identifiable: Identifiable }> = ({ identifiable }) => {
  const { isPending, submit } = useCreateCustomerHandler();
  return (
    <CustomerForm
      mode="create"
      side="admin"
      data={{ userId: identifiable.id }}
      isPending={isPending}
      onSubmit={submit}
    />
  );
};
