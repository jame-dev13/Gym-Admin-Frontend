import { CustomerForm } from "@/features/customer/components/CustomerForm";
import { RecoverCustomerForm } from "@/features/customer/components/RecoverCustomerForm";
import { useCreateCustomerHandler } from "@/features/customer/hooks/handlers/useCreateCustomerHandler";
import type { Identifiable } from "@/types/Types";
import { type FC } from "react";

type CreateOrRecoverCustomerForm = {
  rowData: { row: Identifiable; email: string };
};

export const CreateOrRecoverCustomerForm: FC<CreateOrRecoverCustomerForm> = ({
  rowData,
}) => {
  const { submit, isPending, isAlreadyExistsError } =
    useCreateCustomerHandler();

  if (isAlreadyExistsError)
    return <RecoverCustomerForm email={rowData.email} />;

  return (
    <CustomerForm
      side="admin"
      mode="create"
      isPending={isPending}
      onSubmit={submit}
      data={{ userId: rowData.row }}
    />
  );
};
