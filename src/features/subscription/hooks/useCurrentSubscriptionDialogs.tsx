import { useModalContext } from "@/context/useModalContext";
import {
  CreateCurrentSubscriptionDialog,
  DeleteCurrentSubscriptionDialog,
  FinalizeCurrentSubscriptionDialog,
  RenewCurrentSubscriptionDialog,
} from "@/features/subscription/components/CurrentSubscriptionConfirmDialog";
import type { MembershipPlan } from "@/features/subscription/services/membership-plans";
import type { SubscriptionResponse } from "@/features/subscription/types";

/**
 * Dialog triggers shared by the subscription overview and the home overview.
 *
 * Keeps every current-subscription action bound to its confirmation dialog in
 * one place, whether it is started from the subscription panel or from home.
 */
export const useCurrentSubscriptionDialogs = () => {
  const { openModal } = useModalContext();

  const openCreateDialog = (plan: MembershipPlan) => {
    openModal({
      title: "Start a membership",
      description: `Create a new ${plan.label} membership.`,
      size: "sm",
      data: plan,
      render: (selected) => (
        <CreateCurrentSubscriptionDialog membership={selected.membership} />
      ),
    });
  };

  const openRenewDialog = (current: SubscriptionResponse) => {
    openModal({
      title: "Renew membership",
      description: `Renew the ${current.membership.toLowerCase()} membership.`,
      size: "sm",
      data: current,
      render: (selected) => (
        <RenewCurrentSubscriptionDialog membership={selected.membership} />
      ),
    });
  };

  const openFinalizeDialog = (current: SubscriptionResponse) => {
    openModal({
      title: "Finalize membership",
      description: `Finalize the ${current.membership.toLowerCase()} membership.`,
      size: "sm",
      data: current,
      render: () => <FinalizeCurrentSubscriptionDialog />,
    });
  };

  const openDeleteDialog = (current: SubscriptionResponse) => {
    openModal({
      title: "Delete membership",
      description: `Delete the ${current.membership.toLowerCase()} membership.`,
      size: "sm",
      data: current,
      render: () => <DeleteCurrentSubscriptionDialog />,
    });
  };

  return {
    openCreateDialog,
    openRenewDialog,
    openFinalizeDialog,
    openDeleteDialog,
  };
};
