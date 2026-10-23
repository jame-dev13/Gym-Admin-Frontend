import { useState } from "react";
import { SubscriptionCheckbox } from "@/features/subscription/components/SubscriptionCheckbox";
import { SubscriptionForm } from "@/features/subscription/components/SubscriptionForm";
import { useCreateSubscriptionHandler } from "@/features/subscription/hooks/handlers/useCreateSubscriptionHandler";

export const CreateSubscriptionForm = () => {
  const [isConfirmed, setIsConfirmed] = useState(false);
  const { isPending, submit } = useCreateSubscriptionHandler();

  return (
    <SubscriptionForm
      mode="create"
      isPending={isPending}
      submitDisabled={!isConfirmed}
      confirmation={
        <SubscriptionCheckbox
          checked={isConfirmed}
          onCheckedChange={setIsConfirmed}
          disabled={isPending}
        />
      }
      onSubmit={submit}
    />
  );
};
