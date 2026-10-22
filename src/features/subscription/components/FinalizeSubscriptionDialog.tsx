import { CheckCircle2 } from "lucide-react";
import { ConfirmDialog } from "@/components/confirm-dialog/ConfirmDialog";
import { useModalContext } from "@/context/useModalContext";
import { useFinalizeSubscriptionHandler } from "@/features/subscription/hooks/handlers/useFinalizeSubscriptionHandler";
import type { SubscriptionResponse } from "@/features/subscription/types";
import type { Identifiable } from "@/types/Types";

export type FinalizeSubscriptionDialogProps = {
  subscriptionId: Identifiable["id"];
  customerEmail: SubscriptionResponse["customerEmail"];
};

export const FinalizeSubscriptionDialog = ({
  subscriptionId,
  customerEmail,
}: FinalizeSubscriptionDialogProps) => {
  const { closeModal } = useModalContext();
  const { submit, isPending, error } =
    useFinalizeSubscriptionHandler(subscriptionId);

  return (
    <ConfirmDialog
      title="Finalize subscription"
      description={`Finalize the subscription for ${customerEmail}? This will mark it as finalized.`}
      confirmLabel="Finalize subscription"
      pendingLabel="Finalizing…"
      tone="default"
      Icon={CheckCircle2}
      isPending={isPending}
      error={error?.message ?? null}
      onCancel={closeModal}
      onConfirmSubmit={submit}
      confirmAriaLabel="Finalize subscription confirm button."
    />
  );
};
