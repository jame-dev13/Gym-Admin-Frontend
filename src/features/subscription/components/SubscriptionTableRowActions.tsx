import { CheckCircle2, Pencil, Trash2 } from "lucide-react";
import { lazy } from "react";
import { TableRowActions } from "@/components/table/TableRowActions";
import { useDrawerContext } from "@/context/useDrawerContext";
import { useEntityDomainContext } from "@/context/useEntityDomainContext";
import { useModalContext } from "@/context/useModalContext";
import type { SubscriptionResponse } from "@/features/subscription/types";
import type { RowAction } from "@/types/Types";

const LazyEditSubscriptionForm = lazy(() =>
  import("@/features/subscription/components/EditSubscriptionForm").then(
    (mod) => ({
      default: mod.EditSubscriptionForm,
    }),
  ),
);

const LazyFinalizeSubscriptionDialog = lazy(() =>
  import("@/features/subscription/components/FinalizeSubscriptionDialog").then(
    (mod) => ({
      default: mod.FinalizeSubscriptionDialog,
    }),
  ),
);

const LazyDeleteSubscriptionDialog = lazy(() =>
  import("@/features/subscription/components/DeleteSubscriptionDialog").then(
    (mod) => ({
      default: mod.DeleteSubscriptionDialog,
    }),
  ),
);

export const SubscriptionTableRowActions = ({
  row,
}: {
  row: SubscriptionResponse;
}) => {
  const { entity } = useEntityDomainContext();
  const { isOpen: isDrawerOpen, openDrawer } = useDrawerContext();
  const { isOpen: isModalOpen, openModal } = useModalContext();

  if (entity !== "subscription") {
    throw new Error(
      "SubscriptionTableRowActions can only be used in subscription entity context",
    );
  }

  const actions: RowAction<SubscriptionResponse>[] = [
    {
      id: "edit-subscription",
      label: "Edit subscription",
      Icon: Pencil,
      disabled: isDrawerOpen,
      onSelect: (subscription) => {
        openDrawer({
          title: "Edit subscription",
          description: `Editing subscription for ${subscription.customerEmail}.`,
          data: subscription,
          render: (current) => (
            <LazyEditSubscriptionForm subscriptionId={current.id} />
          ),
        });
      },
    },
    {
      id: "finalize-subscription",
      label: "Finalize subscription",
      Icon: CheckCircle2,
      disabled: isModalOpen,
      onSelect: (subscription) => {
        openModal({
          title: "Finalize subscription",
          description: `Finalize the subscription for ${subscription.customerEmail}.`,
          size: "sm",
          data: subscription,
          render: (current) => (
            <LazyFinalizeSubscriptionDialog
              subscriptionId={current.id}
              customerEmail={current.customerEmail}
            />
          ),
        });
      },
    },
    {
      id: "delete-subscription",
      label: "Delete subscription",
      Icon: Trash2,
      destructive: true,
      disabled: isModalOpen,
      onSelect: (subscription) => {
        openModal({
          title: "Delete subscription",
          description: `Remove the subscription for ${subscription.customerEmail}.`,
          size: "sm",
          data: subscription,
          render: (current) => (
            <LazyDeleteSubscriptionDialog
              subscriptionId={current.id}
              customerEmail={current.customerEmail}
            />
          ),
        });
      },
    },
  ];

  return <TableRowActions row={row} actions={actions} />;
};
