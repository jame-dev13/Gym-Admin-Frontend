import { CheckboxInput } from "@/components/input/CheckboxInput";

const DEFAULT_PAYMENT_CONFIRMATION_LABEL =
  "I confirm that the customer has paid for this change and that I am authorized to proceed.";
const DEFAULT_PAYMENT_CONFIRMATION_DESCRIPTION =
  "Only continue once the payment has been verified.";

export type SubscriptionCheckboxProps = {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  error?: string;
  label?: string;
  description?: string;
};

export const SubscriptionCheckbox = ({
  checked,
  onCheckedChange,
  disabled = false,
  error,
  label = DEFAULT_PAYMENT_CONFIRMATION_LABEL,
  description = DEFAULT_PAYMENT_CONFIRMATION_DESCRIPTION,
}: SubscriptionCheckboxProps) => (
  <CheckboxInput
    label={label}
    description={description}
    checked={checked}
    disabled={disabled}
    error={error}
    required
    onChange={(event) => onCheckedChange(event.target.checked)}
  />
);
