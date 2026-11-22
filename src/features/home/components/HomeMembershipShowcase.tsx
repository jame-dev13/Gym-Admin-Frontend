import { MembershipShowcase } from "@/features/subscription/components/MembershipShowcase";
import { useCurrentSubscriptionDialogs } from "@/features/subscription/hooks/useCurrentSubscriptionDialogs";

/**
 * Home overview empty state.
 *
 * Wires the membership catalogue to the create-subscription dialog while the
 * catalogue itself stays presentation-only.
 */
export const HomeMembershipShowcase = () => {
  const { openCreateDialog } = useCurrentSubscriptionDialogs();

  return <MembershipShowcase onSelectMembership={openCreateDialog} />;
};

export default HomeMembershipShowcase;
