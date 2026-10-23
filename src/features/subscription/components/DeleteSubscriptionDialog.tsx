import { Trash2 } from "lucide-react";
import { useState } from "react";
import { ConfirmDialog } from "@/components/confirm-dialog/ConfirmDialog";
import { useModalContext } from "@/context/useModalContext";
import { SubscriptionCheckbox } from "@/features/subscription/components/SubscriptionCheckbox";
import { useDeleteSubscriptionHandler } from "@/features/subscription/hooks/handlers/useDeleteSubscriptionHandler";
import type { SubscriptionResponse } from "@/features/subscription/types";
import type { Identifiable } from "@/types/Types";

export type DeleteSubscriptionDialogProps = {
  subscriptionId: Identifiable["id"];
  customerEmail: SubscriptionResponse["customerEmail"];
};

export const DeleteSubscriptionDialog = ({
  subscriptionId,
  customerEmail,
}: DeleteSubscriptionDialogProps) => {
  const [isConfirmed, setIsConfirmed] = useState(false);
  const { closeModal } = useModalContext();
  const { submit, isPending, error } =
    useDeleteSubscriptionHandler(subscriptionId);

  return (
    <ConfirmDialog
      title="Delete subscription"
      description={`Proceed to remove the subscription for ${customerEmail} from the application?`}
      confirmLabel="Delete subscription"
      pendingLabel="Deleting…"
      tone="destructive"
      Icon={Trash2}
      isPending={isPending}
      confirmDisabled={!isConfirmed}
      error={error?.message ?? null}
      onCancel={closeModal}
      onConfirmSubmit={submit}
      confirmAriaLabel="Delete subscription confirm button."
    >
      <SubscriptionCheckbox
        checked={isConfirmed}
        onCheckedChange={setIsConfirmed}
        disabled={isPending}
      />
    </ConfirmDialog>
  );
};
