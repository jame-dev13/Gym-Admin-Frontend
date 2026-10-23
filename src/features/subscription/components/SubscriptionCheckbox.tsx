import { CheckboxInput } from "@/components/input/CheckboxInput";

const PAYMENT_CONFIRMATION_LABEL =
  "I confirm that the customer has paid for this change and that I am authorized to proceed.";
const PAYMENT_CONFIRMATION_DESCRIPTION =
  "Only continue once the payment has been verified.";

export type SubscriptionCheckboxProps = {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  error?: string;
};

export const SubscriptionCheckbox = ({
  checked,
  onCheckedChange,
  disabled = false,
  error,
}: SubscriptionCheckboxProps) => (
  <CheckboxInput
    label={PAYMENT_CONFIRMATION_LABEL}
    description={PAYMENT_CONFIRMATION_DESCRIPTION}
    checked={checked}
    disabled={disabled}
    error={error}
    required
    onChange={(event) => onCheckedChange(event.target.checked)}
  />
);
