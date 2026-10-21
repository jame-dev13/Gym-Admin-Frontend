import { Trash2 } from "lucide-react";
import { ConfirmDialog } from "@/components/confirm-dialog/ConfirmDialog";
import { useModalContext } from "@/context/useModalContext";
import { useDeleteCustomerHandler } from "@/features/customer/hooks/handlers/useDeleteCustomerHandler";
import type { Identifiable } from "@/types/Types";

export type DeleteCustomerDialogProps = {
  customerId: Identifiable["id"];
  customerName: string;
};

export const DeleteCustomerDialog = ({
  customerId,
  customerName,
}: DeleteCustomerDialogProps) => {
  const { closeModal } = useModalContext();
  const { submit, isPending, error } = useDeleteCustomerHandler(customerId);

  return (
    <ConfirmDialog
      title="Remove customer"
      description={`Removing ${customerName} data from application.`}
      confirmLabel="Remove customer"
      pendingLabel="Removing…"
      tone="destructive"
      Icon={Trash2}
      isPending={isPending}
      error={error?.message ?? null}
      onCancel={closeModal}
      onConfirmSubmit={submit}
      confirmAriaLabel="Remove customer confirm button."
    />
  );
};
