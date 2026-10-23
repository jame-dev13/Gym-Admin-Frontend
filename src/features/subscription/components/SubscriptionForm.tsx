import { AppForm } from "@/components/form/AppForm";
import { Fieldset } from "@/components/form/Fieldset";
import { SubmitBtn } from "@/components/buttons/Buttons";
import { getSubscriptionFormConfig } from "@/features/subscription/services/subscription-form-config";
import type {
  SubscriptionAdminRequest,
  SubscriptionResponse,
} from "@/features/subscription/types";
import { CalendarPlus, Save } from "lucide-react";
import type React from "react";

type FormBase = {
  onSubmit: (e: React.SubmitEvent<HTMLFormElement>) => void;
  isPending: boolean;
  submitDisabled?: boolean;
  confirmation?: React.ReactNode;
};

type CreateForm = FormBase & {
  mode: "create";
};

type UpdateForm = FormBase & {
  mode: "update";
  data: SubscriptionResponse;
};

export type SubscriptionFormProps = CreateForm | UpdateForm;

const SUBSCRIPTION_FORM_CONFIG = getSubscriptionFormConfig();

export const SubscriptionForm = (props: SubscriptionFormProps) => {
  const {
    isPending,
    mode,
    onSubmit,
    confirmation,
    submitDisabled = false,
  } = props;
  const isUpdate = mode === "update";

  const defaults: SubscriptionAdminRequest | undefined = isUpdate
    ? {
        customerEmail: props.data.customerEmail,
        membership: props.data.membership,
      }
    : undefined;

  return (
    <AppForm onSubmit={onSubmit}>
      <Fieldset
        legend={isUpdate ? "Edit Subscription" : "New Subscription"}
        key={isUpdate ? props.data.id : "create"}
      >
        {SUBSCRIPTION_FORM_CONFIG.map(
          ({ key, label, name, ariaLabel, Field, required }) => (
            <Field
              key={key}
              labelText={label}
              name={name}
              aria-label={ariaLabel}
              defaultValue={defaults?.[name]}
              required={required}
            />
          ),
        )}
      </Fieldset>
      {confirmation}
      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <SubmitBtn
          Icon={isUpdate ? Save : CalendarPlus}
          aria-label={
            isUpdate
              ? "Subscription edit form submit button"
              : "Subscription create form submit button"
          }
          pendingLabel={
            isUpdate ? "Saving subscription...." : "Creating subscription...."
          }
          isPending={isPending}
          disabled={submitDisabled}
        >
          {isUpdate ? "Edit Subscription" : "Create Subscription"}
        </SubmitBtn>
      </div>
    </AppForm>
  );
};
