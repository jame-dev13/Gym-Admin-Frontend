import { FormSkeleton } from "@/components/skeleton";
import { SubscriptionForm } from "@/features/subscription/components/SubscriptionForm";
import { useGetSubscription } from "@/features/subscription/hooks/useFetchSubscription";
import { useEditSubscriptionHandler } from "@/features/subscription/hooks/handlers/useEditSubscriptionHandler";
import type { Identifiable } from "@/types/Types";
import { requireId } from "@/utils/utils";

export type EditSubscriptionFormProps = {
  subscriptionId: Identifiable["id"];
};

export const EditSubscriptionForm = ({
  subscriptionId,
}: EditSubscriptionFormProps) => {
  const id: Identifiable = { id: subscriptionId };
  void requireId(id);

  const { data, isLoading, error: fetchError } = useGetSubscription(id);
  const subscription = data?.data;

  const { submit, isPending } = useEditSubscriptionHandler(subscriptionId);

  if (isLoading) {
    return <FormSkeleton showLegend fields={2} />;
  }

  if (fetchError || !subscription) {
    return (
      <p role="alert" className="text-sm text-danger" aria-live="polite">
        {fetchError?.message ?? "Subscription could not be loaded"}
      </p>
    );
  }

  return (
    <SubscriptionForm
      mode="update"
      data={subscription}
      isPending={isPending}
      onSubmit={submit}
    />
  );
};
