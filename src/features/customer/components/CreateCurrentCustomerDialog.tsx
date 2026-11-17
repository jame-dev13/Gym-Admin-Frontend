import { UserPlus } from "lucide-react";
import { ConfirmDialog } from "@/components/confirm-dialog/ConfirmDialog";
import { useModalContext } from "@/context/useModalContext";
import { useCreateCurrentCustomerHandler } from "@/features/customer/hooks/handlers/useCreateCustomerHandler";

export const CreateCurrentCustomerDialog = () => {
  const { error, isPending, submit } = useCreateCurrentCustomerHandler();
  const { closeModal } = useModalContext();

  return (
    <ConfirmDialog
      title="Customer registration"
      description="Confirm your registration to create your customer profile to activate your application profile."
      confirmLabel="Create customer profile"
      pendingLabel="Creating profile…"
      cancelLabel="Cancel"
      Icon={UserPlus}
      onConfirmSubmit={submit}
      error={error?.message}
      isPending={isPending}
      onCancel={closeModal}
      confirmDisabled={isPending}
      confirmAriaLabel="Create customer profile"
    />
  );
};
