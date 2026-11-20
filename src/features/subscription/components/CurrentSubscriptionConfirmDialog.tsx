import { ConfirmDialog } from "@/components/confirm-dialog/ConfirmDialog";
import { useModalContext } from "@/context/useModalContext";
import { SubscriptionCheckbox } from "@/features/subscription/components/SubscriptionCheckbox";
import { useDeleteCurrentSubscriptionHandler } from "@/features/subscription/hooks/handlers/useDeleteSubscriptionHandler";
import { useFinalizeCurrentSubscriptionHandler } from "@/features/subscription/hooks/handlers/useFinalizeSubscriptionHandler";
import {
  useCreateCurrentSubscription,
  useRenewSubscription,
} from "@/features/subscription/hooks/useMutateCurrentSubscription";
import { usePaySubscriptionHandler } from "@/features/subscription/hooks/usePaySubscriptionHandler";
import {
  formatMembershipPlanPrice,
  getMembershipPlan,
} from "@/features/subscription/services/membership-plans";
import { getCurrentSubscriptionConfirmDialogConfig } from "@/features/subscription/services/subscription-confirm-dialog-config";
import type {
  CurrentSubscriptionConfirmVariant,
  Membership,
} from "@/features/subscription/types";
import type React from "react";
import { type ReactNode, useState } from "react";

const MembershipPlanSummary = ({ membership }: { membership: Membership }) => {
  const plan = getMembershipPlan(membership);
  if (!plan) return null;

  return (
    <dl className="grid gap-3 rounded-xl border border-border bg-surface-over/40 px-4 py-3 sm:grid-cols-3">
      <div className="min-w-0">
        <dt className="text-[10px] font-semibold uppercase tracking-[0.16em] text-text-tertiary">
          Membership
        </dt>
        <dd className="mt-1 truncate text-sm font-semibold text-text-primary">
          {plan.label}
        </dd>
      </div>
      <div className="min-w-0">
        <dt className="text-[10px] font-semibold uppercase tracking-[0.16em] text-text-tertiary">
          Price
        </dt>
        <dd className="mt-1 truncate text-sm font-semibold text-text-primary">
          {formatMembershipPlanPrice(plan.price)} MXN
        </dd>
      </div>
      <div className="min-w-0">
        <dt className="text-[10px] font-semibold uppercase tracking-[0.16em] text-text-tertiary">
          Duration
        </dt>
        <dd className="mt-1 truncate text-sm font-semibold text-text-primary">
          {plan.durationLabel}
        </dd>
      </div>
    </dl>
  );
};

type CurrentSubscriptionConfirmDialogProps = Readonly<{
  variant: CurrentSubscriptionConfirmVariant;
  membership?: Membership;
  isPending: boolean;
  error?: string | null;
  confirmDisabled?: boolean;
  onConfirmSubmit: (event: React.SubmitEvent<HTMLFormElement>) => void;
  onCancel: () => void;
  children?: ReactNode;
}>;

const CurrentSubscriptionConfirmDialog = ({
  variant,
  membership,
  isPending,
  error,
  confirmDisabled = false,
  onConfirmSubmit,
  onCancel,
  children,
}: CurrentSubscriptionConfirmDialogProps) => {
  const config = getCurrentSubscriptionConfirmDialogConfig()[variant];

  return (
    <ConfirmDialog
      {...config}
      isPending={isPending}
      confirmDisabled={confirmDisabled}
      error={error ?? null}
      onConfirmSubmit={onConfirmSubmit}
      onCancel={onCancel}
      confirmAriaLabel={`Current subscription ${variant} dialog confirm button.`}
    >
      {membership && <MembershipPlanSummary membership={membership} />}
      {children}
    </ConfirmDialog>
  );
};

export type CreateCurrentSubscriptionDialogProps = Readonly<{
  membership: Membership;
}>;

export const CreateCurrentSubscriptionDialog = ({
  membership,
}: CreateCurrentSubscriptionDialogProps) => {
  const { closeModal } = useModalContext();
  const { submit, isPending, error } = usePaySubscriptionHandler({
    subscriptionHook: useCreateCurrentSubscription,
  });

  return (
    <CurrentSubscriptionConfirmDialog
      variant="create"
      membership={membership}
      isPending={isPending}
      error={error?.message ?? null}
      onConfirmSubmit={submit}
      onCancel={closeModal}
    >
      <input type="hidden" name="membership" value={membership} />
    </CurrentSubscriptionConfirmDialog>
  );
};

export type RenewCurrentSubscriptionDialogProps = Readonly<{
  membership: Membership;
}>;

export const RenewCurrentSubscriptionDialog = ({
  membership,
}: RenewCurrentSubscriptionDialogProps) => {
  const { closeModal } = useModalContext();
  const { submit, isPending, error } = usePaySubscriptionHandler({
    subscriptionHook: useRenewSubscription,
  });

  return (
    <CurrentSubscriptionConfirmDialog
      variant="renew"
      membership={membership}
      isPending={isPending}
      error={error?.message ?? null}
      onConfirmSubmit={submit}
      onCancel={closeModal}
    >
      <input type="hidden" name="membership" value={membership} />
    </CurrentSubscriptionConfirmDialog>
  );
};

export const FinalizeCurrentSubscriptionDialog = () => {
  const [isConfirmed, setIsConfirmed] = useState(false);
  const { closeModal } = useModalContext();
  const { submit, isPending, error } = useFinalizeCurrentSubscriptionHandler();

  return (
    <CurrentSubscriptionConfirmDialog
      variant="finalize"
      isPending={isPending}
      confirmDisabled={!isConfirmed}
      error={error?.message ?? null}
      onConfirmSubmit={submit}
      onCancel={closeModal}
    >
      <SubscriptionCheckbox
        checked={isConfirmed}
        onCheckedChange={setIsConfirmed}
        disabled={isPending}
        label="I understand my membership will be finalized."
        description="Finalizing closes the current subscription period."
      />
    </CurrentSubscriptionConfirmDialog>
  );
};

export const DeleteCurrentSubscriptionDialog = () => {
  const [isConfirmed, setIsConfirmed] = useState(false);
  const { closeModal } = useModalContext();
  const { submit, isPending, error } = useDeleteCurrentSubscriptionHandler();

  return (
    <CurrentSubscriptionConfirmDialog
      variant="delete"
      isPending={isPending}
      confirmDisabled={!isConfirmed}
      error={error?.message ?? null}
      onConfirmSubmit={submit}
      onCancel={closeModal}
    >
      <SubscriptionCheckbox
        checked={isConfirmed}
        onCheckedChange={setIsConfirmed}
        disabled={isPending}
        label="I understand this action cannot be undone."
        description="Deleting removes the subscription from my account."
      />
    </CurrentSubscriptionConfirmDialog>
  );
};
