import { SubscriptionForm } from "@/features/subscription/components/SubscriptionForm";
import { useCreateSubscriptionHandler } from "@/features/subscription/hooks/handlers/useCreateSubscriptionHandler";

export const CreateSubscriptionForm = () => {
  const { isPending, submit } = useCreateSubscriptionHandler();

  return (
    <SubscriptionForm mode="create" isPending={isPending} onSubmit={submit} />
  );
};
